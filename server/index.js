const mqtt = require('mqtt');
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/.env' });

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;

let mqttData = {};
const clients = [];

// MQTT Connection options
const options = {
    username: process.env.USER_NAME,
    password: process.env.PASS,
};

const brokerUrl = process.env.MQTT_BROKER_URL;
const topic = '#';

const mqttClient = mqtt.connect(brokerUrl, options);

mqttClient.on('connect', () => {
    console.log('✅ Connected securely to MQTT broker');
    mqttClient.subscribe(topic, (err) => {
        if (err) {
            console.error('❌ Failed to subscribe:', err);
        } else {
            console.log(`📡 Subscribed to topic: ${topic}`);
        }
    });
});


function parseGvibData(buf) {
    if (buf.length !== 19) {
        throw new Error("Invalid buffer length, expected 19 bytes");
    }

    const sensorTypes = {
        0x00: "SVT200-T temperature sensor",
        0x01: "SVT200-V real-time vibration & temperature sensor",
        0x02: "SVT300-V real-time vibration & temperature sensor",
        0x03: "SVT400-V real-time vibration & temperature sensor",
        0x10: "SVT200-A sensor acceleration",
        0x11: "SVT200-A sensor temperature",
        0x20: "SVT300-A vibration sensor acceleration",
        0x21: "SVT300-A vibration sensor temperature",
        0x30: "SVT400-A vibration sensor acceleration"
    };

    const scaleV = 409.6;
    const scaleG = 2367.135;

    const sensorTypeCode = buf.readUInt8(0);
    const sensorType = sensorTypes[sensorTypeCode] || "Unknown";

    const sensorId = (buf.readUInt8(1) << 8) | buf.readUInt8(2);
    const groupNumber = buf.readUInt8(3);

    const velox = buf.readUInt16BE(5) / scaleV;
    const veloy = buf.readUInt16BE(7) / scaleV;
    const veloz = buf.readUInt16BE(9) / scaleV;

    const grmsx = buf.readUInt16BE(11) / scaleG;
    const grmsy = buf.readUInt16BE(13) / scaleG;
    const grmsz = buf.readUInt16BE(15) / scaleG;

    const endingByte1 = buf.readUInt8(17);
    const endingByte2 = buf.readUInt8(18);

    if (endingByte1 !== 0xAA || endingByte2 !== 0x0A) {
        throw new Error("Invalid ending bytes");
    }

    return {
        sensorTypeCode,
        sensorType,
        sensorId,
        groupNumber,
        vibrationVelocity: { x: velox, y: veloy, z: veloz },
        accelerationRMS: { x: grmsx, y: grmsy, z: grmsz }
    };
}


function parseSnsInfo(buffer) {
    if (!Buffer.isBuffer(buffer) || buffer.length !== 18) {
        throw new Error('Input must be a Buffer of exactly 18 bytes');
    }

    // Sensor type map
    const sensorTypeMap = {
        0x01: 'SVT200-V',
        0x02: 'SVT300-V',
        0x03: 'SVT400-V',
    };

    // Read bytes
    const sensorType = buffer[0];
    const sensorId = (buffer[1] << 8) | buffer[2];
    const batteryRaw = (buffer[3] << 8) | buffer[4];
    const mac = [];
    for (let i = 5; i <= 10; i++) {
        mac.push(buffer[i].toString(16).padStart(2, '0'));
    }
    const rssi = -buffer[11];
    const versionRaw = buffer[12];
    const version = versionRaw / 10;
    const group = buffer[13];
    const tempRaw = (buffer[14] << 8) | buffer[15];
    const endByte1 = buffer[16];
    const endByte2 = buffer[17];

    // Validate end bytes
    if (endByte1 !== 0xAA || endByte2 !== 0x0A) {
        throw new Error('Invalid end bytes');
    }

    // Calculate battery voltage based on version
    let batteryVoltage;
    if (version >= 2.7) {
        batteryVoltage = batteryRaw * 0.0014648;
    } else {
        batteryVoltage = batteryRaw * 0.000879 + 0.95;
    }

    // Calculate temperature with sign
    const scale = 0.0078125;
    let temperature;
    if ((tempRaw & 0x8000) === 0x8000) {
        // Negative number: two's complement
        temperature = -((~tempRaw + 1) & 0xFFFF) * scale;
    } else {
        temperature = tempRaw * scale;
    }

    return {
        sensorType: sensorTypeMap[sensorType] || 'Unknown',
        sensorId,
        batteryVoltage: parseFloat(batteryVoltage.toFixed(4)),
        macAddress: mac.join(':'),
        rssi,
        version,
        group,
        temperature: parseFloat(temperature.toFixed(4)),
    };
}

