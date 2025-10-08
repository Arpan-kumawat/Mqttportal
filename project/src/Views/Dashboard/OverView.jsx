import React from "react";
import MetricCard from "../../components/MetricCard";
import {
  Cpu,
  Users,
  HardDrive,
  Database,
  Thermometer,
  Activity,
  Zap,
} from "lucide-react";
import RealtimeChart from "../../components/RealtimeChart";
import CpuMonitor from "../../components/CpuMonitor";
import MyMap from "../../components/Map";
import PieCharts from "../../components/PieChart";

export default function OverView({ data, isConnected, aiInsights }) {
  const getCurrentValue = (type) => {
    const latestData = data[type] || [];
    return latestData.length > 0 ? latestData[latestData.length - 1].value : 0;
  };


  const getPrediction = (type) => {
    const predictions = data.predictions[type] || [];
    return predictions.length > 0 ? predictions[0] : null;
  };

  const getAnomalies = (type) => {
    const series = data[type] || [];
    return data.anomalies.filter((anomaly) =>
      series.some((point) => point.timestamp === anomaly.timestamp)
    );
  };

  return (
    <>
      {/* Business Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="CPU usage"
          value={`${getCurrentValue("gateway.overall").toLocaleString()}%`}
          change={0}
          icon={<Cpu className="h-6 w-6 text-white" />}
          color="bg-green-500"
          prediction={getPrediction("gateway.overall")}
          anomaly={getAnomalies("gateway.overall").length > 0}
        />
        <MetricCard
          title="Gateway Temp"
          value={`${getCurrentValue("gateway.temperature").toFixed(3)}°C`}
          change={0}
          icon={<Thermometer className="h-6 w-6 text-white" />}
          color="bg-red-500"
          anomaly={getAnomalies("gateway.temperature").length > 0}
        />
        <MetricCard
          title="Active Memory"
          value={getCurrentValue("gateway.active").toLocaleString()}
          change={0}
          icon={<HardDrive className="h-6 w-6 text-white" />}
          color="bg-purple-500"
          prediction={getPrediction("gateway.active")}
          anomaly={getAnomalies("gateway.active").length > 0}
        />
        <MetricCard
          title="Total Drive Used"
          value={`${getCurrentValue("gateway.drv_usd").toFixed(2)} GB`}
          change={0}
          icon={<Database className="h-6 w-6 text-white" />}
          color="bg-orange-500"
          prediction={getPrediction("gateway.drv_usd")}
          anomaly={getAnomalies("gateway.drv_usd").length > 0}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RealtimeChart
            data={data.gateway}
            title="CPU Usage with Temperature"
            color="#ef4444"
            format="temperature"
            anomalies={getAnomalies("temperature")}
          />
        </div>
        <CpuMonitor
          data={getCurrentValue("gateway.overall")}
          className="lg:col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MyMap data={data} />
        </div>

        <div className="lg:col-span-1">
          <PieCharts value={data} />
        </div>
      </div>
    </>
  );
}
