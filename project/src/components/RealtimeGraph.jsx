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
import { Play ,Pause } from 'lucide-react';

const RealtimeGraph = ({
  title,
  color,
  type,
  format = "number",
  predictions = [],
  anomalies = [],
  selectedAxis,
  data,
  selectedSensor,
  sensors = [],
}) => {
  const [combinedData, setCombinedData] = useState([]);
  const [isPaused, setIsPaused] = useState(false); // 👈 new state
  const isMounted = useRef(true);
  const updateTimeout = useRef(null);

  // cleanup on unmount
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
    if (data?.list && Array.isArray(data.list)) return data.list;
    if (data) return [data];
    return [];
  }, [sensors, data]);

  // --- Main merge logic with throttling + pause control ---
  useEffect(() => {
    if (!sensorsList?.length || isPaused) return; // 👈 skip updates when paused

    if (updateTimeout.current) clearTimeout(updateTimeout.current);
    updateTimeout.current = setTimeout(() => {
      if (!isMounted.current || isPaused) return;

      setCombinedData((prev) => {
        const map = new Map();
        prev.forEach((p) => map.set(p.timestamp, { ...p }));

        sensorsList.forEach((item) => {
          const ts = item?.lastUpdated
            ? new Date(item.lastUpdated).getTime()
            : Date.now();
          if (!map.has(ts)) map.set(ts, { timestamp: ts });
          const point = map.get(ts);
          const id = item.sensorId || item.gvib?.sensorId;

          if (type === "temperature") {
            const tempRaw =
              item.sns_info?.temperature ??
              item.sns_info?.temprature ??
              item.snsInfo?.temperature ??
              item.snsInfo?.temprature;
            if (id && tempRaw != null) {
              const val = Number(tempRaw);
              if (!Number.isNaN(val)) point[`${id}_temp`] = val;
            }
          } else {
            const v =
              type === "acceleration"
                ? item.gvib?.accelerationRMS
                : item.gvib?.vibrationVelocity;
            if (id && v) {
              point[`${id}x`] = Number(v.x || 0);
              point[`${id}y`] = Number(v.y || 0);
              point[`${id}z`] = Number(v.z || 0);
            }
          }
        });

        const arr = Array.from(map.values()).sort(
          (a, b) => a.timestamp - b.timestamp
        );

        // forward-fill missing values
        const allKeys = Array.from(
          new Set(arr.flatMap((p) => Object.keys(p).filter((k) => k !== "timestamp")))
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

        return filled.slice(-100);
      });
    }, 100);

    return () => clearTimeout(updateTimeout.current);
  }, [JSON.stringify(sensorsList), isPaused]); // 👈 re-run when pause toggled

  const anomalyTimestamps = anomalies.map((a) => a.timestamp);

  // displayed series logic
  const displayedSeriesKeys = useMemo(() => {
    const allKeys = new Set();
    combinedData.forEach((p) =>
      Object.keys(p).forEach((k) => {
        if (k !== "timestamp") allKeys.add(k);
      })
    );
    let keys = Array.from(allKeys);

    // filter by selectedSensor
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

    // filter by axis
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
        return "mm";
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

  // memoize the chart to avoid rerender spikes
  const chartContent = useMemo(
    () => (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={combinedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="timestamp" tickFormatter={formatTime} stroke="#6b7280" fontSize={12} />
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
          {anomalyTimestamps.map((t, i) => (
            <ReferenceLine key={i} x={t} stroke="#f59e0b" strokeDasharray="2 2" />
          ))}
          {displayedSeriesKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={key}
              stroke={palette[i % palette.length]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    ),
    [combinedData, displayedSeriesKeys, anomalies, unitLabel]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused((p) => !p)}
            className={`px-3 py-1 text-sm rounded-md 
                 "  border border-gray-300 text-gray-700 bg-gray-500"
            `}
          >
            {isPaused ? <Play strokeWidth={"1px"}/> : <Pause strokeWidth={"1px"}/>}
          </button>
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

      <div className="h-64">{chartContent}</div>
    </div>
  );
};

// memo optimization
export default React.memo(RealtimeGraph, (prev, next) => {
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


// import React, { useEffect, useState, useMemo } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   ReferenceLine,
// } from "recharts";

// const RealtimeGraph = ({
//   title,
//   color,
//   type,
//   format = "number",
//   predictions = [],
//   anomalies = [],
//   selectedAxis,
//   data,
//   selectedSensor,
//   sensors = [],
// }) => {
//   useEffect(() => {
//     console.debug('[RealtimeGraph] mounted', title);
//     return () => console.debug('[RealtimeGraph] unmounted', title);
//   }, [title]);
//   const formatValue = (value) => {
//     if (value === null || value === undefined) return "-";
//     switch (format) {
//       case "currency":
//         return `$${value.toLocaleString()}`;
//       case "percentage":
//         return `${value.toFixed(1)}%`;
//       case "temperature":
//         return `${value.toFixed(1)}°C`;
//       case "vibration":
//         return `${value.toFixed(3)} mm/s`;
//       case "acceleration":
//         return `${value.toFixed(3)} g`;
//       default:
//         return value.toLocaleString();
//     }
//   };

//   const [combinedData, setCombinedData] = useState([]);



//   const formatTime = (timestamp) => {
//     if (!timestamp) return "-";
//     const d = new Date(Number(timestamp));
//     if (isNaN(d)) return "-";
//     const h = String(d.getHours()).padStart(2, "0");
//     const m = String(d.getMinutes()).padStart(2, "0");
//     const s = String(d.getSeconds()).padStart(2, "0");
//     return `${h}:${m}:${s}`;
//   };

//   // prefer explicit sensors prop, then legacy `data` (array or { list: [...] }), then empty
//   const sensorsList = (() => {
//     if (Array.isArray(sensors) && sensors.length) return sensors;
//     if (sensors && !Array.isArray(sensors)) return [sensors];
//     if (Array.isArray(data) && data.length) return data;
//     if (data?.list && Array.isArray(data.list) && data.list.length) return data.list;
//     if (data && !Array.isArray(data)) return [data];
//     return [];
//   })();

//   // Build combinedData: each point has a timestamp and keys like '245x','245y','245z', etc.
//   useEffect(() => {
//     // Merge incoming readings into previous combinedData so the chart keeps
//     // history across streaming updates. This ensures lines connect between
//     // timestamps as more data arrives.
//     setCombinedData((prev) => {
//       const map = new Map();

//       // seed map with previous points
//       prev.forEach((p) => map.set(p.timestamp, { ...p }));

//       // incorporate incoming readings
//       sensorsList.forEach((item) => {
//         const ts = item?.lastUpdated
//           ? new Date(item.lastUpdated).getTime()
//           : Date.now();
//         if (!map.has(ts)) map.set(ts, { timestamp: ts });
//         const point = map.get(ts);
//         const id = item.sensorId || item.gvib?.sensorId;

//         // If this component is the temperature chart, only capture temperature
//         if (type === "temperature") {
//           const tempRaw = item.sns_info?.temperature ?? item.sns_info?.temprature ?? item.snsInfo?.temperature ?? item.snsInfo?.temprature;
//           if (id !== undefined && tempRaw !== undefined && tempRaw !== null) {
//             const tempVal = typeof tempRaw === "number" ? tempRaw : Number(tempRaw);
//             if (!Number.isNaN(tempVal)) point[`${id}_temp`] = tempVal;
//           }
//         } else {
//           // For velocity/vibration or acceleration charts, only populate x/y/z series
//           let v = null;
//           if (type === "acceleration") v = item.gvib?.accelerationRMS;
//           else v = item.gvib?.vibrationVelocity; // default for velocity/vibration

//           if (id && v) {
//             point[`${id}x`] = typeof v.x === "number" ? v.x : Number(v.x || 0);
//             point[`${id}y`] = typeof v.y === "number" ? v.y : Number(v.y || 0);
//             point[`${id}z`] = typeof v.z === "number" ? v.z : Number(v.z || 0);
//           }
//         }
//       });

//       const arr = Array.from(map.values()).sort(
//         (a, b) => a.timestamp - b.timestamp
//       );

//       // compute series keys from accumulated data
//       const allKeysSet = new Set();
//       arr.forEach((p) =>
//         Object.keys(p).forEach((k) => {
//           if (k !== "timestamp") allKeysSet.add(k);
//         })
//       );
//       const keys = Array.from(allKeysSet).sort();

//       // forward-fill across the accumulated array
//       const lastSeen = {};
//       const filled = arr.map((pt) => {
//         const newPt = { ...pt };
//         keys.forEach((k) => {
//           if (newPt[k] === undefined) {
//             newPt[k] = lastSeen[k] !== undefined ? lastSeen[k] : null;
//           } else {
//             lastSeen[k] = newPt[k];
//           }
//         });
//         return newPt;
//       });

//       return filled.slice(-100);
//     });
//   }, [sensors, data]);

//   // Get anomaly timestamps for reference lines
//   const anomalyTimestamps = anomalies.map((a) => a.timestamp);

//   // derive series keys from combinedData (accumulated) so coloring/order stays
//   // consistent as data arrives.
//   const seriesKeys = useMemo(() => {
//     const set = new Set();
//     combinedData.forEach((p) =>
//       Object.keys(p).forEach((k) => {
//         if (k !== "timestamp") set.add(k);
//       })
//     );
//     return Array.from(set).sort();
//   }, [combinedData]);

//   // Determine which series to show based on selectedSensor.
//   // If selectedSensor is 'all' / falsy -> show all; otherwise only keys starting with the selected id.
//   const displayedSeriesKeys = useMemo(() => {
//     let keys = seriesKeys;

//     // normalize selectedSensor: can be single value, array of ids/objects, or contain 'all'
//     const normalizeSelectedSensorSet = (sel) => {
//       if (!sel) return null; // show all
//       if (Array.isArray(sel)) {
//         const items = sel
//           .map((s) => {
//             if (s === null || s === undefined) return null;
//             if (typeof s === "string" || typeof s === "number") return String(s);
//             if (typeof s === "object") return String(s.sensorId ?? s.id ?? s);
//             return null;
//           })
//           .filter(Boolean);
//         if (items.some((i) => String(i).toLowerCase() === "all")) return null;
//         return new Set(items);
//       }
//       if (String(sel).toLowerCase() === "all") return null;
//       return new Set([String(sel)]);
//     };

//     const selectedSensorSet = normalizeSelectedSensorSet(selectedSensor);

//     if (selectedSensorSet) {
//       keys = keys.filter((k) => {
//         // keys are like '245x','245y','245_temp' etc. Match if any selected id is a prefix.
//         for (const id of selectedSensorSet) {
//           if (k.startsWith(id)) return true;
//         }
//         return false;
//       });
//     }

//     // If this graph is for temperature, only include temp series like '245_temp'
//     if (type === "temperature") {
//       keys = keys.filter((k) => k.toLowerCase().endsWith("_temp"));
//     } else {
//       // normalize selectedAxis: can be single value or array, and 'all' means no filtering
//       const normalizeAxisSet = (ax) => {
//         if (!ax) return null;
//         if (Array.isArray(ax)) {
//           const items = ax
//             .map((v) => (v === null || v === undefined ? null : String(v).toLowerCase()))
//             .filter(Boolean);
//           if (items.some((i) => i === "all")) return null;
//           return new Set(items);
//         }
//         if (String(ax).toLowerCase() === "all") return null;
//         return new Set([String(ax).toLowerCase()]);
//       };

//       const axisSet = normalizeAxisSet(selectedAxis);
//       if (axisSet) {
//         keys = keys.filter((k) => {
//           const last = k.slice(-1).toLowerCase();
//           if (["x", "y", "z"].includes(last)) return axisSet.has(last);
//           return true;
//         });
//       }
//     }

//     return keys;
//   }, [seriesKeys, selectedSensor, selectedAxis]);

//   // simple color palette to cycle through
//   const palette = [
//     "#3b82f6",
//     "#ef4444",
//     "#10b981",
//     "#f59e0b",
//     "#8b5cf6",
//     "#06b6d4",
//     "#ec4899",
//     "#6366f1",
//     "#f97316",
//     "#14b8a6",
//   ];

//   // unit label for Y axis based on format
//   const unitLabel = useMemo(() => {
//     switch (format) {
//       case "temperature":
//         return "°C";
//       case "vibration":
//         return "mm/s";
//       case "acceleration":
//         return "g";
//       case "percentage":
//         return "%";
//       default:
//         return "";
//     }
//   }, [format]);

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       const dataPoint = payload[0].payload;
//       return (
//         <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg ">
//           <p className="text-sm text-gray-600">{formatTime(label)}</p>
//           <div className="mt-1 space-y-1">
//             {payload.map((p) => {
//               const name = p.name || p.dataKey;
//               const val = p.value;
//               return (
//                 <div key={name} className="flex items-center gap-2">
//                   <span
//                     className="w-2 h-2 inline-block rounded"
//                     style={{ background: p.color }}
//                   />
//                   <span className="text-sm font-medium">{name}:</span>
//                   <span className="text-sm text-gray-700">
//                     {val === undefined || val === null ? "-" : formatValue(val)}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//           {dataPoint?.predicted && (
//             <p className="text-xs text-purple-600">
//               Predicted ({(dataPoint.confidence * 100).toFixed(0)}% confidence)
//             </p>
//           )}
//           {dataPoint?.anomaly && (
//             <p className="text-xs text-orange-600">⚠️ Anomaly detected</p>
//           )}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//         <div className="flex items-center gap-2">
//           {predictions.length > 0 && (
//             <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
//               <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
//               AI Prediction
//             </div>
//           )}
//           {anomalies.length > 0 && (
//             <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
//               <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
//               Anomalies: {anomalies.length}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="h-64">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             data={combinedData}
//             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis
//               dataKey="timestamp"
//               tickFormatter={formatTime}
//               stroke="#6b7280"
//               fontSize={12}
           
//             />
//             <YAxis
//               // tickFormatter={formatValue}
//               stroke="#6b7280"
//               fontSize={12}
//               label={{ value: unitLabel, angle: -90, position: "insideLeft", offset: 0 }}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend verticalAlign="top" height={48} wrapperStyle={{ fontSize: 12, top:0, bottom:10}} style={{padding:"1rem"}} />

//             {/* Anomaly reference lines */}
//             {anomalyTimestamps.map((timestamp, index) => (
//               <ReferenceLine
//                 key={index}
//                 x={timestamp}
//                 stroke="#f59e0b"
//                 strokeDasharray="2 2"
//                 strokeWidth={1}
//               />
//             ))}

//             {/* Dynamic lines for each sensor-axis series (e.g. '245x','245y','245z') */}
//             {displayedSeriesKeys.map((key, idx) => (
//               <Line
//                 key={key}
//                 type="monotone"
//                 dataKey={key}
//                 name={key}
//                 stroke={palette[idx % palette.length]}
//                 strokeWidth={2}
//                 dot={false}
//                 isAnimationActive={false}
//                 connectNulls={true}
//               />
//             ))}
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// const propsAreEqual = (prev, next) => {
//   // keep it conservative: re-render when important props change
//   if (prev.title !== next.title) return false;
//   if (prev.color !== next.color) return false;
//   if (prev.format !== next.format) return false;
//   // compare selectedSensor and selectedAxis allowing arrays/objects and 'all'
//   const normalizeSelection = (sel) => {
//     if (sel === null || sel === undefined) return null;
//     if (Array.isArray(sel)) {
//       const items = sel
//         .map((s) => {
//           if (s === null || s === undefined) return null;
//           if (typeof s === "object") return String(s.sensorId ?? s.id ?? s);
//           return String(s);
//         })
//         .filter(Boolean)
//         .map((s) => s.toLowerCase());
//       if (items.some((i) => i === "all")) return null;
//       return items.sort();
//     }
//     if (typeof sel === "object") return [String(sel.sensorId ?? sel.id ?? sel).toLowerCase()];
//     if (String(sel).toLowerCase() === "all") return null;
//     return [String(sel).toLowerCase()];
//   };

//   const compareNorm = (a, b) => {
//     const na = normalizeSelection(a);
//     const nb = normalizeSelection(b);
//     if (na === null && nb === null) return true;
//     if (na === null || nb === null) return false;
//     if (na.length !== nb.length) return false;
//     for (let i = 0; i < na.length; i++) if (na[i] !== nb[i]) return false;
//     return true;
//   };

//   if (!compareNorm(prev.selectedSensor, next.selectedSensor)) return false;
//   if (!compareNorm(prev.selectedAxis, next.selectedAxis)) return false;
//   if (prev.type !== next.type) return false;

//   if ((prev.predictions?.length || 0) !== (next.predictions?.length || 0))
//     return false;
//   if ((prev.anomalies?.length || 0) !== (next.anomalies?.length || 0))
//     return false;

//   // if data/sensors reference changed, re-render
//   if (prev.sensors !== next.sensors) return false;
//   if (prev.data !== next.data) return false;

//   return true;
// };

// export default React.memo(RealtimeGraph, propsAreEqual);
