import React, { useState, useMemo, useEffect } from "react";
import RealtimeChart from "../components/RealtimeChart";
import AIInsightsPanel from "../components/AIInsightsPanel";
import { useWebSocket } from "../hooks/useWebSocket";
import { Select, Option, Stack } from "@mui/joy";
import OverView from "../Views/Dashboard/OverView";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSensor, setSelectedSensor] = useState("");
  const { data, isConnected, aiInsights } = useWebSocket();

  const filterData = useMemo(() => {
    const sensor = selectedSensor || "GW028"; // fallback
    if (!data?.gateway?.list) return { gateway: { list: [] }, ...data };
    return {
      ...data,
      gateway: {
        ...data.gateway,
        list: data.gateway.list.filter((e) => e.gateway === sensor),
      },
    };
  }, [data, selectedSensor]);

  useEffect(() => {
    let gat = localStorage.getItem("GateWay");

    if (gat) {
      setSelectedSensor(gat);
    } else {
      setSelectedSensor("GW028");
    }
  }, []);

  // Handle gateway selection change
  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      localStorage.setItem("GateWay", newValue);
      setSelectedSensor(newValue);
    }
  };

  // Tabs
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "Health", label: "Health Metrics" },
  ];

  // Helper: get anomalies for a metric
  const getAnomalies = (type) => {
    const series = data?.[type] || [];
    return (
      data?.anomalies?.filter((anomaly) =>
        series.some((point) => point.timestamp === anomaly.timestamp)
      ) || []
    );
  };

  // Helper: map gateway ID to friendly name
  const getGatewayName = (id) => {
    switch (id) {
      case "GW028":
        return "NBC Jaipur";
      case "GAZ":
        return "Ghaziabad";
      case "Vadodra":
        return "Vadodra";
      default:
        return id;
    }
  };

  return (
    <>
      {/* Top Status Bar */}
      <div className="mb-6 border-b">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Tabs + Connection Status */}
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors
                      ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Connection Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
                }`}
              ></div>
              <span className="text-gray-600">
                {isConnected ? "Live data streaming" : "Connection lost"}
              </span>
            </div>
          </div>

          {/* Gateway Selector */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-700">Gateway:</span>
              <Stack sx={{ minWidth: 100 }}>
                <Select
                  size="sm"
                  defaultValue={"GW028"}
                  placeholder="Select Gateway"
                  value={selectedSensor}
                  onChange={handleChange}
                >
                  {data?.gateway?.list?.map((item) => (
                    <Option key={item?.gateway} value={item?.gateway}>
                      {getGatewayName(item?.gateway)}
                    </Option>
                  ))}
                  <Option disabled value="Vadodra">
                    Vadodra
                  </Option>
                </Select>
              </Stack>
              <span className="font-medium text-gray-700 ml-2">Uptime:</span>
              <span>
                {filterData?.gateway?.list &&
                  filterData?.gateway?.list[0]?.gw_info?.uptime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      {activeTab === "overview" && filterData?.gateway?.list && (
        <OverView
          filterData={filterData}
          isConnected={isConnected}
          aiInsights={aiInsights}
        />
      )}

      {activeTab === "Health" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RealtimeChart
            data={data?.revenue}
            title="Revenue Analytics with Predictions"
            color="#10b981"
            format="currency"
            predictions={data?.predictions?.revenue}
            anomalies={getAnomalies("revenue")}
          />
          <RealtimeChart
            data={data?.users}
            title="User Analytics with Predictions"
            color="#3b82f6"
            format="number"
            predictions={data?.predictions?.users}
            anomalies={getAnomalies("users")}
          />
          <RealtimeChart
            data={data?.orders}
            title="Order Analytics with Predictions"
            color="#8b5cf6"
            format="number"
            predictions={data?.predictions?.orders}
            anomalies={getAnomalies("orders")}
          />
          <RealtimeChart
            data={data?.conversion}
            title="Conversion Rate with Predictions"
            color="#f59e0b"
            format="percentage"
            predictions={data?.predictions?.conversion}
            anomalies={getAnomalies("conversion")}
          />
        </div>
      )}

      {activeTab === "ai-predictions" && (
        <div className="space-y-6">
          <AIInsightsPanel aiInsights={aiInsights} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(data?.predictions || {}).map(
              ([metric, predictions]) =>
                predictions.length > 0 && (
                  <RealtimeChart
                    key={metric}
                    data={data?.[metric]}
                    title={`${
                      metric.charAt(0).toUpperCase() + metric.slice(1)
                    } Predictions`}
                    color="#8b5cf6"
                    format={
                      metric === "revenue"
                        ? "currency"
                        : metric === "conversion"
                        ? "percentage"
                        : "number"
                    }
                    predictions={predictions}
                    anomalies={getAnomalies(metric)}
                  />
                )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
