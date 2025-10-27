import React from 'react'
import RealtimeGraph from '../components/RealtimeGraph'

export default function FFT() {

  const getAnomalies = (type) => {
    const series =  [];
    return series
  };


  return (
   
    <>
       <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  {/* {data.sensor?.list && data.sensor?.list[0]?.gvib?.sensorType} */}
                 SVT-A Series
                </h3>
              </div>
            
            </div>
          </div>
       <div className=" lg:flex mb-4">
        {/* Chart takes 3/4 width on large screens */}
        <div className="w-full pr-2">
          <div className="mb-4">
            <RealtimeGraph
              data={[]}
              selectedSensor={""}
              selectedAxis={""}
             title="Acceleration RMS (g)"
              color="#6366f1"
              type="acceleration"
              format="acceleration"
              onNewAlert={[]} 
              anomalies={getAnomalies("vibration")}
            />
          </div>
              <div className="mb-4">
                      <RealtimeGraph
                          data={[]}
              selectedSensor={""}
              selectedAxis={""}
                        title="FFT"
                        color="#6366f1"
                        type="acceleration"
                        format="acceleration"
                        onNewAlert={[]} 
                        anomalies={getAnomalies("acceleration")}
                      />
                    </div>
     
        </div>


      </div>
    </>
  )
}
