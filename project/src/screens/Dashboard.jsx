import React, { useState } from 'react';
import { DollarSign, Users, ShoppingCart, TrendingUp, Thermometer, Activity, Zap } from 'lucide-react';
import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import MetricCard from '../components/MetricCard';
import RealtimeChart from '../components/RealtimeChart';
import AIInsightsPanel from '../components/AIInsightsPanel';
import { useWebSocket } from '../hooks/useWebSocket';
import CpuMonitor from '../components/CpuMonitor';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { data, isConnected, aiInsights } = useWebSocket();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    // { id: 'business', label: 'Metrics' },
    { id: 'sensors', label: 'Sensor Data' },
    { id: 'ai-predictions', label: 'AI Predictions' }
  ];

  const getCurrentValue = (type) => {
    const latestData = data[type];
    return latestData.length > 0 ? latestData[latestData.length - 1].value : 0;
  };

  const getChangePercentage = (type) => {
    const latestData = data[type];
    if (latestData.length < 2) return 0;
    
    const current = latestData[latestData.length - 1].value;
    const previous = latestData[latestData.length - 2].value;
    return ((current - previous) / previous) * 100;
  };

  const getPrediction = (type) => {
    const predictions = data.predictions[type];
    return predictions.length > 0 ? predictions[0] : null;
  };

  const getAnomalies = (type) => {
    return data.anomalies.filter(anomaly => 
      data[type].some(point => point.timestamp === anomaly.timestamp)
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
      

                {/* <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className="text-gray-600">
                    {isConnected ? 'Live data streaming' : 'Connection lost'}
                  </span>
                </div> */}
                {/* <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span className="text-purple-600 font-medium">AI Analysis Active</span>
                </div> */}
              </div>
              <div className="text-sm text-gray-500">
                Last update: {new Date().toLocaleTimeString()}
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
            <>
              {/* Business Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="CPU usage"
                  value={`$${getCurrentValue('revenue').toLocaleString()}`}
                  change={getChangePercentage('revenue')}
                  // icon={<DollarSign className="h-6 w-6 text-white" />}
                  color="bg-green-500"
                  prediction={getPrediction('revenue')}
                  anomaly={getAnomalies('revenue').length > 0}
                />
            
                <MetricCard
                  title="Temprature"
                  value={getCurrentValue('users').toLocaleString()}
                  change={getChangePercentage('users')}
                  icon={<Users className="h-6 w-6 text-white" />}
                  color="bg-blue-500"
                  prediction={getPrediction('users')}
                  anomaly={getAnomalies('users').length > 0}
                />
                <MetricCard
                  title="Memory"
                  value={getCurrentValue('orders').toLocaleString()}
                  change={getChangePercentage('orders')}
                  icon={<ShoppingCart className="h-6 w-6 text-white" />}
                  color="bg-purple-500"
                  prediction={getPrediction('orders')}
                  anomaly={getAnomalies('orders').length > 0}
                />
                <MetricCard
                  title="Total memory"
                  value={`${getCurrentValue('conversion').toFixed(1)}%`}
                  change={getChangePercentage('conversion')}
                  icon={<TrendingUp className="h-6 w-6 text-white" />}
                  color="bg-orange-500"
                  prediction={getPrediction('conversion')}
                  anomaly={getAnomalies('conversion').length > 0}
                />
           
                 
              </div>

              {/* Sensor Metrics Cards */}
              {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <MetricCard
                  title="Temperature"
                  value={`${getCurrentValue('temperature').toFixed(1)}°C`}
                  change={getChangePercentage('temperature')}
                  icon={<Thermometer className="h-6 w-6 text-white" />}
                  color="bg-red-500"
                  anomaly={getAnomalies('temperature').length > 0}
                />
                <MetricCard
                  title="Vibration"
                  value={`${getCurrentValue('vibration').toFixed(2)} mm/s`}
                  change={getChangePercentage('vibration')}
                  icon={<Activity className="h-6 w-6 text-white" />}
                  color="bg-yellow-500"
                  anomaly={getAnomalies('vibration').length > 0}
                />
                <MetricCard
                  title="Acceleration"
                  value={`${getCurrentValue('acceleration').toFixed(2)} g`}
                  change={getChangePercentage('acceleration')}
                  icon={<Zap className="h-6 w-6 text-white" />}
                  color="bg-indigo-500"
                  anomaly={getAnomalies('acceleration').length > 0}
                />
              </div> */}

              {/* Charts and AI Insights */}
              {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <RealtimeChart
                    data={data.revenue}
                    title="Revenue Stream with AI Predictions"
                    color="#10b981"
                    format="currency"
                    predictions={data.predictions.revenue}
                    anomalies={getAnomalies('revenue')}
                  />
                </div>
                <AIInsightsPanel aiInsights={aiInsights} />
              </div> */}

              {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RealtimeChart
                  data={data.temperature}
                  title="Temperature Monitoring"
                  color="#ef4444"
                  format="temperature"
                  anomalies={getAnomalies('temperature')}
                />
                <RealtimeChart
                  data={data.vibration}
                  title="Vibration Analysis"
                  color="#f59e0b"
                  format="vibration"
                  anomalies={getAnomalies('vibration')}
                />
              </div> */}
            </>
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

          {activeTab === 'sensors' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealtimeChart
                data={data.temperature}
                title="Temperature Sensor Data"
                color="#ef4444"
                format="temperature"
                anomalies={getAnomalies('temperature')}
              />
              <RealtimeChart
                data={data.vibration}
                title="Vibration Sensor Data"
                color="#f59e0b"
                format="vibration"
                anomalies={getAnomalies('vibration')}
              />
              <RealtimeChart
                data={data.acceleration}
                title="Acceleration Sensor Data"
                color="#6366f1"
                format="acceleration"
                anomalies={getAnomalies('acceleration')}
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