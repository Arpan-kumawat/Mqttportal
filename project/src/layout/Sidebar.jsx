import React, { useState } from 'react';
import { 
  BarChart3, Home, TrendingUp, Users, ShoppingCart, Settings, X, 
  Brain, AlertTriangle, Thermometer, Activity, Zap ,Laptop,History,BellRing
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// ...existing imports...

const Sidebar = ({ isOpen, onClose,setMenuPage }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const menuItems = [
    { icon: Home, label: 'Dashboard', route:'dashboard'},
    { icon: BarChart3, label: 'Analytics' },
    // { icon: Brain, label: 'AI Predictions' },
    { icon: History, label: 'History' },
    { icon: Users, label: 'Users' },
    // { icon: ShoppingCart, label: 'Orders' },
    { icon: Thermometer, label: 'Sensors Info' },
    { icon: Laptop, label: 'Gateway Setup' },
    { icon: BellRing, label: 'Alaram' },
    { icon: Settings, label: 'Settings',route:'setting' }
  ];
  const navigate = useNavigate();
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
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {/* <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div> */}
         <img style={{maxWidth:"20%"}} src='https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/NBC_Bearings.svg/100px-NBC_Bearings.svg.png' alt='Logo' />
            <span className="font-semibold text-lg">NBC Bearings</span>
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
                <button
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${activeTab === item.label
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                  onClick={() => {
                    setActiveTab(item.label);
                    setMenuPage(item.label);
                    if (item.route) navigate(`/${item.route}`);
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-3 border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">System Active</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-3 w-3 text-purple-400" />
              <span className="text-xs text-gray-400">Real-time predictions</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 text-orange-400" />
              <span className="text-xs text-gray-400">Anomaly detection</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;