// mqttClient.on('message', (topic, message) => {
//     try {
//         let dataToSend;

//         // If the topic ends with 'GW_info' (JSON topic)
//         if (topic.endsWith('GW_info')) {
//             const payloadStr = message.toString();
//             dataToSend = JSON.parse(payloadStr);  // parse JSON directly
//         }

//         // If topic ends with  'gvib' (binary topics)
//         else if (topic.endsWith('gvib')) {
//             dataToSend = parseGvibData(message);
//             // console.log('Parsed Data:', dataToSend);

//         }

//         // If topic ends with  'sns_info' (binary topics)
//         else if (topic.endsWith('sns_info')) {
//             dataToSend = parseSnsInfo(message);
//             console.log('sns_info Data:', dataToSend);

//         }

//         // For all other topics or unknown payloads, send raw string
//         else {
//             dataToSend = message.toString();
//         }

//         mqttData = {
//             topic,
//             data: dataToSend,
//             timestamp: new Date().toISOString()
//         };

//         const newMessage = JSON.stringify({ type: 'update', data: mqttData });

//         clients.forEach(client => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(newMessage);
//             }
//         });

//         console.log(`Received message on topic ${topic}:`, mqttData);
//     } catch (error) {
//         console.error('Error processing MQTT message:', error.message);
//     }
// });

mqttClient.on('message', (topic, message) => {
    try {
        let parsedData;
        let sensorId;

        if (topic.endsWith('GW_info')) {
            parsedData = JSON.parse(message.toString());
            sensorId = parsedData?.sensorId || 'gateway'; // fallback if no sensorId
        }
        else if (topic.endsWith('gvib')) {
            parsedData = parseGvibData(message);
            sensorId = parsedData.sensorId;
        }
        else if (topic.endsWith('sns_info')) {
            parsedData = parseSnsInfo(message);
            sensorId = parsedData.sensorId;
        }
        else {
            parsedData = message.toString();
            sensorId = "unknown";
        }

        if (!sensorId) sensorId = "unknown";

        // Initialize sensor object if not exists
        if (!mqttData[sensorId]) {
            mqttData[sensorId] = { sensorId };
        }

        // Group data by type (gw_info, gvib, sns_info)
        if (topic.endsWith('GW_info')) {
            mqttData[sensorId].gw_info = parsedData;
        } 
        else if (topic.endsWith('gvib')) {
            mqttData[sensorId].gvib = parsedData;
        } 
        else if (topic.endsWith('sns_info')) {
            mqttData[sensorId].sns_info = parsedData;
        } 
        else {
            mqttData[sensorId].raw = parsedData;
        }

        mqttData[sensorId].lastUpdated = new Date().toISOString();

        // Send full dataset to all WS clients
        const newMessage = JSON.stringify({ type: 'update', data: mqttData });
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(newMessage);
            }
        });

        console.log(`✅ Updated sensor ${sensorId}:`, mqttData[sensorId]);

    } catch (error) {
        console.error('Error processing MQTT message:', error.message);
    }
});



// WebSocket handling
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    clients.push(ws);

    // Send current data on connect
    ws.send(JSON.stringify({ type: 'init', data: mqttData }));

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        const index = clients.indexOf(ws);
        if (index > -1) clients.splice(index, 1);
    });
});

// API to return all stored messages
app.get('/data', (req, res) => {
    res.json(mqttData);
});

// Listen on the HTTP server, not just Express app
server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
