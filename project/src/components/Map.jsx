import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MyMap = () => {
  const locations = [
    // { id: 1, name: "New Delhi", lat: 28.6139, lng: 77.2090 },
    { id: 2, name: "Bagru", lat: 26.808235,lng: 75.539598, },
    { id: 3, name: "Jaipur", lat: 26.918411,lng: 75.774652, },



  ];

  const center = [26.918411, 75.774652]; // Central India (so all markers are visible)

  return (
     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"> 
          <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sensor Location</h3>
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
    <div style={{ height: "35vh", width: "100%" }}>
      <MapContainer center={center} zoom={8} style={{ height: "100%", width: "100%" }} zoomControl={false} >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>
              <b>{loc.name}</b>
              <br />
              Lat: {loc.lat}, Lng: {loc.lng}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
     </div>
  );
};

export default MyMap;
