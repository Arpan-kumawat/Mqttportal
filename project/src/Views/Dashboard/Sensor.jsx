import React from 'react'
import RealtimeChart from '../../components/RealtimeChart';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
export default function Sensor({data}) {



  const getAnomalies = (type) => {
    const series = data[type] || [];
    return data.anomalies.filter(anomaly =>
      series.some(point => point.timestamp === anomaly.timestamp)
    );
  };


  return (
      <>



          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">


              </div>
              <div className="text-sm text-gray-500 flex items-center gap-4">
                <Select defaultValue="all" >
                  <Option value={"all"}>All Sensors</Option>
                  {data?.sensor?.list?.map((item) =>
                    <Option value={item?.sensorId}>Sensor {item?.sensorId}</Option>
                  )}
                </Select>
                <Select defaultValue="all" >
                  <Option value="all">All </Option>
                  <Option value="x">x</Option>
                  <Option value="y">y</Option>
                  <Option value="z">z</Option>
                </Select>
              </div>
            </div>
          </div>






          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <RealtimeChart
              data={data.temperature}
              title="Temperature Sensor Data"
              color="#ef4444"
              format="temperature"
              anomalies={getAnomalies('temperature')}
            />
            <RealtimeChart
              data={data.vibration}
              title="Vibration Sensor Data"
              color="#f59e0b"
              format="vibration"
              anomalies={getAnomalies('vibration')}
            />
            <RealtimeChart
              data={data.acceleration}
              title="Acceleration Sensor Data"
              color="#6366f1"
              format="acceleration"
              anomalies={getAnomalies('acceleration')}
            />
          </div>
        </>
  )
}
