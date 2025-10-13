import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const HistoryGraph = ({ title, data, type, selectedAxis = ["all"], selectedSensor = ["all"],  format = "number", }) => {

  // Determine which keys to display based on selected sensors & axes
  const displayedKeys = useMemo(() => {
    if (!data.length) return [];

    let keys = Object.keys(data[0]).filter((k) => k !== "time");

    // Filter by selected sensors
    if (!selectedSensor.includes("all")) {
      const selSet = new Set(selectedSensor.map(String));
      keys = keys.filter((k) => selSet.has(k.split("_")[0]));
    }

    // Filter by selected axes (only for vibration/acceleration)
    if (type !== "temperature" && !selectedAxis.includes("all")) {
      const axisSet = new Set(selectedAxis.map(String));
      keys = keys.filter((k) => axisSet.has(k.slice(-1).toLowerCase()));
    }

    return keys.sort();
  }, [data, selectedSensor, selectedAxis, type]);

  const palette = [
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
    "#8b5cf6", "#06b6d4", "#ec4899", "#6366f1",
    "#f97316", "#14b8a6",
  ];

    const unitLabel = useMemo(() => {
      switch (format) {
        case "temperature":
          return "°C";
        case "vibration":
          return "mm";
        case "acceleration":
          return "g";
        case "percentage":
          return "%";
        default:
          return "";
      }
    }, [format]);

      const formatValue = (value) => {
    if (value === null || value === undefined) return "-";
    switch (format) {
      case "currency":
        return `$${value.toLocaleString()}`;
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "temperature":
        return `${value.toFixed(1)}°C`;
      case "vibration":
        return `${value.toFixed(3)} mm/s`;
      case "acceleration":
        return `${value.toFixed(3)} g`;
      default:
        return value.toLocaleString();
    }
  };

  const formatTime = (t) => new Date(t).toLocaleTimeString();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{formatTime(label)}</p>
          {payload.map((p) => (
            <div key={p.name} className="flex items-center gap-2">
              <span
                className="w-2 h-2 inline-block rounded"
                style={{ background: p.color }}
              />
              {/* <span className="text-sm">{p.name}: {p.value ?? "-"}</span> */}
               <span className="text-sm font-medium">{p.name}:</span>
                <span className="text-sm text-gray-700">
                  {p.value == null ? "-" : formatValue(p.value)}
                </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      </div>

    <div className="h-64 relative">
  {data?.length ? (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tickFormatter={formatTime} />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          label={{
            value: unitLabel,
            position: "insideLeft",
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />

        {displayedKeys?.map((key, idx) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={palette[idx % palette.length]}
            dot={false}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  ) : (
    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
      No Data Available
    </div>
  )}
</div>

     
    </div>
  );
};

export default HistoryGraph;
