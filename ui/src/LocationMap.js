// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix for default Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//     iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const LocationMap = ({ lat, lng }) => {
//     const mapContainerRef = useRef(null);
//     const mapInstanceRef = useRef(null);

//     useEffect(() => {
//         const latitude = parseFloat(lat);
//         const longitude = parseFloat(lng);

//         // If invalid coords, do nothing (component renders "No GPS" below)
//         if (isNaN(latitude) || isNaN(longitude) || (latitude === 0 && longitude === 0)) {
//             return;
//         }

//         // --- CLEANUP FUNCTION ---
//         const cleanupMap = () => {
//             if (mapInstanceRef.current) {
//                 mapInstanceRef.current.remove();
//                 mapInstanceRef.current = null;
//             }
//             // CRITICAL FIX: If the DOM element thinks it still has a map, strip the ID.
//             if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
//                 mapContainerRef.current._leaflet_id = null;
//             }
//         };

//         // 1. Clean up any existing instance before creating a new one
//         cleanupMap();

//         // 2. Initialize Map with a slight delay to allow Modal to render
//         const timer = setTimeout(() => {
//             if (!mapContainerRef.current) return;

//             try {
//                 const map = L.map(mapContainerRef.current, {
//                     center: [latitude, longitude],
//                     zoom: 16,
//                     attributionControl: false
//                 });

//                 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                     maxZoom: 19,
//                 }).addTo(map);

//                 L.marker([latitude, longitude]).addTo(map);

//                 mapInstanceRef.current = map;

//                 // 3. Fix "Grey Box" issue by refreshing size
//                 setTimeout(() => {
//                     map.invalidateSize();
//                 }, 300);

//             } catch (err) {
//                 console.warn("Map Init Warning:", err.message);
//             }
//         }, 100);

//         // Cleanup on unmount
//         return () => {
//             clearTimeout(timer);
//             cleanupMap();
//         };
//     }, [lat, lng]);

//     // --- RENDER ---
//     const latitude = parseFloat(lat);
//     const longitude = parseFloat(lng);

//     if (isNaN(latitude) || isNaN(longitude) || (latitude === 0 && longitude === 0)) {
//         return (
//             <div style={{ height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize:'12px' }}>
//                 No GPS
//             </div>
//         );
//     }

//     return (
//         <div style={{ width: '100%', height: '100%', position: 'relative' }}>
//             <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#e5e3df' }} />
//         </div>
//     );
// };

// export default LocationMap;



import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMap = ({ lat, lng }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (!latitude || !longitude) return;

        // Cleanup existing map
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }

        // Initialize Map
        if (mapRef.current) {
            mapInstance.current = L.map(mapRef.current, {
                center: [latitude, longitude],
                zoom: 16,
                zoomControl: false,
                attributionControl: false
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
            L.marker([latitude, longitude]).addTo(mapInstance.current);
            
            // Fix size issue if in a modal
            setTimeout(() => mapInstance.current?.invalidateSize(), 200);
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [lat, lng]);

    if (!lat || !lng) return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', fontSize: 12 }}>No GPS Data</div>;

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default LocationMap;