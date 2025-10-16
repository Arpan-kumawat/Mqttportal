// DeviceService.js wrapper import (unchanged)
const DeviceDataService = require("./DeviceDataService");
const dotenv = require("dotenv");
const mqtt = require("mqtt");
const WebSocket = require("ws");
const { InfluxDB, Point } = require("@influxdata/influxdb-client");

dotenv.config({ path: __dirname + "/.env" });

// -----------------------------------------------------------------------------
// ⚙️ InfluxDB Setup
// -----------------------------------------------------------------------------
const INFLUX_ENABLED = process.env.INFLUX_ENABLED === "true";
let influxWriteApi = null;

if (INFLUX_ENABLED) {
  const influxUrl = process.env.INFLUX_URL;
  const influxToken = process.env.INFLUX_TOKEN;
  const influxOrg = process.env.INFLUX_ORG;
  const influxBucket = process.env.INFLUX_BUCKET;

  if (!influxUrl || !influxToken || !influxOrg || !influxBucket) {
    console.error(
      "InfluxDB enabled but missing required env vars: INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET"
    );
  } else {
    try {
      const influxDB = new InfluxDB({ url: influxUrl, token: influxToken });
      influxWriteApi = influxDB.getWriteApi(influxOrg, influxBucket, "ms");
      influxWriteApi.useDefaultTags({ app: "mqttdash" });
      console.log("✅ InfluxDB client initialized");

      // Graceful shutdown
      const closeInflux = () => {
        if (!influxWriteApi) return;
        influxWriteApi
          .close()
          .then(() => console.log("InfluxDB write API closed"))
          .catch((err) => console.error("Error closing InfluxDB write API", err));
      };
      process.on("SIGINT", closeInflux);
      process.on("SIGTERM", closeInflux);

      // Flush periodically
      setInterval(() => {
        influxWriteApi.flush().catch((err) =>
          console.error("Error flushing InfluxDB writes:", err.message)
        );
      }, 5000);
    } catch (err) {
      console.error("Failed to initialize InfluxDB client:", err.message);
      influxWriteApi = null;
    }
  }
}

// -----------------------------------------------------------------------------
// ⚙️ MQTT Setup
// -----------------------------------------------------------------------------
let mqttData = {}; // sensors keyed by numeric sensorId or "unknown"
const gatewayInfoArray = []; // unique array of gateway GW_info objects
const clients = [];

const options = {
  username: process.env.USER_NAME,
  password: process.env.PASS,
};

const brokerUrl = process.env.MQTT_BROKER_URL;
const topic = "#";

const mqttClient = mqtt.connect(brokerUrl, options);

mqttClient.on("connect", () => {
  console.log("✅ Connected securely to MQTT broker");
  mqttClient.subscribe(topic, (err) => {
    if (err) console.error("❌ Failed to subscribe:", err);
    else console.log(`📡 Subscribed to topic: ${topic}`);
  });
});

// -----------------------------------------------------------------------------
// ⚙️ Parsing Helpers
// -----------------------------------------------------------------------------
function parseGvibData(buf) {
  if (!Buffer.isBuffer(buf) || buf.length !== 19)
    throw new Error("Invalid buffer length, expected 19 bytes");

  const sensorTypes = {
    0x00: "SVT200-T temperature sensor",
    0x01: "SVT200-V real-time vibration & temperature sensor",
    0x02: "SVT300-V real-time vibration & temperature sensor",
    0x03: "SVT400-V real-time vibration & temperature sensor",
    0x10: "SVT200-A sensor acceleration",
    0x11: "SVT200-A sensor temperature",
    0x20: "SVT300-A vibration sensor acceleration",
    0x21: "SVT300-A vibration sensor temperature",
    0x30: "SVT400-A vibration sensor acceleration",
  };

  const scaleV = parseFloat(process.env.SCALE_V) || 1;
  const scaleG = parseFloat(process.env.SCALE_G) || 1;

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
  if (endingByte1 !== 0xaa || endingByte2 !== 0x0a) {
    throw new Error("Invalid ending bytes");
  }

  return {
    sensorTypeCode,
    sensorType,
    sensorId,
    groupNumber,
    vibrationVelocity: { x: velox, y: veloy, z: veloz },
    accelerationRMS: { x: grmsx, y: grmsy, z: grmsz },
  };
}

