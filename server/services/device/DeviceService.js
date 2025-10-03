
const DeviceDataService = require("./DeviceDataService");
const dotenv = require('dotenv');
const mqtt = require('mqtt');
const WebSocket = require('ws');
dotenv.config({ path: __dirname + '/.env' });

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

// MQTT connect handler — register once at module init
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
    if (buf.length !== 19) throw new Error("Invalid buffer length, expected 19 bytes");

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

    const sensorTypeMap = {
        0x01: 'SVT200-V',
        0x02: 'SVT300-V',
        0x03: 'SVT400-V',
    };

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
    if (endByte1 !== 0xAA || endByte2 !== 0x0A) {
        throw new Error('Invalid end bytes');
    }

    let batteryVoltage;
    if (version >= 2.7) {
        batteryVoltage = batteryRaw * 0.0014648;
    } else {
        batteryVoltage = batteryRaw * 0.000879 + 0.95;
    }

    const scale = 0.0078125;
    let temperature;
    if ((tempRaw & 0x8000) === 0x8000) {
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

// Format mqttData -> { array, unknown, gateway }
function formatMqttData(mqttDataLocal) {
    const array = [];
    let unknown = null;
    let gateway = null;

    Object.values(mqttDataLocal).forEach(sensor => {
        if (sensor.sensorId === "unknown") {
            unknown = sensor;
        } else if (sensor.sensorId === "gateway") {
            gateway = sensor;
        } else {
            array.push(sensor);
        }
    });

    // sort by sensorId
    array.sort((a, b) => a.sensorId - b.sensorId);

    return { array, unknown, gateway };
}

mqttClient.on('message', (topic, message) => {
    try {
        let parsedData;
        let sensorId;

        if (topic.endsWith('GW_info')) {
            parsedData = JSON.parse(message.toString());
            sensorId = parsedData?.sensorId || 'gateway';
        } else if (topic.endsWith('gvib')) {
            parsedData = parseGvibData(message);
            sensorId = parsedData.sensorId;
        } else if (topic.endsWith('sns_info')) {
            parsedData = parseSnsInfo(message);
            sensorId = parsedData.sensorId;
        } else {
            parsedData = message.toString();
            sensorId = "unknown";
        }

        if (!sensorId) sensorId = "unknown";

        if (!mqttData[sensorId]) {
            mqttData[sensorId] = { sensorId };
        }

        if (topic.endsWith('GW_info')) {
            mqttData[sensorId].gw_info = parsedData;
        } else if (topic.endsWith('gvib')) {
            mqttData[sensorId].gvib = parsedData;
        } else if (topic.endsWith('sns_info')) {
            mqttData[sensorId].sns_info = parsedData;
        } else {
            mqttData[sensorId].raw = parsedData;
        }

        mqttData[sensorId].lastUpdated = new Date().toISOString();

        // Broadcast structured dataset
        const newMessage = JSON.stringify({ type: 'update', data: formatMqttData(mqttData) });
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(newMessage);
            }
        });

        // console.log(`✅ Updated sensor ${sensorId}:`, mqttData[sensorId]);

    } catch (error) {
        console.error('Error processing MQTT message:', error.message);
    }
});

class DeviceService {
    constructor() {
        this._DeviceDataService = new DeviceDataService();
    }

    async GetData() {
        // return the current snapshot; controllers should handle HTTP responses
        return formatMqttData(mqttData);
    }
}

// Helper functions to integrate with an external WebSocket server
function addClient(ws) {
    if (!clients.includes(ws)) {
        clients.push(ws);
    }
}

function removeClient(ws) {
    const idx = clients.indexOf(ws);
    if (idx > -1) clients.splice(idx, 1);
}

function getFormattedData() {
    return formatMqttData(mqttData);
}

// Export the DeviceService class (for controllers) and attach helpers so other modules
// can require the class and call helpers like require(...).addClient(ws)
module.exports = DeviceService;
module.exports.addClient = addClient;
module.exports.removeClient = removeClient;
module.exports.getFormattedData = getFormattedData;
