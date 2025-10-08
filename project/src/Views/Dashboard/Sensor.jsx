import React, { useState } from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Card, CardContent, Typography } from "@mui/joy";
import RealtimeGraph from "../../components/RealtimeGraph";

export default function Sensor({ data }) {
  const getAnomalies = (type) => {
    const series = data[type] || [];
    return data.anomalies.filter((anomaly) =>
      series.some((point) => point.timestamp === anomaly.timestamp)
    );
  };

  const [selectedSensor, setSelectedSensor] = useState("all");
  const [selectedAxis, setSelectedAxis] = useState("all");

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

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm"></div>
          <div className="text-sm text-gray-500 flex items-center gap-4">
            <Select
              defaultValue="all"
              onChange={(event, value) => setSelectedSensor(value)}
            >
              <Option value="all">All Sensors</Option>
              {data?.sensor?.list?.map((item) => (
                <Option key={item?.sensorId} value={item?.sensorId}>
                  Sensor {item?.sensorId}
                </Option>
              ))}
            </Select>

            <Select
              defaultValue="all"
              onChange={(event, value) => setSelectedAxis(value)}
            >
              <Option value="all">All Axis </Option>
              <Option value="x">x</Option>
              <Option value="y">y</Option>
              <Option value="z">z</Option>
            </Select>
          </div>
        </div>
      </div>
      <div className=" lg:flex mb-4">
        {/* Chart takes 3/4 width on large screens */}
        <div className="w-full lg:w-3/4 pr-2">
          <div className="mb-4">
            <RealtimeGraph
              data={data.sensor}
              selectedSensor={selectedSensor}
              selectedAxis={selectedAxis}
              title="Velocity RMS (mm/s)"
              color="#ef4444"
              format="vibration"
              type="velocity"
              anomalies={getAnomalies("vibration")}
            />
          </div>
          <div className="mb-4">
        

    <RealtimeGraph
             data={data.sensor}
            selectedSensor={selectedSensor}
            title="Acceleration RMS (g)"
            color="#6366f1"
                type="acceleration"
            format="acceleration"
            anomalies={getAnomalies("acceleration")}
          />

          </div>
          <RealtimeGraph
              data={data.vibration}
              selectedSensor={selectedSensor}
              title="Temperature (°C)"
              color="#f59e0b"
               type="temperature"
              format="temperature"
              anomalies={getAnomalies("temperature")}
            />{" "}
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
