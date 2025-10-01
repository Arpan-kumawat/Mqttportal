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
    // Since we don't have a real WebSocket server, we'll simulate it
    const simulateWebSocket = () => {
      setIsConnected(true);
      
      // Generate initial data
      const now = Date.now();
      const initialData = {
        revenue: Array.from({ length: 30 }, (_, i) => ({
          timestamp: now - (29 - i) * 60000,
          value: Math.floor(Math.random() * 10000) + 5000 + (i * 100), // Adding slight upward trend
          label: `Revenue ${i}`,
          predicted: false,
          anomaly: false
        })),
        users: Array.from({ length: 30 }, (_, i) => ({
          timestamp: now - (29 - i) * 60000,
          value: Math.floor(Math.random() * 500) + 100 + (i * 5),
          label: `Users ${i}`,
          predicted: false,
          anomaly: false
        })),
        orders: Array.from({ length: 30 }, (_, i) => ({
          timestamp: now - (29 - i) * 60000,
          value: Math.floor(Math.random() * 100) + 20 + (i * 2),
          label: `Orders ${i}`,
          predicted: false,
          anomaly: false
        })),
        conversion: Array.from({ length: 30 }, (_, i) => ({
          timestamp: now - (29 - i) * 60000,
          value: Math.random() * 10 + 2 + (i * 0.1),
          label: `Conversion ${i}`,
          predicted: false,
          anomaly: false
        })),
        temperature: Array.from({ length: 30 }, (_, i) => ({
          timestamp: now - (29 - i) * 60000,
          value: 20 + Math.random() * 15 + Math.sin(i * 0.2) * 5,
          label: `Temperature ${i}`,
          predicted: false,
          anomaly: false
        })),
        vibration: Array.from({ length: 30 }, (_, i) => ({
          timestamp: now - (29 - i) * 60000,
          value: Math.random() * 8 + 1,
          label: `Vibration ${i}`,
          predicted: false,
          anomaly: false
        })),
        acceleration: Array.from({ length: 30 }, (_, i) => ({
          timestamp: now - (29 - i) * 60000,
          value: Math.random() * 5 + 0.5,
          label: `Acceleration ${i}`,
          predicted: false,
          anomaly: false
        })),
        predictions: {
          revenue: [],
          users: [],
          orders: [],
          conversion: []
        },
        anomalies: []
      };
      
      setData(initialData);

      // Generate initial predictions
      const predictions = {
        revenue: generatePrediction(initialData.revenue),
        users: generatePrediction(initialData.users),
        orders: generatePrediction(initialData.orders),
        conversion: generatePrediction(initialData.conversion)
      };

      setData(prev => ({ ...prev, predictions }));

      // Simulate real-time updates with AI features
      intervalRef.current = setInterval(() => {
        const types = ['revenue', 'users', 'orders', 'conversion', 'temperature', 'vibration', 'acceleration'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        let newValue;
        const currentTime = Date.now();
        
        switch (randomType) {
          case 'revenue':
            newValue = Math.floor(Math.random() * 10000) + 5000;
            // Occasionally inject anomalies
            if (Math.random() < 0.1) newValue *= 2; // 10% chance of spike
            break;
          case 'users':
            newValue = Math.floor(Math.random() * 500) + 100;
            if (Math.random() < 0.05) newValue *= 0.3; // 5% chance of drop
            break;
          case 'orders':
            newValue = Math.floor(Math.random() * 100) + 20;
            break;
          case 'conversion':
            newValue = Math.random() * 10 + 2;
            break;
          case 'temperature':
            newValue = 20 + Math.random() * 15 + Math.sin(currentTime * 0.001) * 5;
            if (Math.random() < 0.08) newValue += 20; // Temperature spike
            break;
          case 'vibration':
            newValue = Math.random() * 8 + 1;
            if (Math.random() < 0.12) newValue *= 3; // Vibration anomaly
            break;
          case 'acceleration':
            newValue = Math.random() * 5 + 0.5;
            break;
          default:
            newValue = 0;
        }

        const newDataPoint = {
          timestamp: currentTime,
          value: newValue,
          label: `${randomType} ${currentTime}`,
          predicted: false,
          anomaly: false
        };

        setData(prevData => {
          const updatedData = {
            ...prevData,
            [randomType]: [...prevData[randomType].slice(1), newDataPoint]
          };

          // Update predictions for business metrics
          if (['revenue', 'users', 'orders', 'conversion'].includes(randomType)) {
            updatedData.predictions[randomType] = generatePrediction(updatedData[randomType]);
          }

          // Detect anomalies
          const anomalies = detectAnomalies(updatedData[randomType]);
          if (anomalies.length > 0) {
            updatedData.anomalies = [...prevData.anomalies.slice(-10), ...anomalies.slice(-1)];
          }

          return updatedData;
        });

        // Update AI insights
        setAiInsights(prev => {
          const newInsights = { ...prev };
          
          // Generate trend analysis
          newInsights.trends[randomType] = newValue > 0 ? 'increasing' : 'stable';
          
          // Generate alerts for anomalies
          if (Math.random() < 0.05) { // 5% chance of alert
            const alert = {
              id: Date.now(),
              type: 'anomaly',
              metric: randomType,
              message: `Unusual ${randomType} pattern detected`,
              severity: 'medium',
              timestamp: currentTime
            };
            newInsights.alerts = [...prev.alerts.slice(-5), alert];
          }
          
          // Generate recommendations
          if (Math.random() < 0.03) { // 3% chance of recommendation
            const recommendations = [
              'Consider scaling resources based on user growth trend',
              'Revenue optimization opportunity detected',
              'Temperature monitoring requires attention',
              'Vibration levels suggest maintenance needed'
            ];
            const recommendation = {
              id: Date.now(),
              message: recommendations[Math.floor(Math.random() * recommendations.length)],
              confidence: 0.7 + Math.random() * 0.3,
              timestamp: currentTime
            };
            newInsights.recommendations = [...prev.recommendations.slice(-3), recommendation];
          }
          
          return newInsights;
        });
      }, 3000); // Update every 3 seconds
    };

    simulateWebSocket();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { data, isConnected, aiInsights };
};