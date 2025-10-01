import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

const CpuMonitor = () => {
  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      
      {/* CPU Usage */}
      <div  >
        <h2 style={{ color: "#eaeaea", textAlign: "center",background:"red" }}>CPU Usage</h2>
        <ReactSpeedometer
          minValue={0}
          maxValue={100}
          value={12.25}
          needleColor="white"
          needleTransition=""
          startColor="green"
          endColor="green"
          ringWidth={40}
          needleHeightRatio={0.9}
          segments={1}
          height={200}
          width={250}
          currentValueText="11%"
          textColor="black"
        />
      </div>

      {/* CPU Temperature */}
      {/* <div >
        <h2 style={{ color: "#eaeaea", textAlign: "center" }}>CPU Temperature</h2>
        <ReactSpeedometer
          minValue={20}
          maxValue={85}
          value={51.121}
          needleColor="white"
          startColor="green"
          endColor="gray"
          segments={20}
          height={200}
          width={250}
          currentValueText="51.12 celsius"
          textColor="#eaeaea"
        />
      </div> */}
    </div>
  );
};

export default CpuMonitor;
