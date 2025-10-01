import React from 'react';
import { TrendingUp, TrendingDown, Brain, AlertTriangle } from 'lucide-react';

const MetricCard = ({ title, value, change, icon, color, prediction, anomaly }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
        <div className={`w-full h-full ${color} rounded-full transform translate-x-8 -translate-y-8`}></div>
      </div>
      
      <div className="flex items-center justify-between relative">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {anomaly && (
              <AlertTriangle className="h-4 w-4 text-orange-500" title="Anomaly detected" />
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
            <span className="text-sm text-gray-500">vs last period</span>
          </div>
          
          {/* {prediction && (
            <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              <Brain className="h-3 w-3" />
              <span>AI: {prediction.value} ({(prediction.confidence * 100).toFixed(0)}%)</span>
            </div>
          )} */}
        </div>
        
        <div className={`p-3 rounded-full ${color} shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;