import React, { useState } from "react";
import {
  BarChart3,
  Home,
  TrendingUp,
  Users,
  ShoppingCart,
  Settings,
  X,
  Brain,
  AlertTriangle,
  Thermometer,
  Activity,
  Zap,
  Laptop,
  History,
  BellRing,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket";

import logo from "../assets/NBC.png";

// ...existing imports...

const Sidebar = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { pathname } = useLocation();

  React.useEffect(() => {
    // Map pathname to sidebar label so active state follows URL
    const map = {
      "/dashboard": "Dashboard",
      "/real-time": "Real Time",
       "/fft": "FFT",
      "/history": "History",
       "/alarm": "Alarm",
      "/user": "Users",
      "/sensor-info": "Sensors Info",
      "/setting": "Settings",
    };
    const label = map[pathname];
    if (label) setActiveTab(label);
  }, [pathname]);
  const { isSystemActive } = useWebSocket();

  const menuItems = [
    { icon: Home, label: "Dashboard", route: "dashboard" },
    { icon: BarChart3, label: "Real Time", route: "real-time" },
     { icon: BarChart3, label: "FFT", route: "fft" },
    // { icon: Brain, label: 'AI Predictions' },
    { icon: History, label: "History", route: "history" },
    { icon: Users, label: "Users", route: "user" },
    // { icon: ShoppingCart, label: 'Orders' },
    { icon: Thermometer, label: "Sensors Info", route: "sensor-info" },
    { icon: Laptop, label: "Gateway Setup" },
    { icon: BellRing, label: "Alarm",route:"alarm" },
    { icon: Settings, label: "Settings", route: "setting" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gradient-to-b from-white to-white text-white transform transition-transform duration-300 ease-in-out shadow-lg
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {/* <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div> */}
            <img style={{ maxWidth: "100%" }} src={logo} alt="Logo" />
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.label}>
                {item.route ? (
                  <NavLink
                    to={`/${item.route}`}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        isActive ? "text-white shadow-lg" : "text-black"
                      }`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "#21409a" : "transparent",
                    })}
                    onClick={() => {
                      setActiveTab(item.label);
                      // close mobile sidebar when navigating
                      if (isOpen) onClose();
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                ) : (
                  <button
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-black 
                        ${
                          activeTab === item.label
                            ? "text-white shadow-lg"
                            : "text-black"
                        }
                    `}
                    style={{
                      backgroundColor:
                        activeTab === item.label ? "#21409a" : "transparent",
                    }}
                    onClick={() => {
                      setActiveTab(item.label);
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`h-2 w-2  ${
                  isSystemActive ? "bg-green-400 " : "bg-red-400"
                }  rounded-full`}
              ></div>
              <span className="text-sm font-medium text-black ">
                {" "}
                {isSystemActive ? "System Active" : "System Inactive"}{" "}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-3 w-3 text-purple-400" />
              <span className="text-xs text-gray-900">
                Real-time predictions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 text-orange-400" />
              <span className="text-xs text-gray-900">Anomaly detection</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
