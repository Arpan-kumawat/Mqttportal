import React, { useState } from "react";
import { Select, Option, Input, Typography, Stack } from "@mui/joy";

export default function TimerSetup() {
  const [timerConfig, setTimerConfig] = useState({
    enabled: false,
    groups: [],
    mode: "",
    startDelay: 0,
    daqPeriod: 0,
    daqDuration: 0,
  });

  const handleToggle = () => {
    // Check if all required fields are filled
    if (
      timerConfig.groups.length === 0 ||
      !timerConfig.mode ||
      timerConfig.startDelay === "" ||
      timerConfig.daqPeriod === "" ||
      timerConfig.daqDuration === ""
    ) {
      alert("Please fill all fields before enabling the timer");
      return;
    }
    
    setTimerConfig((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  return (
    <div className="flex justify-center p-2">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
           Timer Setup
          </h2>

        {/* Toggle */}
        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2 mb-4">
          <span className="text-gray-900 text-sm font-medium">
            Turn on timer
          </span>
          <button
            onClick={handleToggle}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              timerConfig.enabled ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                timerConfig.enabled ? "translate-x-6" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Select Groups */}
        <div className="mb-4">
          <label className="text-gray-700 text-sm font-medium block mb-1">
            Select groups:
          </label>
          <Select
            multiple
            placeholder="Select groups"
            value={timerConfig.groups}
            onChange={(e, newValue) =>
              setTimerConfig((prev) => ({ ...prev, groups: newValue }))
            }
            size="sm"
          >
            <Option value="SVTA Group 01">SVTA Group 01</Option>
            <Option value="SVTA Group 02">SVTA Group 02</Option>
            <Option value="SVTA Group 03">SVTA Group 03</Option>
          </Select>
        </div>

        {/* Timer Mode */}
        <div className="mb-4">
          <label className="text-gray-700 text-sm font-medium block mb-1">
            Timer mode:
          </label>
          <Select
            placeholder="Select mode"
            value={timerConfig.mode}
            onChange={(e, newValue) =>
              setTimerConfig((prev) => ({ ...prev, mode: newValue }))
            }
            size="sm"
          >
            <Option value="Run continuously">Run continuously</Option>
            <Option value="Run once">Run once</Option>

          </Select>
        </div>

        {/* Timer Start Delay */}
        <div className="mb-4">
          <label className="text-gray-700 text-sm font-medium block mb-1">
            Timer start delay (minutes):
          </label>
          <Input
            type="number"
            size="sm"
            value={timerConfig.startDelay}
            onChange={(e) =>
              setTimerConfig((prev) => ({
                ...prev,
                startDelay: e.target.value,
              }))
            }
          />
        </div>

        {/* DAQ Period */}
        <div className="mb-4">
          <label className="text-gray-700 text-sm font-medium block mb-1">
            DAQ period (minutes):
          </label>
          <Input
            type="number"
            size="sm"
            value={timerConfig.daqPeriod}
            onChange={(e) =>
              setTimerConfig((prev) => ({
                ...prev,
                daqPeriod: e.target.value,
              }))
            }
          />
        </div>

        {/* DAQ Duration */}
        <div className="mb-4">
          <label className="text-gray-700 text-sm font-medium block mb-1">
            DAQ duration (minutes):
          </label>
          <Input
            type="number"
            size="sm"
            value={timerConfig.daqDuration}
            onChange={(e) =>
              setTimerConfig((prev) => ({
                ...prev,
                daqDuration: e.target.value,
              }))
            }
          />
        </div>

        {/* Groups Running Timer */}
        <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <span className="text-blue-700 text-sm font-semibold">
            Groups running timer
          </span>
          <Typography
            level="body-sm"
            className="text-gray-800 mt-1 whitespace-pre-line"
          >
            SVT-A sensor groups:
            {"\n"}
            {timerConfig.groups.length > 0
              ? timerConfig.groups.map((g, i) => `${i + 1 < 10 ? "0" : ""}${i + 1}`).join(", ")
              : "None"}
          </Typography>
        </div>

        {/* Note */}
        <div className="border-t pt-3">
          <Typography
            level="body-xs"
            className="text-gray-700 text-[13px] leading-5"
          >
            <strong>Note:</strong> In "Run continuously" timer mode, DAQ period
            value must be larger than the product of DAQ duration and number of
            groups running timer. This allows each group to have enough time to
            take data.
          </Typography>
        </div>
      </div>
    </div>
  );
}
