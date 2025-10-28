import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { Play, Pause } from "lucide-react";
import "../index.css";

const SVTAGraph = ({
  title,
  color,
  type,
  format = "number",
  predictions = [],
  anomalies = [],
  selectedAxis,
  data,
  selectedSensor,
  onNewAlert,
  sensors = [],
}) => {
  const [combinedData, setCombinedData] = useState([]);
  const isMounted = useRef(true);
  const updateTimeout = useRef(null);

  const [dragging, setDragging] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (updateTimeout.current) clearTimeout(updateTimeout.current);
    };
  }, []);

  // formatters
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

  const formatTime = (timestamp) => {
    if (!timestamp) return "-";
    const d = new Date(Number(timestamp));
    if (isNaN(d)) return "-";
    return `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
  };

  // derive sensors list
  const sensorsList = useMemo(() => {
    if (Array.isArray(sensors) && sensors.length) return sensors;
    if (Array.isArray(data) && data.length) return data;
    if (data && Array.isArray(data)) return data;
    if (data) return [data];
    return [];
  }, [sensors, data]);

  // --- Merge new websocket data into combinedData ---
  useEffect(() => {
    if (!sensorsList?.length ) return;

    if (updateTimeout.current) clearTimeout(updateTimeout.current);
    updateTimeout.current = setTimeout(() => {
      if (!isMounted.current ) return;

      setCombinedData((prev) => {
        const map = new Map();
        prev.forEach((p) => map.set(p.timestamp, { ...p }));

        sensorsList.forEach((item) => {
          const ts = (() => {
            let t = new Date(item?.lastUpdated).getTime();
            if (!t || isNaN(t)) t = Date.now();
            return t;
          })();

          if (!map.has(ts)) map.set(ts, { timestamp: ts });
          const point = map.get(ts);
          const id = item.sensorId || item.gvib?.sensorId || item.id;

          // Temperature type
          if (type === "temperature") {
            const tempRaw =
              item?.atmp?.temperature ??
              item?.temperature ??
              item?.temp ??
              null;
            if (id && tempRaw != null && !Number.isNaN(Number(tempRaw))) {
              point[`${id}_temp`] = Number(tempRaw);
            }
          } else {
            // Acceleration / Vibration type
            let v =
              item?.acce?.accel ||
              item?.accel ||
              item?.vibration ||
              item?.data ||
              null;
            if (id && v) {
              const x = Number(v.x ?? v.X ?? v.xAxis ?? 0);
              const y = Number(v.y ?? v.Y ?? v.yAxis ?? 0);
              const z = Number(v.z ?? v.Z ?? v.zAxis ?? 0);

              if (!Number.isNaN(x)) point[`${id}x`] = x;
              if (!Number.isNaN(y)) point[`${id}y`] = y;
              if (!Number.isNaN(z)) point[`${id}z`] = z;
            }
          }
        });

        const arr = Array.from(map.values()).sort(
          (a, b) => a.timestamp - b.timestamp
        );

        // forward-fill missing values
        const allKeys = Array.from(
          new Set(
            arr.flatMap((p) => Object.keys(p).filter((k) => k !== "timestamp"))
          )
        );
        const lastSeen = {};
        const filled = arr.map((pt) => {
          const newPt = { ...pt };
          allKeys.forEach((k) => {
            if (newPt[k] === undefined) newPt[k] = lastSeen[k] ?? null;
            else lastSeen[k] = newPt[k];
          });
          return newPt;
        });

        // Limit to last 200 data points
        return filled.slice(-200);
      });
    }, 200);

    return () => clearTimeout(updateTimeout.current);
  }, [JSON.stringify(sensorsList), type]);

  const anomalyTimestamps = anomalies.map((a) => a.timestamp);

  // Determine which lines to display
  const displayedSeriesKeys = useMemo(() => {
    const allKeys = new Set();
    combinedData.forEach((p) =>
      Object.keys(p).forEach((k) => {
        if (k !== "timestamp") allKeys.add(k);
      })
    );
    let keys = Array.from(allKeys);

    // Filter by selectedSensor
    const normalizeSelected = (sel) => {
      if (!sel) return null;
      if (Array.isArray(sel)) {
        const items = sel
          .map((s) =>
            typeof s === "object" ? String(s.sensorId ?? s.id ?? s) : String(s)
          )
          .filter(Boolean);
        if (items.includes("all")) return null;
        return new Set(items);
      }
      if (String(sel).toLowerCase() === "all") return null;
      return new Set([String(sel)]);
    };
    const selSet = normalizeSelected(selectedSensor);
    if (selSet) {
      keys = keys.filter((k) =>
        Array.from(selSet).some((id) => k.startsWith(id))
      );
    }

    // Filter by selectedAxis
    if (type !== "temperature") {
      const normalizeAxis = (ax) => {
        if (!ax) return null;
        if (Array.isArray(ax)) {
          const items = ax.map((v) => String(v).toLowerCase());
          if (items.includes("all")) return null;
          return new Set(items);
        }
        if (String(ax).toLowerCase() === "all") return null;
        return new Set([String(ax).toLowerCase()]);
      };
      const axisSet = normalizeAxis(selectedAxis);
      if (axisSet) {
        keys = keys.filter((k) => axisSet.has(k.slice(-1).toLowerCase()));
      }
    }

    return keys.sort();
  }, [combinedData, selectedSensor, selectedAxis, type]);

  const palette = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#6366f1",
    "#f97316",
    "#14b8a6",
  ];

  const unitLabel = useMemo(() => {
    switch (format) {
      case "temperature":
        return "°C";
      case "vibration":
        return "mm/s";
      case "acceleration":
        return "g";
      case "percentage":
        return "%";
      default:
        return "";
    }
  }, [format]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{formatTime(label)}</p>
          <div className="mt-1 space-y-1">
            {payload.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 inline-block rounded"
                  style={{ background: p.color }}
                />
                <span className="text-sm font-medium">{p.name}:</span>
                <span className="text-sm text-gray-700">
                  {p.value == null ? "-" : formatValue(p.value)}
                </span>
              </div>
            ))}
          </div>
          {dataPoint?.anomaly && (
            <p className="text-xs text-orange-600">⚠️ Anomaly detected</p>
          )}
        </div>
      );
    }
    return null;
  };

  const chartContent = useMemo(
    () => (
      <div
        ref={chartRef}
        className="no-select"
        style={{ height: "16rem", position: "relative" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={combinedData}
            margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              label={{
                value: unitLabel,
                position: "insideLeft",
              }}
            />
            {!dragging && <Tooltip content={<CustomTooltip />} />}
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: 10 }}
            />

            {anomalyTimestamps.map((t, i) => (
              <ReferenceLine
                key={i}
                x={t}
                stroke="#f59e0b"
                strokeDasharray="2 2"
              />
            ))}

            {displayedSeriesKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={palette[i % palette.length]}
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    ),
    [combinedData, displayedSeriesKeys, anomalies, unitLabel]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
    
          {predictions.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              AI Prediction
            </div>
          )}
          {anomalies.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              Anomalies: {anomalies.length}
            </div>
          )}
        </div>
      </div>

      {/* Optional debug viewer */}
      {/* <pre className="text-xs text-gray-600 bg-gray-50 p-2 overflow-x-auto">
        {JSON.stringify(combinedData.slice(-5), null, 2)}
      </pre> */}

      <div className="h-64">{chartContent}</div>
    </div>
  );
};

export default React.memo(SVTAGraph, (prev, next) => {
  return (
    prev.title === next.title &&
    prev.type === next.type &&
    prev.format === next.format &&
    prev.selectedAxis === next.selectedAxis &&
    prev.selectedSensor === next.selectedSensor &&
    prev.sensors === next.sensors &&
    prev.data === next.data
  );
});
