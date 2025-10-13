import React, { useState, useMemo, useRef } from "react";
import { Button, Stack, Select, Option, Checkbox } from "@mui/joy";
import { Play, Pause } from "lucide-react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { getHistoryData } from "../utils/helper";
import HistoryGraph from "../components/HistoryGraph"; // your reusable card component

export default function History() {
  const [selectedSensor, setSelectedSensor] = useState(["all"]);
  const [selectedAxis, setSelectedAxis] = useState(["all"]);
  const [fromDate, setFromDate] = useState(dayjs().subtract(2, "hour"));
  const [toDate, setToDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const [totalSensors, settTotalSensors] = useState([]);
  const [vibrationData, setVibrationData] = useState([]);
  const [accelerationData, setAccelerationData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);

  const isMounted = useRef(true);

  // --- Sensor and Axis Handlers ---
  const handleChange = (event, newValue) => {
    // Ensure newValue is an array for multiple select
    const values = Array.isArray(newValue) ? newValue : [newValue];
    const prev = selectedSensor || [];

    // If 'all' is included in the new values
    if (values.includes("all")) {
      // If previous selection did NOT include 'all', the user just clicked 'all' -> select only 'all'
      if (!prev.includes("all")) {
        setSelectedSensor(["all"]);
        return;
      }

      // If previous included 'all' but new values also include other sensors (user clicked an individual sensor while 'all' was selected),
      // remove 'all' and keep the individual sensors
      if (values.length > 1) {
        setSelectedSensor(values.filter((v) => v !== "all"));
        return;
      }

      // Fallback: keep only 'all'
      setSelectedSensor(["all"]);
      return;
    }

    // If no 'all' in new selection and user cleared everything, fall back to 'all'
    if (values.length === 0) {
      setSelectedSensor(["all"]);
      return;
    }

    // Normal case: set the selected sensors (individual sensors selected while 'all' not involved)
    setSelectedSensor(values);
  };

 const handleChangeAxis = (event, newValue) => {
    // Ensure newValue is an array for multiple select
    const values = Array.isArray(newValue) ? newValue : [newValue];
    const prev = selectedAxis || [];

    // If 'all' is included in the new values
    if (values.includes("all")) {
      // If previous selection did NOT include 'all', the user just clicked 'all' -> select only 'all'
      if (!prev.includes("all")) {
        setSelectedAxis(["all"]);
        return;
      }

      // If previous included 'all' but new values also include other axes (user clicked an individual axis while 'all' was selected),
      // remove 'all' and keep the individual axes
      if (values.length > 1) {
        setSelectedAxis(values.filter((v) => v !== "all"));
        return;
      }

      // Fallback: keep only 'all'
      setSelectedAxis(["all"]);
      return;
    }

    // If no 'all' in new selection and user cleared everything, fall back to 'all'
    if (values.length === 0) {
      setSelectedAxis(["all"]);
      return;
    }

    // Normal case: set the selected axes (individual axes selected while 'all' not involved)
    setSelectedAxis(values);
  };

  // --- Fetch History Data ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await getHistoryData({
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      });

      const rawData = res.data;

      const vibrationRecords = [];
      const accelerationRecords = [];
      const temperatureRecords = [];

      const allSensorIds = [];

      rawData.forEach((sensor) => {
        if (sensor.sensorId != null) {
          // ✅ only include valid IDs
          allSensorIds.push(sensor.sensorId);
        }

        sensor.history.forEach((h) => {
          const roundedTime = new Date(h.lastUpdated);
          roundedTime.setMilliseconds(0);
          const time = roundedTime.toISOString();

          // Vibration
          if (h.gvib?.vibrationVelocity) {
            const { x, y, z } = h.gvib.vibrationVelocity;
            vibrationRecords.push({ time, sensorId: sensor.sensorId, x, y, z });
          }

          // Acceleration
          if (h.gvib?.accelerationRMS) {
            const { x, y, z } = h.gvib.accelerationRMS;
            accelerationRecords.push({
              time,
              sensorId: sensor.sensorId,
              x,
              y,
              z,
            });
          }

          // Temperature
          const temp =
            h.sns_info?.temperature ??
            h.sns_info?.temprature ??
            h.snsInfo?.temperature ??
            h.snsInfo?.temprature;
          if (temp != null) {
            temperatureRecords.push({
              time,
              sensorId: sensor.sensorId,
              value: Number(temp),
            });
          }
        });
      });

      // Remove duplicates and nulls
      const uniqueSensorIds = [
        ...new Set(allSensorIds.filter((id) => id != null)),
      ];

      settTotalSensors(uniqueSensorIds);

      const prepareChartData = (records, type) => {
        const timestamps = [...new Set(records.map((r) => r.time))].sort(
          (a, b) => new Date(a) - new Date(b)
        );
        const sensorIds = [...new Set(records.map((r) => r.sensorId))];

        const timeMap = {};
        timestamps.forEach((t) => (timeMap[t] = { time: t }));

        records.forEach((r) => {
          const row = timeMap[r.time];
          if (type === "temperature") row[`${r.sensorId}_temp`] = r.value;
          else {
            row[`${r.sensorId}_x`] = r.x;
            row[`${r.sensorId}_y`] = r.y;
            row[`${r.sensorId}_z`] = r.z;
          }
        });

        return timestamps.map((t) => {
          const row = { ...timeMap[t] };
          sensorIds.forEach((id) => {
            if (type !== "temperature") {
              if (!(`${id}_x` in row)) row[`${id}_x`] = null;
              if (!(`${id}_y` in row)) row[`${id}_y`] = null;
              if (!(`${id}_z` in row)) row[`${id}_z`] = null;
            } else {
              if (!(`${id}_temp` in row)) row[`${id}_temp`] = null;
            }
          });
          return row;
        });
      };

      if (isMounted.current) {
        setVibrationData(prepareChartData(vibrationRecords, "vibration"));
        setAccelerationData(
          prepareChartData(accelerationRecords, "acceleration")
        );
        setTemperatureData(prepareChartData(temperatureRecords, "temperature"));
      }
    } catch (err) {
      console.error("Failed to fetch history data:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="From"
              value={fromDate}
              onChange={(val) => setFromDate(val)}
              slotProps={{ textField: { size: "small", sx: { width: 200 } } }}
            />
            <DateTimePicker
              label="To"
              value={toDate}
              onChange={(val) => setToDate(val)}
              slotProps={{ textField: { size: "small", sx: { width: 200 } } }}
            />
          </LocalizationProvider>

          <Button
            onClick={handleSubmit}
            style={{ background: "#21409a" }}
            size="sm"
          >
            {loading ? "Loading..." : "Load Data"}
          </Button>
        </div>

        <div className="text-sm text-gray-500 flex items-center gap-4">
            {totalSensors?.length ? <> 
          <Stack sx={{ m: 1, mr: 0, width: 150 }}>
            <Select
              multiple
              size="sm"
              value={selectedSensor}
              onChange={handleChange}
            >
              <Option value="all">
                <Checkbox
                  size="sm"
                  checked={selectedSensor.includes("all")}
                  sx={{ mr: 1 }}
                />
                All Sensors
              </Option>
              {totalSensors?.map((item) => (
                <Option key={item} value={item}>
                  <Checkbox
                    size="sm"
                    checked={selectedSensor.includes(item)}
                    sx={{ mr: 1 }}
                  />
                  Sensor {item}
                </Option>
              ))}
            </Select>
          </Stack>

          <Stack sx={{ m: 1, width: 100 }}>
            <Select
              multiple
              size="sm"
              value={selectedAxis}
              onChange={handleChangeAxis}
            >
              <Option value="all">
                <Checkbox
                  size="sm"
                  checked={selectedAxis.includes("all")}
                  sx={{ mr: 1 }}
                />
                All Axis
              </Option>
              <Option value="x">
                <Checkbox
                  size="sm"
                  checked={selectedAxis.includes("x")}
                  sx={{ mr: 1 }}
                />
                x
              </Option>
              <Option value="y">
                <Checkbox
                  size="sm"
                  checked={selectedAxis.includes("y")}
                  sx={{ mr: 1 }}
                />
                y
              </Option>
              <Option value="z">
                <Checkbox
                  size="sm"
                  checked={selectedAxis.includes("z")}
                  sx={{ mr: 1 }}
                />
                z
              </Option>
            </Select>
          </Stack>  </> :""}
        </div>
      </div>

      {/* --- Render the 3 Graphs --- */}

      <HistoryGraph
        title="Velocity RMS"
        type="vibration"
        data={vibrationData}
        format="vibration"
        selectedSensor={selectedSensor}
        selectedAxis={selectedAxis}
      />
      <HistoryGraph
        title="Acceleration RMS"
        type="acceleration"
        format="acceleration"
        data={accelerationData}
        selectedSensor={selectedSensor}
        selectedAxis={selectedAxis}
      />
      <HistoryGraph
        title="Temperature"
        type="temperature"
        format="temperature"
        data={temperatureData}
        selectedSensor={selectedSensor}
        selectedAxis={selectedAxis}
      />
    </div>
  );
}
