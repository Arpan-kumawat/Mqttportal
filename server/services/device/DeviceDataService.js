// DeviceDataService.js
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });
const { InfluxDB } = require("@influxdata/influxdb-client");

// -----------------------------------------------------------------------------
// ⚙️ InfluxDB Setup
// -----------------------------------------------------------------------------
const INFLUX_ENABLED = "true";

async function querySensorData(sensorId, start = "-1h", end = "now()") {
  if (!INFLUX_ENABLED) throw new Error("InfluxDB not enabled");

  const influxDB = new InfluxDB({
    url: process.env.INFLUX_URL,
    token: process.env.INFLUX_TOKEN,
  });
  const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG);

  // ✅ DO NOT wrap start/end in quotes — let Flux interpret them correctly
  const fluxQuery = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: ${start}, stop: ${end})
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
// ⚙️ DeviceDataService Class
// -----------------------------------------------------------------------------
class DeviceDataService {
  async GetHistoryData(body) {
    const { sensor, from, to } = body;

    if (!sensor) throw new Error("Sensor ID is required");

    const startTime = from ? new Date(from).toISOString() : "-1h";
    const endTime = to ? new Date(to).toISOString() : "now()";

    try {
      const data = await querySensorData(sensor, startTime, endTime);
      return data;
    } catch (error) {
      console.error("❌ Error fetching history data:", error.message);
      throw error;
    }
  }
}

module.exports = DeviceDataService;
