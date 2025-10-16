import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, Bell, User } from 'lucide-react';

const Header = ({ onMenuToggle, isSidebarOpen, aiInsights, MenuPage, alerts = [] }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false); // 🔔 control dropdown

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 shadow-sm relative">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-gray-900">{MenuPage}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* 🔔 Bell Icon */}
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {alerts.length}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg border border-gray-200 z-50 max-h-64 overflow-y-auto" 
            style={{scrollbarWidth:"none"}}>
              <div className="p-2 border-b bg-gray-100 text-sm font-semibold">
                Alerts ({alerts.length})
              </div>
              {alerts.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 text-center">No alerts</div>
              ) : (
                alerts.map((a, i) => (
                  <div key={i} className="p-2 border-b text-sm">
                    <div className="font-medium text-gray-800">{a.key}</div>
                    <div className="text-xs text-gray-500">
                      Value: {a.value.toFixed(2)} | Baseline: {a.baseline.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">{a.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 👤 User info */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">{user?.emp_name}</p>
            <p className="text-xs text-gray-500">{user?.emp_email_id}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