function parseSnsInfo(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length !== 18) {
    throw new Error("Input must be a Buffer of exactly 18 bytes");
  }

  const sensorTypeMap = {
    0x01: "SVT200-V",
    0x02: "SVT300-V",
    0x03: "SVT400-V",
  };

  const sensorType = buffer[0];
  const sensorId = (buffer[1] << 8) | buffer[2];
  const batteryRaw = (buffer[3] << 8) | buffer[4];
  const mac = [];
  for (let i = 5; i <= 10; i++) mac.push(buffer[i].toString(16).padStart(2, "0"));
  const rssi = buffer[11] - 256;
  const versionRaw = buffer[12];
  const version = versionRaw / 10;
  const group = buffer[13];
  const tempRaw = (buffer[14] << 8) | buffer[15];
  const endByte1 = buffer[16];
  const endByte2 = buffer[17];
  if (endByte1 !== 0xaa || endByte2 !== 0x0a) throw new Error("Invalid end bytes");

  let batteryVoltage;
  if (version >= 2.7) batteryVoltage = batteryRaw * 0.0014648;
  else batteryVoltage = batteryRaw * 0.000879 + 0.95;

  const scale = 0.0078125;
  let temperature;
  if ((tempRaw & 0x8000) === 0x8000) temperature = -((~tempRaw + 1) & 0xffff) * scale;
  else temperature = tempRaw * scale;

  return {
    sensorType: sensorTypeMap[sensorType] || "Unknown",
    sensorId,
    batteryVoltage: parseFloat(batteryVoltage.toFixed(4)),
    macAddress: mac.join(":"),
    rssi,
    version,
    group,
    temperature: parseFloat(temperature.toFixed(4)),
  };
}

function formatMqttData(mqttDataLocal, gatewayInfoArr) {
  const sensors = [];
  let unknown = null;
  let system_active = false;

  Object.values(mqttDataLocal).forEach((sensor) => {
    if (sensor.sensorId === "unknown") {
      unknown = sensor;
    } else {
      sensors.push(sensor);
    }
  });

  sensors.sort((a, b) => a.sensorId - b.sensorId);

  if ((gatewayInfoArr && gatewayInfoArr.length > 0) || sensors.length > 0) {
    system_active = true;
  }

  return {
    sensors,
    unknown,
    gateways: gatewayInfoArr || [],
    system_active,
  };
}

