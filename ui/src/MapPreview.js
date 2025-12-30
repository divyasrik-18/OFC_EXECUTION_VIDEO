import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function MapPreview({ lat, lon, style }) {
  if (!lat || !lon) return <div style={{ ...style, background:'#333', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>Loading map...</div>;

  return (
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "2px solid white",
        height: "200px",
        ...style,
      }}
    >
      <MapContainer
        key={`${lat}-${lon}`} 
        center={[lat, lon]}
        zoom={15}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        <Marker position={[lat, lon]} />
      </MapContainer>
    </div>
  );
}