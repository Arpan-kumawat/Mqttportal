import React from 'react'
import { Chart } from "react-google-charts";

export default function PieCharts({ value }) {

  const data = [
    ["Task", "Hours per Day"],
    ["Buffer", value?.gateway?.buffers,],
    ["Active", value?.gateway?.active,],
    ["Cached", value?.gateway?.cached,],
    ["Free", value?.gateway?.free,],
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

      </div>



      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>


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
