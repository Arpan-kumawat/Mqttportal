mqttClient.on('message', (topic, message) => {
  try {
    // message can be Buffer or string (Buffer by default)
    const payloadStr = message.toString();

    // Try to detect JSON string (starts with { or [)
    if (payloadStr.startsWith('{') || payloadStr.startsWith('[')) {
      // Parse JSON
      const parsedJson = JSON.parse(payloadStr);
      mqttData = { topic, data: parsedJson, timestamp: new Date().toISOString() };
    }
    // Try key=value format, e.g. "GW_info = {...}"
    else if (payloadStr.includes('=')) {
      // Split on '=' and trim
      const [key, val] = payloadStr.split('=').map(s => s.trim());

      // Try to parse val as JSON, else keep as string
      let parsedVal;
      try {
        parsedVal = JSON.parse(val);
      } catch {
        parsedVal = val;
      }

      mqttData = { topic, [key]: parsedVal, timestamp: new Date().toISOString() };
    }
    // Else, try to decode binary sensor data if buffer length sufficient
    else if (message.length >= 17) {
      const buf = message;

      const scalev = 409.6;    // scale factor for vibration velocity
      const scaleg = 2367.135; // scale factor for acceleration RMS

      const velox = buf.readUInt16BE(5) / scalev;
      const veloy = buf.readUInt16BE(7) / scalev;
      const veloz = buf.readUInt16BE(9) / scalev;

      const grmsx = buf.readUInt16BE(11) / scaleg;
      const grmsy = buf.readUInt16BE(13) / scaleg;
      const grmsz = buf.readUInt16BE(15) / scaleg;

      mqttData = {
        velocity: { x: velox, y: veloy, z: veloz },
        accelerationRMS: { x: grmsx, y: grmsy, z: grmsz },
        topic,
        timestamp: new Date().toISOString()
      };
    }
    else {
      // Fallback: store as plain string if nothing else matches
      mqttData = { topic, message: payloadStr, timestamp: new Date().toISOString() };
    }

    // Prepare message for WebSocket broadcast
    const newMessage = JSON.stringify({ type: 'update', data: mqttData });

    // Broadcast to WebSocket clients
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(newMessage);
      }
    });

    console.log('Received MQTT message:', mqttData);

  } catch (error) {
    console.error('Error processing MQTT message:', error.message);
  }
});



{
  "free": 1685,             "Gateway free memory, Mega bytes"
  "buffers": 68,             "Gateway memory buffered ,Mega bytes"
  "cached": 996,             "Gateway memory cached , Mega bytes"
  "active": 562,              "Gateway memory active ,Mega bytes"
  "temperature": 53.069,       "Gateway CPU temperature 0"
  "overall": 14.25,           "Gateway CPU overall usage %"
  "drv_tot": 61123,           "Total drive space ,Mega bytes"
  "drv_usd": 9.12892,         "Drive space used ,Mega bytes"
  "uptime": "10d-22h-52m-30s",   "Gateway running time"
  "name": "GW028",              "Gateway name N/A"
  "latitude": 10,                "Gateway location latitude Degree",
  "longitude": 10           ,    "Gateway location longitude Degree"
}

"gvib" : "General vibration level measurements from SVT200-V sensor" "size: 19"

"sns_info" : "Sensor information including type, id, group number,mac address, RSSI (Received Signal StrengthIndicator) and firmware version; For SVT-V series sensors, sensor information also includes temperature measurement"


Sensor type                                                  Value
SVT200-T temperature sensor                                  0x00
SVT200-V real-time vibration & temperature sensor              0x01
SVT300-V real-time vibration & temperature sensor              0x02
SVT400-V real-time vibration & temperature sensor              0x03
SVT200-A sensor acceleration                                   0x10
SVT200-A sensor temperature                                    0x11
SVT300-A vibration sensor acceleration                            0x20
SVT300-A vibration sensor temperature                            0x21
SVT400-A vibration sensor acceleration                            0x30
