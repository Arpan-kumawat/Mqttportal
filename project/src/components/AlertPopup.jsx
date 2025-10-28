import React from "react";
import { X, AlertTriangle } from "lucide-react";

export default function AlertPopup({ onClose, data }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-[420px] rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-white" />
            <h2 className="font-semibold text-lg">Alert !</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <p className="text-gray-800 font-semibold">
              Pump Name : <span className="font-normal">{data.pumpName}</span>
            </p>
            <p className="text-gray-800 font-semibold">
              Parameter Name :{" "}
              <span className="font-normal">{data.parameterName}</span>
            </p>
          </div>

          <hr />

          <div className="flex justify-between text-sm font-semibold">
            <span className="text-yellow-600">
              LSL : <span className="text-black">{data.lsl}</span>
            </span>
            <span className="text-red-600">
              VALUE : <span className="text-black">{data.value}</span>
            </span>
            <span className="text-red-600">
              USL : <span className="text-black">{data.usl}</span>
            </span>
          </div>

          <hr />

          <p className="text-center text-gray-700 text-sm font-semibold">
            {data.message}
          </p>

          {/* Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-indigo-700 text-white px-5 py-2 rounded-md font-semibold hover:bg-indigo-800 transition"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
