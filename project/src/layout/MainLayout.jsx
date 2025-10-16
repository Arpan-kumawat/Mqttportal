import React, { useState } from "react";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import { useWebSocket } from "../hooks/useWebSocket";
import { Outlet } from "react-router-dom";

const MainLayout = ({ alerts, setAlerts }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [MenuPage, setMenuPage] = useState("Dashboard");
  const { data, isConnected, aiInsights } = useWebSocket();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        setMenuPage={setMenuPage}
      />
      <div className="flex-1 flex flex-col">
        <Header
          onMenuToggle={() => setSidebarOpen(true)}
          isSidebarOpen={sidebarOpen}
          aiInsights={aiInsights}
          MenuPage={MenuPage}
          alerts={alerts}          // 👈 pass alerts
          setAlerts={setAlerts}    // 👈 for clearing / marking seen
        />
        <main className="p-4 lg:p-6 flex-1 lg:max-h-[90vh] overflow-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
