import React from 'react'
// import {
//   PieChart,
//   Pie,
//   Legend,
//   Cell,
//   ResponsiveContainer,
//   Label
// } from "recharts";
import { Chart } from "react-google-charts";

export default function PieCharts() {

  const data = [
    ["Task", "Hours per Day"],
    ["buffer", 9],
    ["cached", 2],
    ["active", 2],
  
    ["free", 7],
  ];

  const options = {
      is3D: true,
        legend: {
      position: "bottom",
      
    
    },
  };
  return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"> 
          <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Memory Usage</h3>
        {/* <div className="flex items-center gap-2">
          {predictions.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              AI Prediction
            </div>
          )}
          {anomalies.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              Anomalies: {anomalies.length}
            </div>
          )}
        </div> */}
      </div>
      
   

      <div  style={{display:"flex",alignItems:"center",justifyContent:"center"}}> 


    <Chart
      chartType="PieChart"
      data={data}
      options={options}
    width={"400px"}
      height={"250px"}
    />
      </div>
        </div>
  );
}
