import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Clock, Target } from 'lucide-react';

const AIInsightsPanel = ({ aiInsights }) => {
  const { trends, alerts, recommendations } = aiInsights;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-6 w-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        <div className="ml-auto flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          Live Analysis
        </div>
      </div>

      <div className="space-y-6">
        {/* Trend Analysis */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <h4 className="font-medium text-gray-900">Trend Analysis</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(trends).map(([metric, trend]) => (
              <div key={metric} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 capitalize">{metric}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  trend === 'increasing' ? 'bg-green-100 text-green-700' : 
                  trend === 'decreasing' ? 'bg-red-100 text-red-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <h4 className="font-medium text-gray-900">Active Alerts</h4>
            {alerts.length > 0 && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                {alerts.length}
              </span>
            )}
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No active alerts</p>
            ) : (
              alerts.slice(-3).map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {alert.metric} • {formatTime(alert.timestamp)}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <h4 className="font-medium text-gray-900">AI Recommendations</h4>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recommendations.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No recommendations available</p>
            ) : (
              recommendations.slice(-2).map((rec) => (
                <div key={rec.id} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{rec.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-blue-600">Confidence:</span>
                          <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${rec.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-blue-600">{(rec.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatTime(rec.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel;