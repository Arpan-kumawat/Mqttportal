import React, { useState, useEffect } from 'react';
import RealtimeChart from '../components/RealtimeChart';
import AIInsightsPanel from '../components/AIInsightsPanel';
import { useWebSocket } from '../hooks/useWebSocket';

import Sensor from '../Views/Dashboard/Sensor';
import OverView from '../Views/Dashboard/OverView';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { data, isConnected, aiInsights } = useWebSocket();

  useEffect(() => {
    console.debug('[Dashboard] mounted');
    return () => console.debug('[Dashboard] unmounted');
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'Health', label: 'Health Metrics' },

    // { id: 'ai-predictions', label: 'AI Predictions' }
  ];


  const getAnomalies = (type) => {
    const series = data[type] || [];
    return data.anomalies.filter(anomaly =>
      series.some(point => point.timestamp === anomaly.timestamp)
    );
  };

  return (

    <>
      {/* Status Indicator */}
      <div className="mb-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">


            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-gray-600">
                {isConnected ? 'Live data streaming' : 'Connection lost'}
              </span>
            </div>
            {/* <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span className="text-purple-600 font-medium">AI Analysis Active</span>
                </div> */}
          </div>
          <div className="text-sm text-gray-500">
            Gateway Up time: {data?.gateway?.uptime}
          </div>
        </div>
      </div>

      {/* Tabs */}
      {/* <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div> */}

      {activeTab === 'overview' && (
        <OverView data={data} isConnected={isConnected} aiInsights={aiInsights} />
      )}

      {activeTab === 'business' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RealtimeChart
            data={data.revenue}
            title="Revenue Analytics with Predictions"
            color="#10b981"
            format="currency"
            predictions={data.predictions.revenue}
            anomalies={getAnomalies('revenue')}
          />
          <RealtimeChart
            data={data.users}
            title="User Analytics with Predictions"
            color="#3b82f6"
            format="number"
            predictions={data.predictions.users}
            anomalies={getAnomalies('users')}
          />
          <RealtimeChart
            data={data.orders}
            title="Order Analytics with Predictions"
            color="#8b5cf6"
            format="number"
            predictions={data.predictions.orders}
            anomalies={getAnomalies('orders')}
          />
          <RealtimeChart
            data={data.conversion}
            title="Conversion Rate with Predictions"
            color="#f59e0b"
            format="percentage"
            predictions={data.predictions.conversion}
            anomalies={getAnomalies('conversion')}
          />
        </div>
      )}

   

      {activeTab === 'ai-predictions' && (
        <div className="space-y-6">
          <AIInsightsPanel aiInsights={aiInsights} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(data.predictions).map(([metric, predictions]) => (
              predictions.length > 0 && (
                <RealtimeChart
                  key={metric}
                  data={data[metric]}
                  title={`${metric.charAt(0).toUpperCase() + metric.slice(1)} Predictions`}
                  color="#8b5cf6"
                  format={metric === 'revenue' ? 'currency' : metric === 'conversion' ? 'percentage' : 'number'}
                  predictions={predictions}
                  anomalies={getAnomalies(metric)}
                />
              )
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;