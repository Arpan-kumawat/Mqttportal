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

  const [vibrationData, setVibrationData] = useState([]);
  const [accelerationData, setAccelerationData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);

  const isMounted = useRef(true);

  // --- Sensor and Axis Handlers ---
  const handleChangeSensor = (event, newValue) => {
    const values = Array.isArray(newValue) ? newValue : [newValue];
    setSelectedSensor(values.includes("all") || values.length === 0 ? ["all"] : values);
  };

  const handleChangeAxis = (event, newValue) => {
    const values = Array.isArray(newValue) ? newValue : [newValue];
    setSelectedAxis(values.includes("all") || values.length === 0 ? ["all"] : values);
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

      rawData.forEach((sensor) => {
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
            accelerationRecords.push({ time, sensorId: sensor.sensorId, x, y, z });
          }

          // Temperature
          const temp =
            h.sns_info?.temperature ??
            h.sns_info?.temprature ??
            h.snsInfo?.temperature ??
            h.snsInfo?.temprature;
          if (temp != null) {
            temperatureRecords.push({ time, sensorId: sensor.sensorId, value: Number(temp) });
          }
        });
      });

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
        setAccelerationData(prepareChartData(accelerationRecords, "acceleration"));
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
      <div className="flex flex-wrap items-center gap-4 mb-4">
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

        {/* <Stack sx={{ width: 120 }}>
          <Select multiple size="sm" value={selectedAxis} onChange={handleChangeAxis}>
            <Option value="all">
              <Checkbox checked={selectedAxis.includes("all")} /> All Axis
            </Option>
            {["x", "y", "z"].map((axis) => (
              <Option key={axis} value={axis}>
                <Checkbox checked={selectedAxis.includes(axis)} /> {axis.toUpperCase()}
              </Option>
            ))}
          </Select>
        </Stack> */}

        <Button onClick={handleSubmit} variant="outlined" size="sm" startDecorator={<Play />}>
          {loading ? "Loading..." : "Load Data"}
        </Button>
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
