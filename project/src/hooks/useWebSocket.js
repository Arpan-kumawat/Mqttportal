import { useEffect, useRef, useState } from 'react';

// AI Prediction algorithms
const generatePrediction = (historicalData, steps = 5) => {
  if (historicalData.length < 3) return [];
  
  const predictions = [];
  const lastValues = historicalData.slice(-3).map(d => d.value);
  const trend = (lastValues[2] - lastValues[0]) / 2;
  const lastTimestamp = historicalData[historicalData.length - 1].timestamp;
  
  for (let i = 1; i <= steps; i++) {
    const predictedValue = lastValues[2] + (trend * i) + (Math.random() - 0.5) * trend * 0.3;
    const confidence = Math.max(0.6, 1 - (i * 0.1)); // Decreasing confidence over time
    
    predictions.push({
      timestamp: lastTimestamp + (i * 60000), // 1 minute intervals
      value: Math.max(0, predictedValue),
      label: `Predicted ${i}`,
      predicted: true,
      confidence
    });
  }
  
  return predictions;
};

// Anomaly detection using statistical methods
const detectAnomalies = (data, threshold = 2) => {
  if (data.length < 10) return [];
  
  const values = data.map(d => d.value);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return data.filter(point => {
    const zScore = Math.abs(point.value - mean) / stdDev;
    return zScore > threshold;
  }).map(point => ({
    ...point,
    anomaly: true,
    severity: Math.abs(point.value - mean) / stdDev > 3 ? 'critical' : 'medium'
  }));
};

export const useWebSocket = () => {
  const [data, setData] = useState({
    revenue: [],
    users: [],
    orders: [],
    conversion: [],
    temperature: [],
    vibration: [],
    acceleration: [],
    // gateway metrics will be populated dynamically (e.g. gateway.temperature)
    gateway: {},
       sensor: {},
    predictions: {
      revenue: [],
      users: [],
      orders: [],
      conversion: []
    },
    anomalies: []
  });
  const [isConnected, setIsConnected] = useState(false);
  const [aiInsights, setAiInsights] = useState({
    trends: {},
    alerts: [],
    recommendations: []
  });
  const wsRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Connect to a real WebSocket server and map incoming messages
    // into the existing `data` shape. Supports messages shaped as:
    // { type: 'init'|'update', data: { topic, data, timestamp } }
    // or { topic, data, timestamp }
    wsRef.current = new WebSocket('ws://localhost:3000');

    const socket = wsRef.current;

    socket.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    };

    socket.onerror = (err) => {
      console.error('WebSocket error', err);
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        let topic, payload, timestamp;

        if (msg.type === 'init' && msg.data) {
          topic = msg.data.topic;
          payload = msg.data.data;
          timestamp = msg.data.timestamp;
        } else if (msg.topic && msg.data !== undefined) {
          topic = msg.topic;
          payload = msg.data;
          timestamp = msg.timestamp;
        } else if (msg.type === 'update' && msg.data) {
          // many updates come as { type: 'update', data: { ... } }
          // handle common shapes below; individual topics will be processed later
          payload = msg.data;
          timestamp = msg.data.timestamp || msg.data.gateway?.lastUpdated || Date.now();
        }

        
        // If payload contains a gateway object with gw_info, map its fields
        if (payload && payload.gateway && payload.gateway.gw_info) {
          const gw = payload.gateway.gw_info;
          const gwTs = payload.gateway.lastUpdated ? Date.parse(payload.gateway.lastUpdated) : Date.now();
          const sns = payload.array;

          setData(prev => {
            const next = { ...prev };

            // store the raw gw object for convenience
            next.gateway = { ...next.gateway, ...gw, lastUpdated: payload.gateway.lastUpdated || gwTs };
            next.sensor = { ...next.sensor, list: [...sns] };

            // Flatten numeric gw_info fields into small time-series so UI MetricCard + charts can use them
            const numericFields = ['temperature', 'drv_tot', 'drv_usd', 'overall', 'free', 'active'];

            numericFields.forEach((field) => {
              const key = `gateway.${field}`;
              const val = gw[field];
              if (val === undefined || val === null) return;

              const existing = Array.isArray(prev[key]) ? prev[key] : [];
              const newPoint = {
                timestamp: gwTs,
                value: typeof val === 'number' ? val : Number(val) || 0,
                label: `${key} ${gwTs}`,
                predicted: false,
                anomaly: false
              };

              // keep same length as before when possible
              next[key] = [...existing.slice(1), newPoint];
            });

            return next;
          });

          // small AI insights update for gateway
          setAiInsights(prev => ({
            ...prev,
            trends: { ...prev.trends, gateway: (payload.gateway.gw_info.temperature ?? 0) > 0 ? 'stable' : 'unknown' }
          }));

          // we've handled the gateway update
          return;
        }

        if (payload === undefined) return;

        // Update the stored data for the topic. The payload may be:
        // - an array of datapoints (replace),
        // - a single datapoint object (append/shift),
        // - a primitive value (wrap into datapoint and append).

  
        setData(prev => {
          const next = { ...prev };

          if (Array.isArray(payload)) {
            next[topic] = payload.map(d => ({
              timestamp: d.timestamp || Date.now(),
              value: d.value ?? d.v ?? 0,
              label: d.label || `${topic} ${d.timestamp || Date.now()}`,
              predicted: !!d.predicted,
              anomaly: !!d.anomaly
            }));
          } else if (payload && typeof payload === 'object') {
            const newPoint = {
              timestamp: payload.timestamp || timestamp || Date.now(),
              value: payload.value ?? payload.v ?? 0,
              label: payload.label || `${topic} ${payload.timestamp || Date.now()}`,
              predicted: !!payload.predicted,
              anomaly: !!payload.anomaly
            };

            const existing = Array.isArray(prev[topic]) ? prev[topic] : [];
            // Keep same length as existing, drop oldest
            next[topic] = [...existing.slice(1), newPoint];
          } else {
            // primitive
            const newPoint = {
              timestamp: timestamp || Date.now(),
              value: payload,
              label: `${topic} ${timestamp || Date.now()}`,
              predicted: false,
              anomaly: false
            };
            const existing = Array.isArray(prev[topic]) ? prev[topic] : [];
            next[topic] = [...existing.slice(1), newPoint];
          }

          // Update predictions for business metrics
          if (['revenue', 'users', 'orders', 'conversion'].includes(topic)) {
            next.predictions = {
              ...prev.predictions,
              [topic]: generatePrediction(next[topic])
            };
          }

          // Detect anomalies for this metric and keep a short list
          const anomalies = detectAnomalies(next[topic] || []);
          if (anomalies.length > 0) {
            next.anomalies = [...prev.anomalies.slice(-10), ...anomalies.slice(-1)];
          }

          return next;
        });

        // Minimal AI insights update (keep it lightweight — complex logic can be added later)
        setAiInsights(prev => {
          const next = { ...prev };
          const lastVal = (payload && (payload.value ?? (Array.isArray(payload) ? payload.slice(-1)[0]?.value : undefined))) ?? null;
          next.trends = { ...prev.trends, [topic]: lastVal > 0 ? 'increasing' : 'stable' };
          return next;
        });
      } catch (err) {
        console.error('⚠️ Error parsing WebSocket message:', err);
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return { data, isConnected, aiInsights };
};