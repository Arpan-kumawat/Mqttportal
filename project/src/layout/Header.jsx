import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, Bell, User, Brain, Zap } from 'lucide-react';

const Header = ({ onMenuToggle, isSidebarOpen, aiInsights,MenuPage }) => {
  const { user, logout } = useAuth();
  const activeAlerts = aiInsights?.alerts?.length || 0;

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="hidden lg:block">
          <div className="flex items-center gap-2">
            {/* <Brain className="h-6 w-6 text-blue-600" /> */}
            {/* <img style={{maxWidth:"30%"}} src='https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/NBC_Bearings.svg/100px-NBC_Bearings.svg.png' alt='Logo' /> */}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{MenuPage}</h1>
              {/* <p className="text-sm text-gray-500 flex items-center gap-1">
                <Zap className="h-3 w-3 text-green-500" />
                flexible Solutions
              </p> */}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* AI Status Indicator */}
        {/* <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-purple-700">AI Active</span>
        </div> */}
        
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors relative">
          <Bell className="h-5 w-5" />
          {activeAlerts > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeAlerts}
            </span>
          )}
        </button>
        
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