import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import html2canvas from "html2canvas";
import 'leaflet/dist/leaflet.css';

const pointerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) map.setView([lat, lng], 18, { animate: false });
    }, [lat, lng, map]);
    return null;
};

const MiniMap = React.forwardRef(({ lat, lng, path }, ref) => {
    if (!lat || !lng) return <div style={{ color: 'white', padding: 20, fontSize: 10 }}>GPS Locating...</div>;
    return (
        <div ref={ref} style={{ width: '150px', height: '150px', border: '2px solid white', background: 'white' }}>
            <MapContainer
                center={[lat, lng]}
                zoom={18}
                zoomControl={false}
                dragging={false}
                attributionControl={false}
                style={{ width: "100%", height: "100%" }}
            >
                {/* Use crossOrigin to prevent canvas tainting */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    crossOrigin="anonymous"
                />
                <Polyline positions={path} color="#00BFFF" weight={4} />
                <Marker position={[lat, lng]} icon={pointerIcon} />
                <RecenterMap lat={lat} lng={lng} />
            </MapContainer>
        </div>
    );
});

export default function GeoCamera({ mode, onCapture, onClose, metaData }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const mapContainerRef = useRef(null);
    // const gpsRef = useRef({ lat: 0, lng: 0 });
    const gpsRef = useRef({ 
    lat: parseFloat(metaData?.lat) || 0, 
    lng: parseFloat(metaData?.lng) || 0 
});  //new update 
    const isRecordingRef = useRef(false);

    // CACHE FOR MAP IMAGE
    const mapCacheRef = useRef(null);

    // const [uiGps, setUiGps] = useState({ lat: 0, lng: 0 });
    const [uiGps, setUiGps] = useState({ 
    lat: parseFloat(metaData?.lat) || 0, 
    lng: parseFloat(metaData?.lng) || 0 
});  //new update
    const [path, setPath] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const animationRef = useRef(null);

    useEffect(() => {
        let activeStream = null;
        let isUnmounted = false; // The Kill-Switch flag

        // 1. WATCH GPS
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                if (isUnmounted) return;
                const { latitude, longitude } = pos.coords;
                gpsRef.current = { lat: latitude, lng: longitude };  //new update
                setUiGps({ lat: latitude, lng: longitude });
            },
            (err) => console.error(err),
            { enableHighAccuracy: true, maximumAge: 0 }
        );

        // 2. MAP CAPTURE (The likely culprit for the lag)
        const mapCaptureInterval = setInterval(async () => {
            // If unmounting, stop this heavy process immediately
            if (isUnmounted || mode === 'selfie' || !mapContainerRef.current) return;

            try {
                const canvas = await html2canvas(mapContainerRef.current, {
                    useCORS: true,
                    logging: false,
                    scale: 1
                });
                if (!isUnmounted) mapCacheRef.current = canvas;
            } catch (e) { console.error(e); }
        }, 200);

        // 3. START CAMERA
        async function startCam() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: mode === 'selfie' ? 'user' : 'environment', width: 1280, height: 720 },
                    audio: mode === 'video'
                });

                // If user closed the modal while camera was booting, kill it immediately
                if (isUnmounted) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }

                activeStream = stream;
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (e) {
                if (!isUnmounted) {
                    alert("Camera Error");
                    onClose();
                }
            }
        }

        startCam();

        // 4. INSTANT CLEANUP
        return () => {
            isUnmounted = true; // Signal all async tasks to stop NOW

            // Stop GPS immediately
            navigator.geolocation.clearWatch(watchId);

            // Stop the heavy Map Capture loop
            clearInterval(mapCaptureInterval);

            // FORCE STOP CAMERA HARDWARE
            if (activeStream) {
                const tracks = activeStream.getTracks();
                tracks.forEach(track => {
                    track.stop(); // This turns the LED off
                    track.enabled = false; // Extra safety
                });
            }

            // Wipe the video element to free memory
            if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.load(); // Forces the element to release resources
            }
        };
    }, [mode, onClose]);

    const drawToCanvas = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d', { alpha: false });
        const video = videoRef.current;

        // Sync canvas size once
        if (canvasRef.current.width !== video.videoWidth) {
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;
        }

        // 1. Draw Camera Frame (Instant)
        ctx.drawImage(video, 0, 0);

        if (mode !== 'selfie') {
            // 2. HUD TOP BOX (Instant)
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(0, 0, 500, 160);

            ctx.fillStyle = "#FFD700";
            ctx.font = "bold 24px Arial";
            ctx.fillText(`District: ${metaData.district || 'N/A'}`, 20, 40);
            ctx.fillText(`Block: ${metaData.block || 'N/A'}`, 20, 75);
            ctx.fillText(`Route: ${metaData.route || 'N/A'}`, 20, 110);

            ctx.fillStyle = "white";
            ctx.font = "bold 20px Arial";
            ctx.fillText(`Lat: ${gpsRef.current.lat.toFixed(6)}  Lng: ${gpsRef.current.lng.toFixed(6)}`, 20, 145);

            // 3. Draw Cached Map (Instant)
            // This pulls from our background capture so it never blocks the video
            if (mapCacheRef.current) {
                ctx.drawImage(mapCacheRef.current, 20, canvasRef.current.height - 180, 150, 150);
            }
        }

        if (isRecordingRef.current) {
            animationRef.current = requestAnimationFrame(drawToCanvas);
        }
    };

    const takePhoto = async () => {
        // Draw one final frame
        drawToCanvas();
        canvasRef.current.toBlob(blob => {
            onCapture(URL.createObjectURL(blob), blob, gpsRef.current);
        }, 'image/jpeg', 0.9);
    };

    const startRecording = () => {
        isRecordingRef.current = true;
        setIsRecording(true);
        setTimer(0);

        drawToCanvas(); // Start the sync loop

        const stream = canvasRef.current.captureStream(30); // 30 FPS
        const recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp8',
            videoBitsPerSecond: 3000000 // 3Mbps
        });

        chunksRef.current = [];
        recorder.ondataavailable = e => chunksRef.current.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
            onCapture(URL.createObjectURL(blob), blob, gpsRef.current);
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
        const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        mediaRecorderRef.current.timerId = interval;
    };

    const stopRecording = () => {
        isRecordingRef.current = false;
        if (mediaRecorderRef.current && mediaRecorderRef.current.timerId) {
            clearInterval(mediaRecorderRef.current.timerId);
        }
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        cancelAnimationFrame(animationRef.current);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'black', zIndex: 9999 }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {isRecording && (
                <div style={{
                    position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(255, 0, 0, 0.8)', color: 'white', padding: '8px 20px',
                    borderRadius: '25px', fontWeight: 'bold', fontSize: '20px', display: 'flex',
                    alignItems: 'center', gap: '10px', zIndex: 100
                }}>
                    <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%', animation: 'pulse 1s infinite' }}></div>
                    REC {timer}s
                </div>
            )}

            {/* Visual MiniMap for User - The Track is visible here */}
            {mode !== 'selfie' && (
                <div style={{ position: 'absolute', bottom: '100px', left: '20px', zIndex: 10 }}>
                    <MiniMap ref={mapContainerRef} lat={uiGps.lat} lng={uiGps.lng} path={path} />
                </div>
            )}

            {/* CONTROL OVERLAYS */}
            <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', textShadow: '1px 1px 2px black', zIndex: 5 }}>
                <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '18px' }}>{metaData.route || 'Route'}</div>
                <div style={{ fontSize: '14px' }}>Lat: {uiGps.lat.toFixed(6)}</div>
                <div style={{ fontSize: '14px' }}>Lng: {uiGps.lng.toFixed(6)}</div>
            </div>

            <div style={{ position: 'absolute', bottom: '40px', width: '100%', textAlign: 'center', zIndex: 20 }}>
                {mode === 'photo' || mode === 'selfie' ? (
                    <button onClick={takePhoto} style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', border: '5px solid #ccc' }} />
                ) : (
                    <button onClick={isRecording ? stopRecording : startRecording}
                        style={{ width: 80, height: 80, borderRadius: '50%', background: isRecording ? 'black' : 'red', border: '5px solid white' }}>
                        {isRecording && <div style={{ width: 30, height: 30, background: 'red', borderRadius: '4px', margin: 'auto' }}></div>}
                    </button>
                )}
            </div>

            <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, color: 'white', fontSize: 35, background: 'none', border: 'none', zIndex: 30 }}>✕</button>
            <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }`}</style>
        </div>
    );
}