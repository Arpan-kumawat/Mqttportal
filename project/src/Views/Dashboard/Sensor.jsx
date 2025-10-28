import React, { useState } from "react";
import { Card, CardContent, Typography } from "@mui/joy";
import RealtimeGraph from "../../components/RealtimeGraph";
import { Select, Option, Checkbox, FormLabel, Stack } from "@mui/joy";
import { useWebSocket } from "../../hooks/useWebSocket";

export default function Sensor({onNewAlert}) {
  const { data, isConnected, aiInsights } = useWebSocket();

  const getAnomalies = (type) => {
    const series = data[type] || [];
    return data.anomalies.filter((anomaly) =>
      series.some((point) => point.timestamp === anomaly.timestamp)
    );
  };

  let selectedGatwat = localStorage.getItem("GateWay");

  let filterSensor = data?.sensor?.list?.filter(
    (e) => e?.gateway == selectedGatwat
  );

  const [selectedSensor, setSelectedSensor] = useState(["all"]);
  const [selectedAxis, setSelectedAxis] = useState(["all"]);

  const dataCard = [
    { velocity: "0.71 mm/s", colors: ["green", "green", "green", "green"] },
    { velocity: "1.12 mm/s", colors: ["yellow", "green", "green", "green"] },
    { velocity: "1.80 mm/s", colors: ["yellow", "yellow", "green", "green"] },
    { velocity: "2.80 mm/s", colors: ["orange", "yellow", "yellow", "green"] },
    { velocity: "4.50 mm/s", colors: ["orange", "orange", "yellow", "yellow"] },
    { velocity: "7.10 mm/s", colors: ["red", "orange", "orange", "yellow"] },
    { velocity: "11.20 mm/s", colors: ["red", "red", "orange", "orange"] },
    { velocity: "18.00 mm/s", colors: ["red", "red", "red", "orange"] },
    { velocity: "28.00 mm/s", colors: ["red", "red", "red", "red"] },
  ];
  const colorMap = {
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };


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

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              {data.sensor?.list && data.sensor?.list[0]?.gvib?.sensorType}
            </h3>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-4">
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
             

  {filterSensor
    ?.filter((item) => !item?.acce) // ✅ checks if acce object exists
    .map((item) => (
      <Option key={item?.sensorId} value={item?.sensorId}>
        <Checkbox
          size="sm"
          checked={selectedSensor.includes(item?.sensorId)}
          sx={{ mr: 1 }}
        />
        Sensor {item?.sensorId}
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
                  All Axis{" "}
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
            </Stack>
          </div>
        </div>
      </div>
      <div className=" lg:flex mb-4">
        {/* Chart takes 3/4 width on large screens */}
        <div className="w-full lg:w-3/4 pr-2">
          <div className="mb-4">
            <RealtimeGraph
              data={filterSensor}
              selectedSensor={selectedSensor}
              selectedAxis={selectedAxis}
              title="Velocity RMS (mm/s)"
              color="#ef4444"
              format="vibration"
              type="velocity"
              onNewAlert={onNewAlert} 
              anomalies={getAnomalies("vibration")}
            />
          </div>
          <div className="mb-4">
            <RealtimeGraph
              data={filterSensor}
              selectedSensor={selectedSensor}
              selectedAxis={selectedAxis}
              title="Acceleration RMS (g)"
              color="#6366f1"
              type="acceleration"
              format="acceleration"
              onNewAlert={onNewAlert} 
              anomalies={getAnomalies("acceleration")}
            />
          </div>
          <RealtimeGraph
            data={filterSensor}
            selectedSensor={selectedSensor}
            title="Temperature (°C)"
            color="#f59e0b"
            type="temperature"
            format="temperature"
            anomalies={getAnomalies("temperature")}
          />
        </div>

        {/* Card takes 1/4 width on large screens */}
        <div className="w-full lg:w-1/4 pl-2">
          <Card className="w-full shadow-lg border border-gray-200 rounded-2xl bg-white">
            <h1 className="text-center pb-2">
              <p className="text-lg font-semibold text-gray-800">
                ISO 10816 Reference
              </p>
            </h1>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-gray-700 bg-gray-100">
                      <th className="py-2 px-3 text-left font-semibold">
                        Velocity RMS
                      </th>
                      <th className="py-2 px-3 text-center font-semibold">
                        C1
                      </th>
                      <th className="py-2 px-3 text-center font-semibold">
                        C2
                      </th>
                      <th className="py-2 px-3 text-center font-semibold">
                        C3
                      </th>
                      <th className="py-2 px-3 text-center font-semibold">
                        C4
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataCard.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`border-b ${
                          idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="py-2 px-3 font-medium text-gray-800">
                          {row.velocity}
                        </td>
                        {row.colors.map((color, i) => (
                          <td key={i} className="py-2 px-3 text-center">
                            <div
                              className={`w-4 h-4 rounded-full mx-auto border border-gray-200 ${colorMap[color]}`}
                            ></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs text-gray-600 space-y-1">
                <Typography>
                  <span className="font-semibold text-gray-800">C1:</span> Small
                  machine
                </Typography>
                <Typography>
                  <span className="font-semibold text-gray-800">C2:</span>{" "}
                  Medium machine
                </Typography>
                <Typography>
                  <span className="font-semibold text-gray-800">C3:</span> Large
                  machine (rigid foundation)
                </Typography>
                <Typography>
                  <span className="font-semibold text-gray-800">C4:</span> Large
                  machine (soft foundation)
                </Typography>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className=""></div>
    </>
  );
}
