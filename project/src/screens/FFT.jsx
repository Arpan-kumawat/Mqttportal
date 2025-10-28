import React, { useState } from "react";
import SVTAGraph from "../components/SVTAGraph";
import { Select, Option, Checkbox, FormLabel, Stack } from "@mui/joy";
import { useWebSocket } from "../hooks/useWebSocket";

export default function FFT() {
    const { data} = useWebSocket();

      const [selectedSensor, setSelectedSensor] = useState(["all"]);
      const [selectedAxis, setSelectedAxis] = useState(["all"]);

  let selectedGatwat = localStorage.getItem("GateWay");

  let filterSensor = data?.sensor?.list?.filter(
    (e) => e?.gateway == selectedGatwat
  );

  const getAnomalies = (type) => {
    const series = [];
    return series;
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
            SVT-A Series
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
    ?.filter((item) => item?.acce) // ✅ checks if acce object exists
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
        <div className="w-full pr-2">
          <div className="mb-4">
            <SVTAGraph
              data={filterSensor}
              selectedSensor={selectedSensor}
              selectedAxis={selectedAxis}
              title="Acceleration (g)"
              color="#6366f1"
              type="acceleration"
              format="acceleration"
              onNewAlert={[]}
              anomalies={getAnomalies("vibration")}
            />
          </div>
          <div className="mb-4">
            <SVTAGraph
              data={filterSensor}
              selectedSensor={selectedSensor}
              selectedAxis={selectedAxis}
              title="Temprature"
              color="#6366f1"
              type="temperature"
              format="temperature"
              onNewAlert={[]}
              anomalies={getAnomalies("acceleration")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
