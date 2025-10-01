import React from 'react';
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

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Combine actual data with predictions
  const combinedData = [...data, ...predictions];
  
  // Get anomaly timestamps for reference lines
  const anomalyTimestamps = anomalies.map(a => a.timestamp);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{formatTime(label)}</p>
          <p className="text-sm font-semibold" style={{ color: payload[0].color }}>
            {title}: {formatValue(payload[0].value)}
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
          <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatValue}
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
            
            {/* Actual data line */}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color}
              strokeWidth={2}
              dot={(props) => {
                const { payload } = props;
                if (payload.anomaly) {
                  return <circle {...props} r={4} fill="#f59e0b" stroke="#f59e0b" strokeWidth={2} />;
                }
                if (payload.predicted) {
                  return <circle {...props} r={3} fill="none" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="2 2" />;
                }
                return <circle {...props} r={3} fill={color} stroke={color} strokeWidth={0} />;
              }}
              activeDot={{ r: 5, stroke: color, strokeWidth: 2, fill: '#ffffff' }}
              animationDuration={300}
              connectNulls={false}
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

export default RealtimeChart;