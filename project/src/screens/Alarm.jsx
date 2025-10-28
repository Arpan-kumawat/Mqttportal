import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useWebSocket } from "../hooks/useWebSocket";
import { Select, Option, Checkbox, FormLabel, Stack } from "@mui/joy";
import TextField from "@mui/material/TextField";
import { save_svtv_alarm } from "../utils/helper";
import AlertPopup from "../components/AlertPopup";

export default function AlarmPage() {
  const { data } = useWebSocket();
  const [selectedSensor, setSelectedSensor] = useState("");
  const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

  let selectedGatwat = localStorage.getItem("GateWay");

  let filterSensor = data?.sensor?.list?.filter(
    (e) => e?.gateway == selectedGatwat
  );

  const alertData = {
    pumpName: "Supply Pump 3",
    parameterName: "Vibration X Front",
    lsl: 0,
    value: 8.15,
    usl: 7,
    message: "VIBRATION X FRONT VALUE IS MORE THAN THE USL VALUE",
  };


  const [svtaAlarm, setSvtaAlarm] = useState({
    group_id: null,
    x_axis_upper_bound: 0,
    x_axis_lower_bound: 0,
    y_axis_upper_bound: 0,
    y_axis_lower_bound: 0,
    z_axis_upper_bound: 0,
    z_axis_lower_bound: 0,
    temp_upper_bound: 0,
    temp_lower_bound: 0,
  });

  const [svtvAlarm, setSvtvAlarm] = useState({
    sensor_id: null,
    selectedGatwat: selectedGatwat,
    vx: 0,
    vy: 0,
    vz: 0,
    gx: 0,
    gy: 0,
    gz: 0,
    temp_upper_bound: 0,
    temp_lower_bound: 0,
    trigger_group_id: null,
  });

  const [notification, setNotification] = useState({
    email_enabled: false,
    smtp_server: "smtp-mail.outlook.com",
    smtp_port: 587,
    use_ssl: false,
    username: "",
    password: "",
    target_email: "",
  });

  const incrementValue = (alarm, field, step = 0.1) => {
    if (alarm === "svta") {
      setSvtaAlarm((prev) => ({
        ...prev,
        [field]: Number((prev[field] + step).toFixed(1)),
      }));
    } else {
      setSvtvAlarm((prev) => ({
        ...prev,
        [field]: Number((prev[field] + step).toFixed(1)),
      }));
    }
  };

  const decrementValue = (alarm, field, step = 0.1) => {
    if (alarm === "svta") {
      setSvtaAlarm((prev) => ({
        ...prev,
        [field]: Number((prev[field] - step).toFixed(1)),
      }));
    } else {
      setSvtvAlarm((prev) => ({
        ...prev,
        [field]: Number((prev[field] - step).toFixed(1)),
      }));
    }
  };

  const handleSVTAConfirm = async () => {
    const { error } = true;
    if (error) {
      console.error("Error saving SVT-A alarm:", error);
    } else {
      alert("SVT-A alarm configuration saved successfully!");
    }
  };

  const handleSVTVConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await save_svtv_alarm(svtvAlarm);

      if (res?.data?.status) {
        alert("SVT-V alarm configuration saved successfully!");
      }
    } catch (error) {
      console.log({ text: error.message || "Failed to create user" });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async () => {
    const { error } = true;
    if (error) {
      console.error("Error saving notification config:", error);
    } else {
      alert("Notification configuration saved successfully!");
    }
  };

  const handleNotificationCancel = () => {
    setNotification({
      email_enabled: false,
      smtp_server: "",
      smtp_port: "",
      use_ssl: false,
      username: "",
      password: "",
      target_email: "",
    });
  };

  return (
    <div className="flex-1 p-2">
      <div className="grid grid-cols-3 gap-6">
        {/* SVT-A Series Alarm Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            SVT-A Series Alarm
          </h2>

          <div className="mb-2">
            <Stack sx={{ mr: 0 }}>
              <Select
                placeholder="Select group"
                size="sm"
                // value={selectedSensor}
                // onChange={handleChange}
              >
                {filterSensor?.map((item) => (
                  <Option key={item?.sensorId} value={item?.sensorId}>
                    Sensor {item?.sensorId}
                  </Option>
                ))}
              </Select>
            </Stack>
          </div>

          <div className="space-y-2">
            {[
              { label: "x-axis upper bound", field: "x_axis_upper_bound" },
              { label: "x-axis lower bound", field: "x_axis_lower_bound" },
              { label: "Y-axis upper bound", field: "y_axis_upper_bound" },
              { label: "Y-axis lower bound", field: "y_axis_lower_bound" },
              { label: "Z-axis upper bound", field: "z_axis_upper_bound" },
              { label: "Z-axis lower bound", field: "z_axis_lower_bound" },
              { label: "Temperature upper bound", field: "temp_upper_bound" },
              { label: "Temperature lower bound", field: "temp_lower_bound" },
            ].map((item) => (
              <div
                key={item.field}
                className="flex items-center justify-between py-2"
              >
                <p className="flex items-center gap-2 text-gray-900 text-sm font-medium flex-1">
                  <span>{item.label}</span>
                </p>
                <div className="flex items-center gap-3">
                  <TextField
                    size="small"
                    inputProps={{ maxLength: 2 }}
                    value={svtaAlarm[item.field] ?? ""}
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      setSvtaAlarm((prev) => ({
                        ...prev,
                        [item.field]: isNaN(newValue)
                          ? ""
                          : Number(newValue.toFixed(1)),
                      }));
                    }}
                    style={{ maxWidth: "4rem" }}
                  />

                  <div className="flex flex-col">
                    <button
                      onClick={() => incrementValue("svta", item.field)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ChevronUp size={18} />
                    </button>
                    <button
                      onClick={() => decrementValue("svta", item.field)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSVTAConfirm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-md mt-8 transition-colors text-sm uppercase tracking-wide"
          >
            CONFIRM
          </button>
        </div>

        {/* SVT-V Series Alarm Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            SVT-V Series Alarm
          </h2>
   {showAlert && (
        <AlertPopup data={alertData} onClose={() => setShowAlert(false)} />
      )}
          <div className="mb-2">
            <Stack sx={{ mr: 0 }}>
              <Select
                placeholder="Select Sensor"
                size="sm"
                value={selectedSensor}
                onChange={(e, newValue) => {
                  setSelectedSensor(newValue);
                  setSvtvAlarm((prev) => ({
                    ...prev,
                    sensor_id: newValue,
                  }));
                }}
              >
                {filterSensor?.map((item) => (
                  <Option key={item?.sensorId} value={item?.sensorId}>
                    Sensor {item?.sensorId}
                  </Option>
                ))}
              </Select>
            </Stack>
          </div>

          <div className="space-y-2">
            {[
              { label: "X-axis velocity RMS", field: "vx" },
              { label: "Y-axis velocity RMS", field: "vy" },
              { label: "Z-axis velocity RMS", field: "vz" },
              { label: "X-axis acceleration RMS", field: "gx" },
              { label: "Y-axis acceleration RMS", field: "gy" },
              { label: "Z-axis acceleration RMS", field: "gz" },
              { label: "Temperature upper bound", field: "temp_upper_bound" },
              { label: "Temperature lower bound", field: "temp_lower_bound" },
            ].map((item) => (
              <div
                key={item.field}
                className="flex items-center justify-between py-2"
              >
                <p className="flex items-center gap-2 text-gray-900 text-sm font-medium flex-1">
                  <span>{item.label}</span>
                </p>
                <div className="flex items-center gap-3">
                  <TextField
                    inputProps={{ maxLength: 2 }}
                    size="small"
                    value={svtvAlarm[item.field] ?? ""}
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      setSvtvAlarm((prev) => ({
                        ...prev,
                        [item.field]: isNaN(newValue)
                          ? ""
                          : Number(newValue.toFixed(1)),
                      }));
                    }}
                    style={{ maxWidth: "4rem" }}
                  />

                  <div className="flex flex-col">
                    <button
                      onClick={() => incrementValue("svtv", item.field)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ChevronUp size={18} />
                    </button>
                    <button
                      onClick={() => decrementValue("svtv", item.field)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6 mt-6">
            <label className="text-gray-900 text-sm font-medium mb-2 block">
              Trigger SVT-A group:
            </label>
            <select className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500">
              <option>None</option>
            </select>
          </div>

          <button
            disabled={loading}
            onClick={handleSVTVConfirm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-md mt-2 transition-colors text-sm uppercase tracking-wide"
          >
            CONFIRM
          </button>
        </div>

        {/* Alarm Notification Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Alarm Notification
          </h2>

          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-900 text-sm font-medium">
              Email alarm notification:
            </span>
            <button
              onClick={() =>
                setNotification((prev) => ({
                  ...prev,
                  email_enabled: !prev.email_enabled,
                }))
              }
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notification.email_enabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notification.email_enabled ? "translate-x-6" : ""
                }`}
              ></span>
            </button>
          </div>

          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 rounded-md mb-6 transition-colors">
            Email setup
          </button>

          <div className="space-y-2">
            <div>
              <label className="text-gray-900 text-sm font-medium mb-1 block">
                SMTP server:
              </label>
              <input
                type="text"
                value={notification.smtp_server}
                onChange={(e) =>
                  setNotification((prev) => ({
                    ...prev,
                    smtp_server: e.target.value,
                  }))
                }
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-900 text-sm font-medium mb-1 block">
                Port number:
              </label>
              <input
                type="number"
                value={notification.smtp_port}
                onChange={(e) =>
                  setNotification((prev) => ({
                    ...prev,
                    smtp_port: parseInt(e.target.value),
                  }))
                }
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ssl"
                checked={notification.use_ssl}
                onChange={(e) =>
                  setNotification((prev) => ({
                    ...prev,
                    use_ssl: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="ssl"
                className="text-gray-900 text-sm font-medium"
              >
                Secure connection (SSL/TLS)
              </label>
            </div>

            <div>
              <label className="text-gray-900 text-sm font-medium mb-1 block">
                User name:
              </label>
              <input
                type="text"
                value={notification.username}
                onChange={(e) =>
                  setNotification((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-900 text-sm font-medium mb-1 block">
                Password:
              </label>
              <input
                type="password"
                value={notification.password}
                onChange={(e) =>
                  setNotification((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-900 text-sm font-medium mb-1 block">
                Target email addresses:
              </label>
              <input
                type="email"
                value={notification.target_email}
                onChange={(e) =>
                  setNotification((prev) => ({
                    ...prev,
                    target_email: e.target.value,
                  }))
                }
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleNotificationSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-md transition-colors text-sm uppercase tracking-wide"
            >
              SUBMIT
            </button>
            <button
              onClick={handleNotificationCancel}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3.5 rounded-md transition-colors text-sm uppercase tracking-wide"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
