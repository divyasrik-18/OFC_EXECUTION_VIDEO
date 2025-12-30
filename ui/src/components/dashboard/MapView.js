import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, LayersControl } from 'react-leaflet';
import L from 'leaflet';

const SurveyIcon = L.divIcon({
    className: 'custom-survey-icon',
    html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>',
    iconSize: [16, 16]
});

const MapView = ({ surveys, center, zoom }) => {
    return (
        <MapContainer center={center} zoom={zoom} style={{ flex: 1, width: '100%' }}>
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
            </LayersControl>

            {surveys.map(s => s.latitude && (
                <Marker key={s.id} position={[s.latitude, s.longitude]} icon={SurveyIcon}>
                    <Popup>
                        <strong>{s.locationType}</strong><br/>
                        File: {s.generatedFileName}<br/>
                        By: {s.submittedBy}
                    </Popup>
                    <Tooltip direction="top" opacity={1}>
                        {s.generatedFileName} ({s.submittedBy})
                    </Tooltip>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;