import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

const CpuMonitor = () => {
  return (
       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"> 
          <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">CPU Usage</h3>
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

     
        <ReactSpeedometer
          minValue={0}
          maxValue={100}
          value={12.25}
          needleColor="red"
          needleTransition=""
          startColor="#22c55e"
          endColor="green"
          ringWidth={40}
          needleHeightRatio={0.9}
          segments={10}
          height={250}
          width={250}
          currentValueText="11.00 %"
          textColor="black"
        />

 </div>
  
    </div>
  );
};

export default CpuMonitor;
