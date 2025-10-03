import React, { useRef, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const RealtimeChart = ({ data, title, color, format = 'number', predictions = [], anomalies = [] }) => {
  const formatValue = (value) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'temperature':
        return `${value.toFixed(1)}°C`;
      case 'vibration':
        return `${value.toFixed(2)} mm/s`;
      case 'acceleration':
        return `${value.toFixed(2)} g`;
      default:
        return value.toLocaleString();
    }
  };

  const [combinedData, setCombinedData] = useState([]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Combine actual data with predictions

  
//   const combinedData = [{

// "timestamp": 1759483641900,
// "value": 23.85301474008631}];


const prevOverallRef = useRef(null); // ✅ declare at component top-level



useEffect(() => {
  if (!data) return;

  // Coerce to number when possible for reliable comparison
  const prev = prevOverallRef.current;
  const curr = (data.overall === null || data.overall === undefined) ? data.overall : Number(data.overall);

  const overallChanged = (prev === null && curr !== null && curr !== undefined)
    || (prev !== null && prev !== undefined && curr !== null && curr !== undefined && prev !== curr)
    || (prev !== curr && (prev === null || prev === undefined) && (curr === null || curr === undefined) === false);

  if (overallChanged) {
    const newPoint = {
      timestamp: data.lastUpdated ? new Date(data.lastUpdated).getTime() : Date.now(),
      Temprature: data.temperature,
      value: curr,
    };

    setCombinedData(prevArr => {
      // avoid duplicate timestamps
      if (prevArr.length && prevArr[prevArr.length - 1].timestamp === newPoint.timestamp) {
        return prevArr;
      }
      return [...prevArr, newPoint].slice(-10);
    });

    prevOverallRef.current = curr;
  }
  // if not changed, do nothing
}, [data?.overall, data?.lastUpdated, data?.temperature]);




  // Get anomaly timestamps for reference lines
  const anomalyTimestamps = anomalies.map(a => a.timestamp);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{formatTime(label)}</p>
          <p className="text-sm font-semibold" style={{ color: "#3b82f6" }}>
            Temprature : {(payload[1].value)}°C
          </p>
           <p className="text-sm font-semibold" style={{ color: payload[0].color }}>
            Usage : {formatValue(payload[0].value)}%
          </p>
          {data.predicted && (
            <p className="text-xs text-purple-600">
              Predicted ({(data.confidence * 100).toFixed(0)}% confidence)
            </p>
          )}
          {data.anomaly && (
            <p className="text-xs text-orange-600">⚠️ Anomaly detected</p>
          )}
        </div>
      );
    }
    return null;
  };

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
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
         <LineChart
  data={combinedData}
  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
>
  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
  <XAxis 
    dataKey="timestamp"
    tickFormatter={formatTime}
    stroke="#6b7280"
    fontSize={12}
  />
  <YAxis 
    // tickFormatter={formatValue}
    stroke="#6b7280"
    fontSize={12}
  />
  <Tooltip content={<CustomTooltip />} />

  {/* Anomaly reference lines */}
  {anomalyTimestamps.map((timestamp, index) => (
    <ReferenceLine 
      key={index}
      x={timestamp} 
      stroke="#f59e0b" 
      strokeDasharray="2 2"
      strokeWidth={1}
    />
  ))}

  {/* Overall data line */}
  <Line 
    type="monotone" 
    dataKey="value" 
    stroke={color}
    strokeWidth={2}
    dot={true}
    activeDot={{ r: 5, stroke: color, strokeWidth: 2, fill: '#ffffff' }}
  />

  {/* Temperature data line */}
  <Line 
    type="monotone" 
    dataKey="Temprature" 
    stroke="#3b82f6"   // blue color for temperature
    strokeWidth={2}
    dot={true}
    activeDot={{ r: 5, stroke: "#3b82f6", strokeWidth: 2, fill: '#ffffff' }}
  />

  {/* Prediction line */}
  {predictions.length > 0 && (
    <Line 
      type="monotone" 
      dataKey="value" 
      stroke="#8b5cf6"
      strokeWidth={2}
      strokeDasharray="5 5"
      dot={false}
      activeDot={{ r: 4, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
      data={predictions}
    />
  )}
</LineChart>

        </ResponsiveContainer>
      </div>
    </div>
  );
};

const propsAreEqual = (prev, next) => {
  // Skip render when overall is unchanged and other simple props are equal
  const prevOverall = prev?.data?.overall;
  const nextOverall = next?.data?.overall;

  if (prevOverall !== nextOverall) return false;
  if (prev.title !== next.title) return false;
  if (prev.color !== next.color) return false;
  if (prev.format !== next.format) return false;

  // shallow compare lengths for arrays (cheap)
  if ((prev.predictions?.length || 0) !== (next.predictions?.length || 0)) return false;
  if ((prev.anomalies?.length || 0) !== (next.anomalies?.length || 0)) return false;

  return true; // props considered equal -> skip render
};

export default React.memo(RealtimeChart, propsAreEqual);