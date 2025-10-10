// DeviceDataService.js
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });
const { InfluxDB } = require("@influxdata/influxdb-client");

const INFLUX_ENABLED =  true;

async function querySensorData( start = "-1h", end = "now()") {
  if (!INFLUX_ENABLED) throw new Error("InfluxDB not enabled");

  const influxDB = new InfluxDB({
    url: process.env.INFLUX_URL,
    token: process.env.INFLUX_TOKEN,
  });

  const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG);

  // 🧠 Remove quotes completely, use raw timestamps
  const fluxQuery = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: ${start}, stop: ${end})
      |> filter(fn: (r) => r["_measurement"] == "sensor_data")
    
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

function transformInfluxData(rawData) {
  // Map: sensorId -> array of records
  const sensorMap = new Map();

  rawData.forEach(item => {
    const sensorId = Number(item.sensorId);

    if (!sensorMap.has(sensorId)) {
      sensorMap.set(sensorId, []);
    }

    const record = {
      lastUpdated: item._time,
      gvib: null,
      sns_info: null,
    };

    if (item.topic?.endsWith("gvib")) {
      record.gvib = {
        sensorTypeCode: 3, // can map dynamically if needed
        sensorType: item.sensorType,
        sensorId: sensorId,
        groupNumber: item.group ? Number(item.group) : null,
        vibrationVelocity: {
          x: item.velox ?? 0,
          y: item.veloy ?? 0,
          z: item.veloz ?? 0,
        },
        accelerationRMS: {
          x: item.grmsx ?? 0,
          y: item.grmsy ?? 0,
          z: item.grmsz ?? 0,
        },
      };
    } else if (item.topic?.endsWith("sns_info")) {
      record.sns_info = {
        sensorType: item.sensorType,
        sensorId: sensorId,
        batteryVoltage: item.batteryVoltage ?? 0,
        macAddress: item.macAddress ?? "",
        rssi: item.rssi ?? 0,
        version: item.version ?? 0,
        group: item.group ? Number(item.group) : null,
        temperature: item.temperature ?? 0,
      };
    }

    sensorMap.get(sensorId).push(record);
  });

  // Convert Map to array of objects with sensorId and history array
  const result = Array.from(sensorMap.entries()).map(([sensorId, history]) => ({
    sensorId,
    history, // array of { lastUpdated, gvib, sns_info }
  }));

  return result;
}




class DeviceDataService {
  async GetHistoryData(body) {
    const { from, to } = body;

    let startTime = "-1h";
    let endTime = "now()";

    // ✅ Format timestamps correctly (no quotes)
    if (from && to) {
      startTime = new Date(from).toISOString(); // e.g., 2025-10-09T10:00:00Z
      endTime = new Date(to).toISOString();     // e.g., 2025-10-09T12:00:00Z
    }

    try {
      const data = await querySensorData( startTime, endTime);
      const transformed = transformInfluxData(data);

                        
      return  transformed
    } catch (error) {
      console.error("❌ Error fetching history data:", error.message);
      throw error;
    }
  }
}

module.exports = DeviceDataService;
