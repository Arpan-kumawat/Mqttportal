import { useWebSocket } from "../hooks/useWebSocket";

export default function SensorInfo() {
  const { data } = useWebSocket();

  const formatDate = (v) => {
    if (!v) return "-";
    const d = new Date(v);
    if (isNaN(d)) return String(v);
    return d.toLocaleString();
  };

  const getBatteryColor = (battery) => {
    if (battery >= 3.4) return "bg-green-100 text-green-700";
    if (battery > 3.2) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusColor = (time) => {
    if (typeof time !== "number") return "";
    if (time < 86400) return "text-green-600 font-medium";
    if (time < 172800) return "text-yellow-600 font-medium";
    return "text-red-600 font-medium";
  };

    let selectedGatwat = localStorage.getItem("GateWay");

  let filterSensor = data?.sensor?.list?.filter(
    (e) => e?.gateway == selectedGatwat
  );


  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{filterSensor?.length &&  filterSensor[0]?.gvib?.sensorType}</h2> 
           
      <table className="min-w-full text-sm border-collapse">
        <thead className= "text-gray-100" style={{backgroundColor:"#21409a"}}>
          <tr>
            {[
              "ID",
              "Description",
              "Group",
              "Serial",
              "MAC Address",
              "RSSI",
              "Battery (V)",
              "Version",
              "Last Update",
            ].map((head, i) => (
              <th
                key={i}
                className="px-4 py-3 font-semibold border-b border-gray-300 text-left"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filterSensor?.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-3 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            filterSensor?.map((obj, idx) => {
              const battery = obj.sns_info?.batteryVoltage ?? obj.batt ?? null;
              const passTime = obj.lastUpdated ?? obj.updatedAt ?? null;

              return (
                <tr
                  key={obj.sensorId ?? idx}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-4 py-2 border-b border-gray-200 text-gray-700">
                    {obj.sensorId ?? "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-gray-700">
                    {obj.sns_info?.sensorType ?? obj.name ?? "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-gray-700">
                    {obj.sns_info?.group ?? "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-gray-700">
                    {obj.sns_info?.sensorType ?? obj.device ?? "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-gray-700">
                    {obj.sns_info?.macAddress ?? obj.macAddress ?? "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-gray-700">
                    {obj.sns_info?.rssi ?? "-"} dBm
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {battery ? (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getBatteryColor(
                          battery
                        )}`}
                      >
                        {battery.toFixed(2)}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-gray-700">
                    {obj.sns_info?.version ?? "-"}
                  </td>
                  <td
                    className={`px-4 py-2 border-b border-gray-200 ${getStatusColor(
                      passTime
                    )}`}
                  >
                    {formatDate(passTime)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