// -----------------------------------------------------------------------------
// ⚙️ MQTT Message Handler (single clean handler)
// -----------------------------------------------------------------------------
mqttClient.on("message", (topic, message) => {
  try {
    let parsedData = null;
    let sensorId = null;
    let gateway = "unknown";

    // Detect gateway from topic (robust contains check)
    if (topic.includes("/GAZ/") || topic.includes("GAZ/")) gateway = "GAZ";
    else if (topic.includes("/GW028/") || topic.includes("GW028/")) gateway = "GW028";
    else if (topic.includes("/BAR/") || topic.includes("BAR/")) gateway = "BAR";

    // GW_info messages are gateway-level and handled separately
    if (topic.endsWith("GW_info")) {
      try {
        parsedData = JSON.parse(message.toString());
      } catch (e) {
        console.error("Failed to parse GW_info JSON:", e.message);
        parsedData = null;
      }

      const gwEntry = {
        gateway,
        gw_info: parsedData,
        lastUpdated: new Date().toISOString(),
      };

      const existingIndex = gatewayInfoArray.findIndex((item) => item.gateway === gateway);
      if (existingIndex !== -1) {
        gatewayInfoArray[existingIndex] = gwEntry;
      } else {
        gatewayInfoArray.push(gwEntry);
      }

      // Write GW_info numeric fields to Influx (if available)
      if (INFLUX_ENABLED && influxWriteApi && parsedData) {
        try {
          const point = new Point("sensor_data").tag("topic", topic).tag("gateway", gateway);
          Object.entries(parsedData).forEach(([k, v]) => {
            if (typeof v === "number") point.floatField(k, v);
          });
          point.timestamp(new Date());
          influxWriteApi.writePoint(point);
        } catch (err) {
          console.error("Error writing GW_info to InfluxDB:", err.message);
        }
      }
    } else {
      // Non-GW_info messages: gvib, sns_info, others
      if (topic.endsWith("gvib")) {
        try {
          parsedData = parseGvibData(message);
        } catch (err) {
          // If parse fails, store raw
          console.error("parseGvibData error:", err.message);
          parsedData = null;
        }
        sensorId = parsedData?.sensorId;
      } else if (topic.endsWith("sns_info")) {
        try {
          parsedData = parseSnsInfo(message);
        } catch (err) {
          console.error("parseSnsInfo error:", err.message);
          parsedData = null;
        }
        sensorId = parsedData?.sensorId;
      } else {
        parsedData = message.toString();
        sensorId = "unknown";
      }

      // Normalize sensorId to numeric string if possible
      if (typeof sensorId === "string") {
        const m = sensorId.match(/\d+$/);
        if (m) sensorId = m[0];
      }

      if (!sensorId) sensorId = "unknown";

      if (!mqttData[sensorId]) mqttData[sensorId] = { sensorId, gateway };

      if (topic.endsWith("gvib")) mqttData[sensorId].gvib = parsedData;
      else if (topic.endsWith("sns_info")) mqttData[sensorId].sns_info = parsedData;
      else mqttData[sensorId].raw = parsedData;

      mqttData[sensorId].gateway = gateway;
      mqttData[sensorId].lastUpdated = new Date().toISOString();

      // Influx for sensor messages
      if (INFLUX_ENABLED && influxWriteApi && parsedData) {
        try {
          const point = new Point("sensor_data")
            .tag("topic", topic)
            .tag("gateway", gateway);

          if (sensorId !== "unknown") point.tag("sensorId", sensorId.toString());
          if (parsedData.sensorType) point.tag("sensorType", parsedData.sensorType);
          if (parsedData.groupNumber !== undefined)
            point.tag("group", parsedData.groupNumber.toString());

          if (topic.endsWith("gvib")) {
            const { vibrationVelocity, accelerationRMS } = parsedData;
            point
              .floatField("velox", vibrationVelocity?.x || 0)
              .floatField("veloy", vibrationVelocity?.y || 0)
              .floatField("veloz", vibrationVelocity?.z || 0)
              .floatField("grmsx", accelerationRMS?.x || 0)
              .floatField("grmsy", accelerationRMS?.y || 0)
              .floatField("grmsz", accelerationRMS?.z || 0);
          } else if (topic.endsWith("sns_info")) {
            point
              .floatField("temperature", parsedData.temperature || 0)
              .floatField("batteryVoltage", parsedData.batteryVoltage || 0)
              .intField("rssi", parsedData.rssi || 0)
              .floatField("version", parsedData.version || 0);
          }

          point.timestamp(new Date());
          influxWriteApi.writePoint(point);
        } catch (err) {
          console.error("Error writing sensor data to InfluxDB:", err.message);
        }
      }
    }

    // Broadcast updated data to WebSocket clients
    const payload = {
      type: "update",
      data: formatMqttData(mqttData, gatewayInfoArray),
    };

    const newMessage = JSON.stringify(payload);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(newMessage);
    });
  } catch (error) {
    console.error("Error processing MQTT message:", error.message);
  }
});

// -----------------------------------------------------------------------------
// ⚙️ Service + Helpers
// -----------------------------------------------------------------------------
class DeviceService {
  constructor() {
    this._DeviceDataService = new DeviceDataService();
  }

  async GetData() {
    return formatMqttData(mqttData, gatewayInfoArray);
  }

  async GetHistoryData(body) {
    const result = await this._DeviceDataService.GetHistoryData(body);
    return result;
  }
}

function addClient(ws) {
  if (!clients.includes(ws)) clients.push(ws);
}
function removeClient(ws) {
  const idx = clients.indexOf(ws);
  if (idx > -1) clients.splice(idx, 1);
}
function getFormattedData() {
  return formatMqttData(mqttData, gatewayInfoArray);
}

// -----------------------------------------------------------------------------
// ⚙️ Query Helper
// -----------------------------------------------------------------------------
async function querySensorData(sensorId, start = "-1h", end = "now()") {
  if (!INFLUX_ENABLED) throw new Error("InfluxDB not enabled");

  const influxDB = new InfluxDB({
    url: process.env.INFLUX_URL,
    token: process.env.INFLUX_TOKEN,
  });
  const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG);

  const fluxQuery = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: ${JSON.stringify(start)}, stop: ${JSON.stringify(end)})
      |> filter(fn: (r) => r["_measurement"] == "sensor_data")
      |> filter(fn: (r) => r["sensorId"] == "${sensorId}")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"])
  `;

  const rows = [];
  await new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        rows.push(tableMeta.toObject(row));
      },
      error(err) {
        reject(err);
      },
      complete() {
        resolve();
      },
    });
  });
  return rows;
}

// -----------------------------------------------------------------------------
// 📦 Exports
// -----------------------------------------------------------------------------
module.exports = DeviceService;
module.exports.addClient = addClient;
module.exports.removeClient = removeClient;
module.exports.getFormattedData = getFormattedData;
module.exports.querySensorData = querySensorData;
