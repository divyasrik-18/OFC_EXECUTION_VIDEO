// // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// // // // // import 'leaflet/dist/leaflet.css';
// // // // // import L from 'leaflet';
// // // // // import SurveyForm from './SurveyForm';
// // // // // import JSZip from 'jszip';
// // // // // import { saveAs } from 'file-saver';
// // // // // import axios from 'axios';

// // // // // // --- ICONS ---
// // // // // const DefaultIcon = L.icon({ 
// // // // //     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", 
// // // // //     shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", 
// // // // //     iconSize: [25, 41], 
// // // // //     iconAnchor: [12, 41], 
// // // // //     popupAnchor: [1, -34] 
// // // // // });
// // // // // L.Marker.prototype.options.icon = DefaultIcon;

// // // // // const SurveyIcon = L.divIcon({ 
// // // // //     className: 'custom-survey-icon', 
// // // // //     html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', 
// // // // //     iconSize: [16, 16] 
// // // // // });

// // // // // // --- CONSTANTS ---
// // // // // const DATA_HIERARCHY = { 
// // // // //     districts: ['VARANASI', 'Hyderabad'], 
// // // // //     blocks: { 
// // // // //         'Hyderabad': ['Central', 'North'], 
// // // // //         'VARANASI': ['Badagon', 'City'] 
// // // // //     }, 
// // // // //     spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, 
// // // // //     rings: { 'Span-Uppal': ['Ring-01'] } 
// // // // // };

// // // // // const SPAN_COORDS = { 
// // // // //     'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 
// // // // //     'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } 
// // // // // };

// // // // // const TYPE_CODES = {
// // // // //     "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
// // // // //     "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
// // // // //     "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// // // // // };

// // // // // const API_BASE = 'http://localhost:4000';

// // // // // // --- HELPER FUNCTIONS ---
// // // // // const getRingPath = (start, end, offsetFactor) => { 
// // // // //     const midLat = (start.lat + end.lat) / 2; 
// // // // //     const midLng = (start.lng + end.lng) / 2; 
// // // // //     return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; 
// // // // // };

// // // // // const generatePointsOnPath = (path, count) => { 
// // // // //     const points = []; 
// // // // //     for (let i = 1; i <= count; i++) { 
// // // // //         const ratio = i / (count + 1); 
// // // // //         points.push({ 
// // // // //             lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, 
// // // // //             lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, 
// // // // //             id: `SP-${i}` 
// // // // //         }); 
// // // // //     } 
// // // // //     return points; 
// // // // // };

// // // // // const getSessionDuration = (str) => { 
// // // // //     if (!str) return '-'; 
// // // // //     const diff = new Date() - new Date(str); 
// // // // //     return `${Math.floor(diff/60000)} mins`; 
// // // // // };

// // // // // const isRecent = (timestamp) => {
// // // // //     if (!timestamp) return false;
// // // // //     const now = new Date();
// // // // //     const surveyDate = new Date(timestamp);
// // // // //     const diffHours = Math.abs(now - surveyDate) / 36e5;
// // // // //     return diffHours < 24;
// // // // // };

// // // // // const getBSNLTimestamp = (dateString) => {
// // // // //     const d = dateString ? new Date(dateString) : new Date();
// // // // //     const day = String(d.getDate()).padStart(2, '0');
// // // // //     const month = String(d.getMonth() + 1).padStart(2, '0');
// // // // //     const year = d.getFullYear();
// // // // //     return `${day}${month}${year}`;
// // // // // };

// // // // // // --- COMPONENTS ---
// // // // // const ModalWrapper = ({ children, title, onClose }) => ( 
// // // // //     <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
// // // // //         <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> 
// // // // //             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> 
// // // // //                 <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> 
// // // // //                 <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> 
// // // // //             </div> 
// // // // //             <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> 
// // // // //         </div> 
// // // // //     </div> 
// // // // // );

// // // // // const MapPickHandler = ({ isPicking, onPick }) => { 
// // // // //     useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); 
// // // // //     useEffect(() => { 
// // // // //         const el=document.querySelector('.leaflet-container'); 
// // // // //         if(el) el.style.cursor=isPicking?'crosshair':'grab'; 
// // // // //     }, [isPicking]); 
// // // // //     return null; 
// // // // // };

// // // // // const MapUpdater = ({ center }) => { 
// // // // //     const map = useMap(); 
// // // // //     useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); 
// // // // //     return null; 
// // // // // };

// // // // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // // // //     // 1. STATE DEFINITIONS
// // // // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // // // //     const [selectedBlock, setSelectedBlock] = useState('');
// // // // //     const [selectedSpan, setSelectedSpan] = useState('');
// // // // //     const [selectedRing, setSelectedRing] = useState('');

// // // // //     const [currentPage, setCurrentPage] = useState(1);
// // // // //     const [totalPages, setTotalPages] = useState(1);

// // // // //     const [startPoint, setStartPoint] = useState(null);
// // // // //     const [endPoint, setEndPoint] = useState(null);
// // // // //     const [displayPath, setDisplayPath] = useState([]);
// // // // //     const [isRingView, setIsRingView] = useState(false);
// // // // //     const [diggingPoints, setDiggingPoints] = useState([]);

// // // // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // // // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // // // //     const [userRoutes, setUserRoutes] = useState([]);

// // // // //     const [userStatuses, setUserStatuses] = useState([]);
// // // // //     const [logs, setLogs] = useState([]);

// // // // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // // // //     const [editingSurvey, setEditingSurvey] = useState(null);

// // // // //     // --- NEW STATE FOR VIEW/EDIT MODE ---
// // // // //     const [isViewMode, setIsViewMode] = useState(false);

// // // // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // // // //     const [pickedCoords, setPickedCoords] = useState(null);
// // // // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // // // //     const [showUserStatus, setShowUserStatus] = useState(false);
// // // // //     const [currentMedia, setCurrentMedia] = useState(null);
// // // // //     const [uploadModalId, setUploadModalId] = useState(null);

// // // // //     const [searchDist, setSearchDist] = useState('');
// // // // //     const [searchBlock, setSearchBlock] = useState('');
// // // // //     const [searchGeneric, setSearchGeneric] = useState('');
// // // // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // // // //     const [searchDateTo, setSearchDateTo] = useState('');
// // // // //     const [filterStart, setFilterStart] = useState('');
// // // // //     const [filterEnd, setFilterEnd] = useState('');

// // // // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // // // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // // // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // // // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // // // //     useEffect(() => {
// // // // //         if (!selectedSpan) { 
// // // // //             setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); 
// // // // //             return; 
// // // // //         }
// // // // //         const data = SPAN_COORDS[selectedSpan];
// // // // //         if(data) {
// // // // //             setStartPoint(data.start); 
// // // // //             setEndPoint(data.end);
// // // // //             if (selectedRing) {
// // // // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // // // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // // // //                 setIsRingView(true); 
// // // // //                 setDisplayPath(path); 
// // // // //                 setDiggingPoints(generatePointsOnPath(path, 4));
// // // // //             } else {
// // // // //                 setIsRingView(false); 
// // // // //                 setDisplayPath([data.start, data.end]); 
// // // // //                 setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // // // //             }
// // // // //         }
// // // // //     }, [selectedSpan, selectedRing]);

// // // // //     const applyFilters = useCallback((data) => {
// // // // //         let filtered = data;
// // // // //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// // // // //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// // // // //         if (searchGeneric) {
// // // // //             const term = searchGeneric.toLowerCase();
// // // // //             filtered = filtered.filter(s => 
// // // // //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
// // // // //                 (s.routeName && s.routeName.toLowerCase().includes(term))
// // // // //             );
// // // // //         }
// // // // //         if (searchDateFrom && searchDateTo) {
// // // // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // // // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // // // //             filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
// // // // //         }
// // // // //         setFilteredSurveys(filtered);
// // // // //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// // // // // const refreshData = useCallback(async () => {
// // // // //     try {
// // // // //         const response = await axios.get(`${API_BASE}/surveys/all`, { 
// // // // //             params: { page: currentPage, limit: 10 }
// // // // //         });

// // // // //         const { surveys, pagination } = response.data;

// // // // //         if (Array.isArray(surveys)) {
// // // // //             const mergedData = surveys.map(s => {
// // // // //                 // 1. Get the media array from backend
// // // // //                 const mFiles = s.mediaFiles || [];

// // // // //                 // 2. Helper to create the View URL
// // // // //                 const getProxyUrl = (path) => {
// // // // //                     if (!path) return null;
// // // // //                     return `${API_BASE}/surveys/read-file?path=${encodeURIComponent(path)}&mode=open`;
// // // // //                 };

// // // // //                 // 3. Extract specific files from the array
// // // // //                 const sitePhotoObj = mFiles.find(f => f.type === 'photo');
// // // // //                 const liveVideoObj = mFiles.find(f => f.type === 'video');
// // // // //                 const selfieObj = mFiles.find(f => f.type === 'selfie');
// // // // //                 const goproObj = mFiles.find(f => f.type === 'gopro');

// // // // //                 // 4. Create the object for the Form
// // // // //                 return {
// // // // //                     ...s,
// // // // //                     id: s.id,

// // // // //                     // Map Database Snake_case to CamelCase
// // // // //                     routeName: s.routeName || s.route_name,
// // // // //                     locationType: s.locationType || s.location_type,
// // // // //                     shotNumber: s.shotNumber || s.shot_number,
// // // // //                     ringNumber: s.ringNumber || s.ring_number,
// // // // //                     startLocName: s.startLocName || s.start_location,
// // // // //                     endLocName: s.endLocName || s.end_location,
// // // // //                     surveyorName: s.surveyor_name,
// // // // //                     surveyorMobile: s.surveyor_mobile,
// // // // //                     dateTime: s.survey_date,
// // // // //                     generatedFileName: s.generated_filename || `SURVEY_${s.id}`,

// // // // //                     // Parse Coordinates
// // // // //                     latitude: parseFloat(s.latitude || 0),
// // // // //                     longitude: parseFloat(s.longitude || 0),

// // // // //                     // --- CRITICAL FIX: Assign extracted URLs to these exact names ---
// // // // //                     sitePhoto: sitePhotoObj ? getProxyUrl(sitePhotoObj.url) : null,
// // // // //                     liveVideo: liveVideoObj ? getProxyUrl(liveVideoObj.url) : null,
// // // // //                     selfie: selfieObj ? getProxyUrl(selfieObj.url) : null,
// // // // //                     goproVideo: goproObj ? getProxyUrl(goproObj.url) : null,

// // // // //                     // Keep original array
// // // // //                     mediaFiles: mFiles
// // // // //                 };
// // // // //             });

// // // // //             console.log("Processed Data:", mergedData); // CHECK THIS IN CONSOLE

// // // // //             const sorted = mergedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
// // // // //             setSubmittedSurveys(sorted);
// // // // //             applyFilters(sorted);

// // // // //             if (pagination) setTotalPages(pagination.totalPages);

// // // // //             // Map Lines
// // // // //             const lines = [];
// // // // //             sorted.forEach(s => {
// // // // //                 if (['HDD Start Point', 'HDD End Point'].includes(s.locationType)) {
// // // // //                     const lat = parseFloat(s.latitude);
// // // // //                     const lng = parseFloat(s.longitude);
// // // // //                     if (lat && lng) {
// // // // //                          lines.push({ start: {lat, lng}, end: {lat: lat+0.0001, lng: lng+0.0001}, name: s.routeName });
// // // // //                     }
// // // // //                 }
// // // // //             });
// // // // //             setUserRoutes(lines);
// // // // //         }
// // // // //     } catch(e) { console.error("Fetch Error", e); }
// // // // // }, [applyFilters, currentPage]);
// // // // //     useEffect(() => {
// // // // //         refreshData(); 
// // // // //         if (role === 'admin') {
// // // // //             setUserStatuses([{ username: 'admin', status: 'Online', loginTime: new Date().toISOString() }]);
// // // // //             setLogs([{ displayTime: new Date().toLocaleString(), username: 'admin', action: 'LOGIN', details: 'System Access' }]);
// // // // //         }
// // // // //     }, [refreshData, role]);

// // // // //     // const handleSurveySubmit = async (formData) => {
// // // // //     //     if (!formData || !formData.district) {
// // // // //     //         alert("District is required");
// // // // //     //         return;
// // // // //     //     }

// // // // //     //     try {
// // // // //     //         const apiData = new FormData();

// // // // //     //         const append = (key, value) => {
// // // // //     //             if (value !== null && value !== undefined && value !== '') {
// // // // //     //                 apiData.append(key, value);
// // // // //     //             }
// // // // //     //         };

// // // // //     //         append('district', formData.district);
// // // // //     //         append('block', formData.block);
// // // // //     //         append('routeName', formData.routeName);
// // // // //     //         append('locationType', formData.locationType);
// // // // //     //         append('shotNumber', formData.shotNumber || '0'); 
// // // // //     //         append('ringNumber', formData.ringNumber || '0');
// // // // //     //         append('startLocName', formData.startLocName);
// // // // //     //         append('endLocName', formData.endLocName);

// // // // //     //         let finalFileName = formData.generatedFileName;
// // // // //     //         if (!finalFileName && formData.district) {
// // // // //     //              const d = (formData.district || 'UNK').substring(0,3).toUpperCase();
// // // // //     //              const b = (formData.block || 'UNK').substring(0,3).toUpperCase();
// // // // //     //              const t = TYPE_CODES[formData.locationType] || 'OTH';
// // // // //     //              const s = (formData.shotNumber || '1').toString().padStart(2, '0');
// // // // //     //              finalFileName = `${d}_${b}_${t}_SHOT${s}`;
// // // // //     //         }
// // // // //     //         append('fileNamePrefix', finalFileName); 

// // // // //     //         const userName = (typeof user === 'object' && user.username) ? user.username : user;
// // // // //     //         const submittedBy = userName || 'admin';

// // // // //     //         append('surveyorName', formData.surveyorName || submittedBy);
// // // // //     //         append('surveyorMobile', formData.surveyorMobile);
// // // // //     //         append('submittedBy', submittedBy);
// // // // //     //         append('dateTime', formData.dateTime || new Date().toISOString());
// // // // //     //         append('remarks', formData.remarks || '');
// // // // //     //         append('latitude', formData.latitude);
// // // // //     //         append('longitude', formData.longitude);

// // // // //     //         if (formData.sitePhotoBlob instanceof Blob) {
// // // // //     //             apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');
// // // // //     //         }

// // // // //     //         if (formData.liveVideoBlob instanceof Blob) {
// // // // //     //             const ext = formData.liveVideoBlob.type.includes('mp4') ? 'mp4' : 'webm';
// // // // //     //             apiData.append('videos', formData.liveVideoBlob, `live_video.${ext}`);
// // // // //     //         }

// // // // //     //         if (formData.goproBlob instanceof Blob || formData.goproBlob instanceof File) {
// // // // //     //             apiData.append('videos', formData.goproBlob, 'gopro_video.mp4');
// // // // //     //         }

// // // // //     //         if (formData.selfieBlob instanceof Blob) {
// // // // //     //             apiData.append('selfie', formData.selfieBlob, 'selfie.jpg');
// // // // //     //         }

// // // // //     //         const config = { headers: { 'Content-Type': 'multipart/form-data' } };
// // // // //     //         let response;

// // // // //     //         if (editingSurvey && editingSurvey.id) {
// // // // //     //             // EDIT
// // // // //     //             response = await axios.put(`${API_BASE}/surveys/${editingSurvey.id}`, apiData, config);
// // // // //     //         } else {
// // // // //     //             // CREATE
// // // // //     //             response = await axios.post(`${API_BASE}/surveys`, apiData, config);
// // // // //     //         }

// // // // //     //         if (response.data.success) {
// // // // //     //             alert("Saved Successfully!");
// // // // //     //             setShowSurveyForm(false);
// // // // //     //             setEditingSurvey(null);
// // // // //     //             refreshData(); 
// // // // //     //         }

// // // // //     //     } catch (e) {
// // // // //     //         console.error("FULL ERROR:", e);
// // // // //     //         const serverMessage = e.response?.data?.message || e.response?.statusText || "Server Error";
// // // // //     //         alert(`Failed to save: ${serverMessage}`);
// // // // //     //     }
// // // // //     // };
// // // // // // In Dashboard.js

// // // // // const handleSurveySubmit = async (formData) => {
// // // // //     if (!formData || !formData.district) {
// // // // //         alert("District is required");
// // // // //         return;
// // // // //     }

// // // // //     try {
// // // // //         const apiData = new FormData();

// // // // //         // Helper to append data
// // // // //         const append = (key, value) => {
// // // // //             if (value !== null && value !== undefined && value !== '') {
// // // // //                 apiData.append(key, value);
// // // // //             }
// // // // //         };

// // // // //         // Append all text fields
// // // // //         append('district', formData.district);
// // // // //         append('block', formData.block);
// // // // //         append('routeName', formData.routeName);
// // // // //         append('locationType', formData.locationType);
// // // // //         append('shotNumber', formData.shotNumber || '0'); 
// // // // //         append('ringNumber', formData.ringNumber || '0');
// // // // //         append('startLocName', formData.startLocName);
// // // // //         append('endLocName', formData.endLocName);
// // // // //         append('fileNamePrefix', formData.generatedFileName); 
// // // // //         append('surveyorName', formData.surveyorName);
// // // // //         append('surveyorMobile', formData.surveyorMobile);
// // // // //         append('submittedBy', user.username || user || 'admin');
// // // // //         append('dateTime', formData.dateTime || new Date().toISOString());
// // // // //         append('latitude', formData.latitude);
// // // // //         append('longitude', formData.longitude);

// // // // //         // Append Files (Only if they are new Blobs/Files)
// // // // //         if (formData.sitePhotoBlob instanceof Blob) apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');
// // // // //         if (formData.liveVideoBlob instanceof Blob) apiData.append('videos', formData.liveVideoBlob, 'live_video.mp4');
// // // // //         if (formData.goproBlob instanceof Blob || formData.goproBlob instanceof File) apiData.append('videos', formData.goproBlob, 'gopro_video.mp4');
// // // // //         if (formData.selfieBlob instanceof Blob) apiData.append('selfie', formData.selfieBlob, 'selfie.jpg');

// // // // //         const config = { headers: { 'Content-Type': 'multipart/form-data' } };
// // // // //         let response;

// // // // //         // --- THE FIX IS HERE ---
// // // // //         // We check if formData has an ID. If yes, it's an UPDATE.
// // // // //         if (formData.id) {
// // // // //             console.log("📝 Updating Survey ID:", formData.id);
// // // // //             response = await axios.put(`${API_BASE}/surveys/${formData.id}`, apiData, config);
// // // // //         } else {
// // // // //             console.log("✨ Creating New Survey");
// // // // //             response = await axios.post(`${API_BASE}/surveys`, apiData, config);
// // // // //         }

// // // // //         if (response.data.success) {
// // // // //             alert("Saved Successfully!");
// // // // //             setShowSurveyForm(false);
// // // // //             setEditingSurvey(null);
// // // // //             refreshData(); // Refresh list to see changes
// // // // //         }

// // // // //     } catch (e) {
// // // // //         console.error("FULL ERROR:", e);
// // // // //         const serverMessage = e.response?.data?.message || e.response?.statusText || "Server Error";
// // // // //         alert(`Failed to save: ${serverMessage}`);
// // // // //     }
// // // // // };
// // // // //     const handleDeleteSurvey = async (id) => {
// // // // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // // // //             try {
// // // // //                 await axios.delete(`${API_BASE}/surveys/${id}/cancel`); 
// // // // //                 if (typeof logAction === 'function') logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // // // //                 refreshData();
// // // // //             } catch (e) { console.error(e); alert("Failed to delete."); }
// // // // //         }
// // // // //     };

// // // // //     const fetchBackendFile = async (path, mode = 'open') => {
// // // // //         try {
// // // // //             const response = await axios.get(`${API_BASE}/surveys/read-file?path=${encodeURIComponent(path)}&mode=${mode}`, { responseType: 'blob' });
// // // // //             return response.data; 
// // // // //         } catch (error) { console.error("File Fetch Error:", error); return null; }
// // // // //     };

// // // // //     const handleViewMedia = async (type, survey) => {
// // // // //         if (!survey.mediaFiles || survey.mediaFiles.length === 0) { alert("No media found on server."); return; }
// // // // //         const targetType = (type === 'gopro' || type === 'video') ? 'video' : 'photo';
// // // // //         const fileObj = survey.mediaFiles.find(m => m.type === targetType);
// // // // //         if (fileObj && fileObj.url) {
// // // // //             const blob = await fetchBackendFile(fileObj.url, 'open');
// // // // //             if (blob) {
// // // // //                 const objectUrl = URL.createObjectURL(blob);
// // // // //                 setCurrentMedia({ type, url: objectUrl, blob: blob, filename: `file.${targetType === 'video'?'mp4':'jpg'}`, meta: survey });
// // // // //             } else { alert("Failed to load file."); }
// // // // //         } else { alert(`No ${type} found for this survey.`); }
// // // // //     };

// // // // //     const handleGoProUpload = async (e) => {
// // // // //         const file = e.target.files[0];
// // // // //         if (!file || !uploadModalId) return;
// // // // //         const formData = new FormData();
// // // // //         formData.append('videos', file); 
// // // // //         try {
// // // // //             await axios.put(`${API_BASE}/surveys/${uploadModalId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
// // // // //             alert("GoPro Uploaded Successfully!");
// // // // //             setUploadModalId(null);
// // // // //             refreshData(); 
// // // // //         } catch (error) { console.error("Upload failed", error); alert("Upload Failed"); }
// // // // //     };

// // // // //     const getDetailedFilename = () => {
// // // // //         if (!currentMedia || !currentMedia.meta) return 'BSNL_Download';
// // // // //         const { district, block, locationType, shotNumber, dateTime } = currentMedia.meta;
// // // // //         const d = (district || 'UNK').substring(0, 3).toUpperCase();
// // // // //         const b = (block || 'UNK').substring(0, 3).toUpperCase();
// // // // //         const t = TYPE_CODES[locationType] || "OTH";
// // // // //         const date = getBSNLTimestamp(dateTime);
// // // // //         return `${d}_${b}_${t}_SHOTNO${shotNumber || '1'}_${date}`;
// // // // //     };

// // // // //     const handleDirectDownload = () => {
// // // // //         if (!currentMedia || !currentMedia.blob) return;
// // // // //         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
// // // // //         const finalName = `${getDetailedFilename()}.${ext}`;
// // // // //         saveAs(currentMedia.blob, finalName);
// // // // //     };

// // // // //     const handleDownloadZip = async () => {
// // // // //         if (!currentMedia || !currentMedia.blob) return;
// // // // //         const zip = new JSZip();
// // // // //         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
// // // // //         const finalName = getDetailedFilename();
// // // // //         zip.file(`${finalName}.${ext}`, currentMedia.blob);
// // // // //         const metaInfo = `Filename: ${finalName}\nSurveyor: ${currentMedia.meta.surveyorName}`;
// // // // //         zip.file("details.txt", metaInfo);
// // // // //         const content = await zip.generateAsync({type:"blob"});
// // // // //         saveAs(content, `${finalName}.zip`);
// // // // //     };

// // // // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // // // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
// // // // //     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime()+86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

// // // // //     const styles = {
// // // // //         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
// // // // //         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
// // // // //         controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // // // //         headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // // // //         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // // // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
// // // // //         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // // //         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // // //         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // // // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // // // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // // // //         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // // // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // // // //         downloadBtn: { flex:1, padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', textAlign:'center', textDecoration:'none', fontSize:'14px' },
// // // // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// // // // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// // // // //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' },
// // // // //         adminCard: { background:'#fff', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.05)' },
// // // // //         adminHeader: { background:'#f5f5f5', padding:'10px 15px', borderBottom:'1px solid #ddd', fontWeight:'bold', color:'#333' }
// // // // //     };

// // // // //     return (
// // // // //         <div style={styles.container}>
// // // // //             <div style={styles.header}>
// // // // //                 <div style={styles.headerLeft}>
// // // // //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// // // // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
// // // // //                     <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // //                     <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // //                     <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // // // //                     <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // // // //                 </div>
// // // // //                 <div style={styles.controls}>
// // // // //                     {/* NEW BUTTON: Mode is Edit (false), but Survey is null (new) */}
// // // // //                     <button onClick={() => { setEditingSurvey(null); setIsViewMode(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
// // // // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
// // // // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// // // // //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// // // // //                 </div>
// // // // //             </div>

// // // // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// // // // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // // // //                 <LayersControl position="topright">
// // // // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // // // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // // // //                 </LayersControl>
// // // // //                 {startPoint && <MapUpdater center={startPoint} />}
// // // // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // // // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // // // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // // // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // // // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
// // // // //                 {submittedSurveys.map(s => s.latitude && (
// // // // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // // // //                         <Popup minWidth={250}>
// // // // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // // // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
// // // // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // // // //                                 <div><b>Route:</b> {s.routeName}</div>
// // // // //                                 <div style={{marginTop:'10px'}}>
// // // // //                                     {s.mediaFiles?.some(m => m.type === 'video') && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
// // // // //                                     {s.mediaFiles?.some(m => m.type === 'photo') && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // // // //                                 </div>
// // // // //                             </div>
// // // // //                         </Popup>
// // // // //                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
// // // // //                             <div style={{textAlign:'left', minWidth: '150px'}}>
// // // // //                                 {isRecent(s.survey_date) && <div style={{background:'#e65100', color:'white', fontSize:'10px', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginBottom:'5px', fontWeight:'bold'}}>RECENT</div>}
// // // // //                                 <div style={{fontWeight:'bold', fontSize:'13px', color: '#1a237e'}}>{s.locationType}</div>
// // // // //                                 <div style={{fontSize:'12px', fontWeight:'bold', color:'#007bff', margin: '2px 0'}}>{s.generatedFileName || "No Filename"}</div>
// // // // //                                 <div style={{fontSize:'11px', color:'#333'}}>Route: {s.routeName}</div>
// // // // //                                 <div style={{fontSize:'11px', color:'#555'}}>Date: {getBSNLTimestamp(s.survey_date)}</div>
// // // // //                                 <div style={{marginTop:'6px', paddingTop:'4px', borderTop:'1px solid #eee', display:'flex', gap:'8px', fontSize:'11px', fontWeight:'bold'}}>
// // // // //                                     {s.mediaFiles?.some(m => m.type === 'photo') && <span style={{color:'#2e7d32'}}>[Photo]</span>}
// // // // //                                     {s.mediaFiles?.some(m => m.type === 'video') && <span style={{color:'#d32f2f'}}>[Video]</span>}
// // // // //                                     {s.mediaFiles?.some(m => m.type === 'selfie') && <span style={{color:'#f57c00'}}>[Selfie]</span>}
// // // // //                                 </div>
// // // // //                             </div>
// // // // //                         </Tooltip>
// // // // //                     </Marker>
// // // // //                 ))}
// // // // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // // // //             </MapContainer>

// // // // //             {showSurveyForm && (
// // // // //                 <SurveyForm 
// // // // //                     onClose={() => { setShowSurveyForm(false); refreshData(); }} 
// // // // //                     pickedCoords={pickedCoords} 
// // // // //                      districts={DATA_HIERARCHY.districts} 
// // // // //                      blocks={Object.values(DATA_HIERARCHY.blocks)} 
// // // // //                      onSubmitData={handleSurveySubmit} 
// // // // //                     user={user} 
// // // // //                      onPickLocation={handlePickLocationStart} 
// // // // //                     initialData={editingSurvey} 
// // // // //                     // PASS VIEW ONLY MODE PROP
// // // // //                     viewOnly={isViewMode}
// // // // //                 />
// // // // //             )}

// // // // //             {showSurveyTable && (
// // // // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // // // //                     <div style={styles.filterBox}>
// // // // //                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
// // // // //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // // //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// // // // //                     </div>
// // // // //                     <table style={styles.table}>
// // // // //                         <thead><tr style={{textAlign:'left', background:'#f9f9f9'}}><th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead>
// // // // //                         <tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}><td style={styles.td}><b>{s.generatedFileName}</b></td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>
// // // // //                             {s.mediaFiles?.some(m => m.type === 'video') && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s)}>Live Vid</button>}
// // // // //                             {s.mediaFiles?.some(m => m.type === 'photo') && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // // // //                         </td><td style={styles.td}>

// // // // //                             {/* --- UPDATED VIEW BUTTON --- */}
// // // // //                             <button style={{...styles.actionBtn, background:'#eee', color:'#333'}} 
// // // // //                                 onClick={()=>{ 
// // // // //                                     setEditingSurvey(s); 
// // // // //                                     setIsViewMode(true); // SET VIEW MODE
// // // // //                                     setShowSurveyTable(false); 
// // // // //                                     setShowSurveyForm(true); 
// // // // //                                 }}>
// // // // //                                 View
// // // // //                             </button>

// // // // //                             {/* --- UPDATED EDIT BUTTON --- */}
// // // // //                             {(role === 'admin' || s.submittedBy === user) && 
// // // // //                                 <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} 
// // // // //                                     onClick={()=>{ 
// // // // //                                         setEditingSurvey(s); 
// // // // //                                         setIsViewMode(false); // SET EDIT MODE
// // // // //                                         setShowSurveyTable(false); 
// // // // //                                         setShowSurveyForm(true); 
// // // // //                                     }}>
// // // // //                                     Edit
// // // // //                                 </button>
// // // // //                             }

// // // // //                             {role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}

// // // // //                         </td></tr>))}</tbody>
// // // // //                     </table>
// // // // //                     <div style={{display:'flex', justifyContent:'flex-end', gap:'10px', padding:'15px', alignItems:'center', borderTop:'1px solid #eee'}}>
// // // // //                         <button style={styles.btnWhite} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt; Prev</button>
// // // // //                         <span style={{fontSize:'13px', fontWeight:'bold'}}>Page {currentPage} of {totalPages}</span>
// // // // //                         <button style={styles.btnWhite} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next &gt;</button>
// // // // //                     </div>
// // // // //                 </ModalWrapper>
// // // // //             )}

// // // // //             {showUserStatus && role === 'admin' && (
// // // // //                 <ModalWrapper title="Admin Logs & User Status" onClose={() => setShowUserStatus(false)}>
// // // // //                     <div style={{display:'flex', gap:'20px', height:'100%', flexDirection:'row'}}>
// // // // //                         <div style={{flex:1, minWidth:'300px'}}>
// // // // //                             <div style={styles.adminCard}>
// // // // //                                 <div style={styles.adminHeader}>Live User Status</div>
// // // // //                                 <table style={styles.table}>
// // // // //                                     <thead><tr style={{background:'#f9f9f9'}}><th style={{padding:'10px'}}>User</th><th>Status</th><th>Time</th></tr></thead>
// // // // //                                     <tbody>{userStatuses.map((u, i) => (<tr key={i} style={{borderBottom:'1px solid #eee'}}><td style={{padding:'10px', fontWeight:'bold'}}>{u.username}</td><td><span style={{...styles.statusDot, background: u.status==='Online'?'#4caf50':'#9e9e9e'}}></span>{u.status}</td><td style={{fontSize:'12px', color:'#666'}}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td></tr>))}</tbody>
// // // // //                                 </table>
// // // // //                             </div>
// // // // //                         </div>
// // // // //                         <div style={{flex:2}}>
// // // // //                             <div style={styles.adminCard}>
// // // // //                                 <div style={{...styles.adminHeader, display:'flex', justifyContent:'space-between', alignItems:'center'}}><span>System Logs</span><div style={{fontSize:'12px', fontWeight:'normal'}}>Filter: <input type="date" onChange={e => setFilterStart(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/> to <input type="date" onChange={e => setFilterEnd(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/></div></div>
// // // // //                                 <div style={{maxHeight:'400px', overflowY:'auto'}}>
// // // // //                                     <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
// // // // //                                         <thead style={{position:'sticky', top:0, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,0.1)'}}><tr><th style={{padding:'10px', textAlign:'left'}}>Time</th><th style={{textAlign:'left'}}>User</th><th style={{textAlign:'left'}}>Action</th><th style={{textAlign:'left'}}>Details</th></tr></thead>
// // // // //                                         <tbody>{getFilteredLogs().map((l,i) => (<tr key={i} style={{borderBottom:'1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa'}}><td style={{padding:'8px', color:'#666', whiteSpace:'nowrap'}}>{l.displayTime}</td><td style={{fontWeight:'bold', color:'#333'}}>{l.username}</td><td style={{color: l.action.includes('DELETED')?'red':'#1565c0'}}>{l.action}</td><td style={{color:'#555'}}>{l.details}</td></tr>))}</tbody>
// // // // //                                     </table>
// // // // //                                 </div>
// // // // //                             </div>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </ModalWrapper>
// // // // //             )}

// // // // //             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}

// // // // //             {currentMedia && (
// // // // //                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
// // // // //                     <div style={{textAlign:'center', background:'black', padding:'15px', borderRadius:'8px'}}>
// // // // //                         {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (<video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />) : (<img src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />)}
// // // // //                         <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
// // // // //                             <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}</button>
// // // // //                             <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>Download ZIP</button>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </ModalWrapper>
// // // // //             )}

// // // // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>PICKING MODE ACTIVE - Click map</div>}
// // // // //         </div>
// // // // //     );
// // // // // };

// // // // // export default Dashboard;



// // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// // // // import 'leaflet/dist/leaflet.css';
// // // // import L from 'leaflet';
// // // // import SurveyForm from './SurveyForm';
// // // // import JSZip from 'jszip';
// // // // import { saveAs } from 'file-saver';
// // // // import axios from 'axios';

// // // // // --- ICONS ---
// // // // const DefaultIcon = L.icon({ 
// // // //     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", 
// // // //     shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", 
// // // //     iconSize: [25, 41], 
// // // //     iconAnchor: [12, 41], 
// // // //     popupAnchor: [1, -34] 
// // // // });
// // // // L.Marker.prototype.options.icon = DefaultIcon;

// // // // const SurveyIcon = L.divIcon({ 
// // // //     className: 'custom-survey-icon', 
// // // //     html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', 
// // // //     iconSize: [16, 16] 
// // // // });

// // // // // --- CONSTANTS ---
// // // // const DATA_HIERARCHY = { 
// // // //     districts: ['VARANASI', 'Hyderabad'], 
// // // //     blocks: { 
// // // //         'Hyderabad': ['Central', 'North'], 
// // // //         'VARANASI': ['Badagon', 'City'] 
// // // //     }, 
// // // //     spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, 
// // // //     rings: { 'Span-Uppal': ['Ring-01'] } 
// // // // };

// // // // const SPAN_COORDS = { 
// // // //     'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 
// // // //     'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } 
// // // // };

// // // // const TYPE_CODES = {
// // // //     "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
// // // //     "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
// // // //     "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// // // // };

// // // // // --- CRITICAL FIX: CHANGED FROM LOCALHOST TO RENDER ---
// // // // const API_BASE = 'https://gis-backend-9ajk.onrender.com';

// // // // // --- HELPER FUNCTIONS ---
// // // // const getRingPath = (start, end, offsetFactor) => { 
// // // //     const midLat = (start.lat + end.lat) / 2; 
// // // //     const midLng = (start.lng + end.lng) / 2; 
// // // //     return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; 
// // // // };

// // // // const generatePointsOnPath = (path, count) => { 
// // // //     const points = []; 
// // // //     for (let i = 1; i <= count; i++) { 
// // // //         const ratio = i / (count + 1); 
// // // //         points.push({ 
// // // //             lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, 
// // // //             lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, 
// // // //             id: `SP-${i}` 
// // // //         }); 
// // // //     } 
// // // //     return points; 
// // // // };

// // // // const getSessionDuration = (str) => { 
// // // //     if (!str) return '-'; 
// // // //     const diff = new Date() - new Date(str); 
// // // //     return `${Math.floor(diff/60000)} mins`; 
// // // // };

// // // // const isRecent = (timestamp) => {
// // // //     if (!timestamp) return false;
// // // //     const now = new Date();
// // // //     const surveyDate = new Date(timestamp);
// // // //     const diffHours = Math.abs(now - surveyDate) / 36e5;
// // // //     return diffHours < 24;
// // // // };

// // // // const getBSNLTimestamp = (dateString) => {
// // // //     const d = dateString ? new Date(dateString) : new Date();
// // // //     const day = String(d.getDate()).padStart(2, '0');
// // // //     const month = String(d.getMonth() + 1).padStart(2, '0');
// // // //     const year = d.getFullYear();
// // // //     return `${day}${month}${year}`;
// // // // };

// // // // // --- COMPONENTS ---
// // // // const ModalWrapper = ({ children, title, onClose }) => ( 
// // // //     <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
// // // //         <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> 
// // // //             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> 
// // // //                 <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> 
// // // //                 <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> 
// // // //             </div> 
// // // //             <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> 
// // // //         </div> 
// // // //     </div> 
// // // // );

// // // // const MapPickHandler = ({ isPicking, onPick }) => { 
// // // //     useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); 
// // // //     useEffect(() => { 
// // // //         const el=document.querySelector('.leaflet-container'); 
// // // //         if(el) el.style.cursor=isPicking?'crosshair':'grab'; 
// // // //     }, [isPicking]); 
// // // //     return null; 
// // // // };

// // // // const MapUpdater = ({ center }) => { 
// // // //     const map = useMap(); 
// // // //     useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); 
// // // //     return null; 
// // // // };

// // // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // // //     // 1. STATE DEFINITIONS
// // // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // // //     const [selectedBlock, setSelectedBlock] = useState('');
// // // //     const [selectedSpan, setSelectedSpan] = useState('');
// // // //     const [selectedRing, setSelectedRing] = useState('');

// // // //     const [currentPage, setCurrentPage] = useState(1);
// // // //     const [totalPages, setTotalPages] = useState(1);

// // // //     const [startPoint, setStartPoint] = useState(null);
// // // //     const [endPoint, setEndPoint] = useState(null);
// // // //     const [displayPath, setDisplayPath] = useState([]);
// // // //     const [isRingView, setIsRingView] = useState(false);
// // // //     const [diggingPoints, setDiggingPoints] = useState([]);

// // // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // // //     const [userRoutes, setUserRoutes] = useState([]);

// // // //     const [userStatuses, setUserStatuses] = useState([]);
// // // //     const [logs, setLogs] = useState([]);

// // // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // // //     const [editingSurvey, setEditingSurvey] = useState(null);

// // // //     // --- NEW STATE FOR VIEW/EDIT MODE ---
// // // //     const [isViewMode, setIsViewMode] = useState(false);

// // // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // // //     const [pickedCoords, setPickedCoords] = useState(null);
// // // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // // //     const [showUserStatus, setShowUserStatus] = useState(false);
// // // //     const [currentMedia, setCurrentMedia] = useState(null);
// // // //     const [uploadModalId, setUploadModalId] = useState(null);

// // // //     const [searchDist, setSearchDist] = useState('');
// // // //     const [searchBlock, setSearchBlock] = useState('');
// // // //     const [searchGeneric, setSearchGeneric] = useState('');
// // // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // // //     const [searchDateTo, setSearchDateTo] = useState('');
// // // //     const [filterStart, setFilterStart] = useState('');
// // // //     const [filterEnd, setFilterEnd] = useState('');

// // // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // // //     useEffect(() => {
// // // //         if (!selectedSpan) { 
// // // //             setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); 
// // // //             return; 
// // // //         }
// // // //         const data = SPAN_COORDS[selectedSpan];
// // // //         if(data) {
// // // //             setStartPoint(data.start); 
// // // //             setEndPoint(data.end);
// // // //             if (selectedRing) {
// // // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // // //                 setIsRingView(true); 
// // // //                 setDisplayPath(path); 
// // // //                 setDiggingPoints(generatePointsOnPath(path, 4));
// // // //             } else {
// // // //                 setIsRingView(false); 
// // // //                 setDisplayPath([data.start, data.end]); 
// // // //                 setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // // //             }
// // // //         }
// // // //     }, [selectedSpan, selectedRing]);

// // // //     const applyFilters = useCallback((data) => {
// // // //         let filtered = data;
// // // //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// // // //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// // // //         if (searchGeneric) {
// // // //             const term = searchGeneric.toLowerCase();
// // // //             filtered = filtered.filter(s => 
// // // //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
// // // //                 (s.routeName && s.routeName.toLowerCase().includes(term))
// // // //             );
// // // //         }
// // // //         if (searchDateFrom && searchDateTo) {
// // // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // // //             filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
// // // //         }
// // // //         setFilteredSurveys(filtered);
// // // //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// // // //     const refreshData = useCallback(async () => {
// // // //         try {
// // // //             const response = await axios.get(`${API_BASE}/surveys/all`, { 
// // // //                 params: { page: currentPage, limit: 10 }
// // // //             });

// // // //             const { surveys, pagination } = response.data;

// // // //             if (Array.isArray(surveys)) {
// // // //                 const mergedData = surveys.map(s => {
// // // //                     const mFiles = s.mediaFiles || [];
// // // //                     const getProxyUrl = (path) => {
// // // //                         if (!path) return null;
// // // //                         return `${API_BASE}/surveys/read-file?path=${encodeURIComponent(path)}&mode=open`;
// // // //                     };

// // // //                     const sitePhotoObj = mFiles.find(f => f.type === 'photo');
// // // //                     const liveVideoObj = mFiles.find(f => f.type === 'video');
// // // //                     const selfieObj = mFiles.find(f => f.type === 'selfie');
// // // //                     const goproObj = mFiles.find(f => f.type === 'gopro');

// // // //                     return {
// // // //                         ...s,
// // // //                         id: s.id,
// // // //                         routeName: s.routeName || s.route_name,
// // // //                         locationType: s.locationType || s.location_type,
// // // //                         shotNumber: s.shotNumber || s.shot_number,
// // // //                         ringNumber: s.ringNumber || s.ring_number,
// // // //                         startLocName: s.startLocName || s.start_location,
// // // //                         endLocName: s.endLocName || s.end_location,
// // // //                         surveyorName: s.surveyor_name,
// // // //                         surveyorMobile: s.surveyor_mobile,
// // // //                         dateTime: s.survey_date,
// // // //                         generatedFileName: s.generated_filename || `SURVEY_${s.id}`,
// // // //                         latitude: parseFloat(s.latitude || 0),
// // // //                         longitude: parseFloat(s.longitude || 0),
// // // //                         sitePhoto: sitePhotoObj ? getProxyUrl(sitePhotoObj.url) : null,
// // // //                         liveVideo: liveVideoObj ? getProxyUrl(liveVideoObj.url) : null,
// // // //                         selfie: selfieObj ? getProxyUrl(selfieObj.url) : null,
// // // //                         goproVideo: goproObj ? getProxyUrl(goproObj.url) : null,
// // // //                         mediaFiles: mFiles
// // // //                     };
// // // //                 });

// // // //                 const sorted = mergedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
// // // //                 setSubmittedSurveys(sorted);
// // // //                 applyFilters(sorted);

// // // //                 if (pagination) setTotalPages(pagination.totalPages);

// // // //                 const lines = [];
// // // //                 sorted.forEach(s => {
// // // //                     if (['HDD Start Point', 'HDD End Point'].includes(s.locationType)) {
// // // //                         const lat = parseFloat(s.latitude);
// // // //                         const lng = parseFloat(s.longitude);
// // // //                         if (lat && lng) {
// // // //                              lines.push({ start: {lat, lng}, end: {lat: lat+0.0001, lng: lng+0.0001}, name: s.routeName });
// // // //                         }
// // // //                     }
// // // //                 });
// // // //                 setUserRoutes(lines);
// // // //             }
// // // //         } catch(e) { console.error("Fetch Error", e); }
// // // //     }, [applyFilters, currentPage]);

// // // //     useEffect(() => {
// // // //         refreshData(); 
// // // //         if (role === 'admin') {
// // // //             setUserStatuses([{ username: 'admin', status: 'Online', loginTime: new Date().toISOString() }]);
// // // //             setLogs([{ displayTime: new Date().toLocaleString(), username: 'admin', action: 'LOGIN', details: 'System Access' }]);
// // // //         }
// // // //     }, [refreshData, role]);

// // // //     const handleSurveySubmit = async (formData) => {
// // // //         if (!formData || !formData.district) {
// // // //             alert("District is required");
// // // //             return;
// // // //         }

// // // //         try {
// // // //             const apiData = new FormData();
// // // //             const append = (key, value) => {
// // // //                 if (value !== null && value !== undefined && value !== '') {
// // // //                     apiData.append(key, value);
// // // //                 }
// // // //             };

// // // //             append('district', formData.district);
// // // //             append('block', formData.block);
// // // //             append('routeName', formData.routeName);
// // // //             append('locationType', formData.locationType);
// // // //             append('shotNumber', formData.shotNumber || '0'); 
// // // //             append('ringNumber', formData.ringNumber || '0');
// // // //             append('startLocName', formData.startLocName);
// // // //             append('endLocName', formData.endLocName);
// // // //             append('fileNamePrefix', formData.generatedFileName); 
// // // //             append('surveyorName', formData.surveyorName);
// // // //             append('surveyorMobile', formData.surveyorMobile);
// // // //             append('submittedBy', user.username || user || 'admin');
// // // //             append('dateTime', formData.dateTime || new Date().toISOString());
// // // //             append('latitude', formData.latitude);
// // // //             append('longitude', formData.longitude);
// // // //             append('remarks', formData.remarks || '');

// // // //             if (formData.sitePhotoBlob instanceof Blob) apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');
// // // //             if (formData.liveVideoBlob instanceof Blob) apiData.append('videos', formData.liveVideoBlob, 'live_video.mp4');
// // // //             if (formData.goproBlob instanceof Blob || formData.goproBlob instanceof File) apiData.append('videos', formData.goproBlob, 'gopro_video.mp4');
// // // //             if (formData.selfieBlob instanceof Blob) apiData.append('selfie', formData.selfieBlob, 'selfie.jpg');

// // // //             const config = { headers: { 'Content-Type': 'multipart/form-data' } };
// // // //             let response;

// // // //             if (formData.id) {
// // // //                 console.log("📝 Updating Survey ID:", formData.id);
// // // //                 response = await axios.put(`${API_BASE}/surveys/${formData.id}`, apiData, config);
// // // //             } else {
// // // //                 console.log("✨ Creating New Survey");
// // // //                 response = await axios.post(`${API_BASE}/surveys`, apiData, config);
// // // //             }

// // // //             if (response.data.success) {
// // // //                 alert("Saved Successfully!");
// // // //                 setShowSurveyForm(false);
// // // //                 setEditingSurvey(null);
// // // //                 refreshData(); 
// // // //             }

// // // //         } catch (e) {
// // // //             console.error("FULL ERROR:", e);
// // // //             const serverMessage = e.response?.data?.message || e.response?.statusText || "Server Error";
// // // //             alert(`Failed to save: ${serverMessage}`);
// // // //         }
// // // //     };

// // // //     const handleDeleteSurvey = async (id) => {
// // // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // // //             try {
// // // //                 await axios.delete(`${API_BASE}/surveys/${id}/cancel`); 
// // // //                 if (typeof logAction === 'function') logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // // //                 refreshData();
// // // //             } catch (e) { console.error(e); alert("Failed to delete."); }
// // // //         }
// // // //     };

// // // //     const fetchBackendFile = async (path, mode = 'open') => {
// // // //         try {
// // // //             const response = await axios.get(`${API_BASE}/surveys/read-file?path=${encodeURIComponent(path)}&mode=${mode}`, { responseType: 'blob' });
// // // //             return response.data; 
// // // //         } catch (error) { console.error("File Fetch Error:", error); return null; }
// // // //     };

// // // //     const handleViewMedia = async (type, survey) => {
// // // //         if (!survey.mediaFiles || survey.mediaFiles.length === 0) { alert("No media found on server."); return; }
// // // //         const targetType = (type === 'gopro' || type === 'video') ? 'video' : 'photo';
// // // //         const fileObj = survey.mediaFiles.find(m => m.type === targetType);
// // // //         if (fileObj && fileObj.url) {
// // // //             const blob = await fetchBackendFile(fileObj.url, 'open');
// // // //             if (blob) {
// // // //                 const objectUrl = URL.createObjectURL(blob);
// // // //                 setCurrentMedia({ type, url: objectUrl, blob: blob, filename: `file.${targetType === 'video'?'mp4':'jpg'}`, meta: survey });
// // // //             } else { alert("Failed to load file."); }
// // // //         } else { alert(`No ${type} found for this survey.`); }
// // // //     };

// // // //     const handleGoProUpload = async (e) => {
// // // //         const file = e.target.files[0];
// // // //         if (!file || !uploadModalId) return;
// // // //         const formData = new FormData();
// // // //         formData.append('videos', file); 
// // // //         try {
// // // //             await axios.put(`${API_BASE}/surveys/${uploadModalId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
// // // //             alert("GoPro Uploaded Successfully!");
// // // //             setUploadModalId(null);
// // // //             refreshData(); 
// // // //         } catch (error) { console.error("Upload failed", error); alert("Upload Failed"); }
// // // //     };

// // // //     const getDetailedFilename = () => {
// // // //         if (!currentMedia || !currentMedia.meta) return 'BSNL_Download';
// // // //         const { district, block, locationType, shotNumber, dateTime } = currentMedia.meta;
// // // //         const d = (district || 'UNK').substring(0, 3).toUpperCase();
// // // //         const b = (block || 'UNK').substring(0, 3).toUpperCase();
// // // //         const t = TYPE_CODES[locationType] || "OTH";
// // // //         const date = getBSNLTimestamp(dateTime);
// // // //         return `${d}_${b}_${t}_SHOTNO${shotNumber || '1'}_${date}`;
// // // //     };

// // // //     const handleDirectDownload = () => {
// // // //         if (!currentMedia || !currentMedia.blob) return;
// // // //         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
// // // //         const finalName = `${getDetailedFilename()}.${ext}`;
// // // //         saveAs(currentMedia.blob, finalName);
// // // //     };

// // // //     const handleDownloadZip = async () => {
// // // //         if (!currentMedia || !currentMedia.blob) return;
// // // //         const zip = new JSZip();
// // // //         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
// // // //         const finalName = getDetailedFilename();
// // // //         zip.file(`${finalName}.${ext}`, currentMedia.blob);
// // // //         const metaInfo = `Filename: ${finalName}\nSurveyor: ${currentMedia.meta.surveyorName}`;
// // // //         zip.file("details.txt", metaInfo);
// // // //         const content = await zip.generateAsync({type:"blob"});
// // // //         saveAs(content, `${finalName}.zip`);
// // // //     };

// // // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
// // // //     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime()+86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

// // // //     const styles = {
// // // //         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
// // // //         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
// // // //         controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // // //         headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // // //         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
// // // //         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // //         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // //         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // // //         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // // //         downloadBtn: { flex:1, padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', textAlign:'center', textDecoration:'none', fontSize:'14px' },
// // // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// // // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// // // //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' },
// // // //         adminCard: { background:'#fff', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.05)' },
// // // //         adminHeader: { background:'#f5f5f5', padding:'10px 15px', borderBottom:'1px solid #ddd', fontWeight:'bold', color:'#333' }
// // // //     };

// // // //     return (
// // // //         <div style={styles.container}>
// // // //             <div style={styles.header}>
// // // //                 <div style={styles.headerLeft}>
// // // //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// // // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
// // // //                     <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // //                     <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // //                     <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // // //                     <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // // //                 </div>
// // // //                 <div style={styles.controls}>
// // // //                     <button onClick={() => { setEditingSurvey(null); setIsViewMode(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
// // // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
// // // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// // // //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// // // //                 </div>
// // // //             </div>

// // // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// // // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // // //                 <LayersControl position="topright">
// // // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // // //                 </LayersControl>
// // // //                 {startPoint && <MapUpdater center={startPoint} />}
// // // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
// // // //                 {submittedSurveys.map(s => s.latitude && (
// // // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // // //                         <Popup minWidth={250}>
// // // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
// // // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // // //                                 <div><b>Route:</b> {s.routeName}</div>
// // // //                                 <div style={{marginTop:'10px'}}>
// // // //                                     {s.mediaFiles?.some(m => m.type === 'video') && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
// // // //                                     {s.mediaFiles?.some(m => m.type === 'photo') && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // // //                                 </div>
// // // //                             </div>
// // // //                         </Popup>
// // // //                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
// // // //                             <div style={{textAlign:'left', minWidth: '150px'}}>
// // // //                                 {isRecent(s.survey_date) && <div style={{background:'#e65100', color:'white', fontSize:'10px', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginBottom:'5px', fontWeight:'bold'}}>RECENT</div>}
// // // //                                 <div style={{fontWeight:'bold', fontSize:'13px', color: '#1a237e'}}>{s.locationType}</div>
// // // //                                 <div style={{fontSize:'12px', fontWeight:'bold', color:'#007bff', margin: '2px 0'}}>{s.generatedFileName || "No Filename"}</div>
// // // //                                 <div style={{fontSize:'11px', color:'#333'}}>Route: {s.routeName}</div>
// // // //                                 <div style={{fontSize:'11px', color:'#555'}}>Date: {getBSNLTimestamp(s.survey_date)}</div>
// // // //                                 <div style={{marginTop:'6px', paddingTop:'4px', borderTop:'1px solid #eee', display:'flex', gap:'8px', fontSize:'11px', fontWeight:'bold'}}>
// // // //                                     {s.mediaFiles?.some(m => m.type === 'photo') && <span style={{color:'#2e7d32'}}>[Photo]</span>}
// // // //                                     {s.mediaFiles?.some(m => m.type === 'video') && <span style={{color:'#d32f2f'}}>[Video]</span>}
// // // //                                 </div>
// // // //                             </div>
// // // //                         </Tooltip>
// // // //                     </Marker>
// // // //                 ))}
// // // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // // //             </MapContainer>

// // // //             {showSurveyForm && (
// // // //                 <SurveyForm 
// // // //                     onClose={() => { setShowSurveyForm(false); refreshData(); }} 
// // // //                     pickedCoords={pickedCoords} 
// // // //                      districts={DATA_HIERARCHY.districts} 
// // // //                      blocks={Object.values(DATA_HIERARCHY.blocks)} 
// // // //                      onSubmitData={handleSurveySubmit} 
// // // //                     user={user} 
// // // //                      onPickLocation={handlePickLocationStart} 
// // // //                     initialData={editingSurvey} 
// // // //                     viewOnly={isViewMode}
// // // //                 />
// // // //             )}

// // // //             {showSurveyTable && (
// // // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // // //                     <div style={styles.filterBox}>
// // // //                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
// // // //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // // //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// // // //                     </div>
// // // //                     <table style={styles.table}>
// // // //                         <thead><tr style={{textAlign:'left', background:'#f9f9f9'}}><th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead>
// // // //                         <tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}><td style={styles.td}><b>{s.generatedFileName}</b></td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>
// // // //                             {s.mediaFiles?.some(m => m.type === 'video') && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s)}>Live Vid</button>}
// // // //                             {s.mediaFiles?.some(m => m.type === 'photo') && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // // //                         </td><td style={styles.td}>
// // // //                             <button style={{...styles.actionBtn, background:'#eee', color:'#333'}} 
// // // //                                 onClick={()=>{ 
// // // //                                     setEditingSurvey(s); 
// // // //                                     setIsViewMode(true); 
// // // //                                     setShowSurveyTable(false); 
// // // //                                     setShowSurveyForm(true); 
// // // //                                 }}>
// // // //                                 View
// // // //                             </button>
// // // //                             {(role === 'admin' || s.submittedBy === user) && 
// // // //                                 <button style={{...styles.actionBtn, color:'blue', borderColor:'blue'}} 
// // // //                                     onClick={()=>{ 
// // // //                                         setEditingSurvey(s); 
// // // //                                         setIsViewMode(false); 
// // // //                                         setShowSurveyTable(false); 
// // // //                                         setShowSurveyForm(true); 
// // // //                                     }}>
// // // //                                     Edit
// // // //                                 </button>
// // // //                             }
// // // //                             {role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}
// // // //                         </td></tr>))}</tbody>
// // // //                     </table>
// // // //                     <div style={{display:'flex', justifyContent:'flex-end', gap:'10px', padding:'15px', alignItems:'center', borderTop:'1px solid #eee'}}>
// // // //                         <button style={styles.btnWhite} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt; Prev</button>
// // // //                         <span style={{fontSize:'13px', fontWeight:'bold'}}>Page {currentPage} of {totalPages}</span>
// // // //                         <button style={styles.btnWhite} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next &gt;</button>
// // // //                     </div>
// // // //                 </ModalWrapper>
// // // //             )}

// // // //             {showUserStatus && role === 'admin' && (
// // // //                 <ModalWrapper title="Admin Logs" onClose={() => setShowUserStatus(false)}>
// // // //                     {/* ... (Existing Log UI) ... */}
// // // //                 </ModalWrapper>
// // // //             )}

// // // //             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}

// // // //             {currentMedia && (
// // // //                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
// // // //                     <div style={{textAlign:'center', background:'black', padding:'15px', borderRadius:'8px'}}>
// // // //                         {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (<video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />) : (<img src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />)}
// // // //                         <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
// // // //                             <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}</button>
// // // //                             <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>Download ZIP</button>
// // // //                         </div>
// // // //                     </div>
// // // //                 </ModalWrapper>
// // // //             )}

// // // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>PICKING MODE ACTIVE - Click map</div>}
// // // //         </div>
// // // //     );
// // // // };

// // // // export default Dashboard;



// // // import React, { useState, useEffect, useCallback } from 'react';
// // // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// // // import 'leaflet/dist/leaflet.css';
// // // import L from 'leaflet';
// // // import SurveyForm from './SurveyForm';
// // // import JSZip from 'jszip';
// // // import { saveAs } from 'file-saver';
// // // import axios from 'axios';

// // // // --- ICONS ---
// // // const DefaultIcon = L.icon({ 
// // //     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", 
// // //     shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", 
// // //     iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] 
// // // });
// // // L.Marker.prototype.options.icon = DefaultIcon;

// // // const SurveyIcon = L.divIcon({ 
// // //     className: 'custom-survey-icon', 
// // //     html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', 
// // //     iconSize: [16, 16] 
// // // });

// // // // --- CONSTANTS ---
// // // const DATA_HIERARCHY = { 
// // //     districts: ['VARANASI', 'Hyderabad'], 
// // //     blocks: { 'Hyderabad': ['Central', 'North'], 'VARANASI': ['Badagon', 'City'] }, 
// // //     spans: { 'Central': ['Span-Uppal'], 'Badagon': ['Route-Varanasi-1'] }, 
// // //     rings: { 'Span-Uppal': ['Ring-01'] } 
// // // };

// // // const SPAN_COORDS = { 
// // //     'Span-Uppal': { start: { lat: 17.3984, lng: 78.5583 }, end: { lat: 17.3616, lng: 78.4747 } }, 
// // //     'Route-Varanasi-1': { start: { lat: 25.3176, lng: 82.9739 }, end: { lat: 25.3500, lng: 82.9900 } } 
// // // };

// // // // GLOBAL TYPE CODES
// // // const TYPE_CODES = {
// // //     "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
// // //     "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
// // //     "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// // // };

// // // // const API_BASE = 'https://gis-backend-9ajk.onrender.com';
// // // const API_BASE = process.env.REACT_APP_API_URL;

// // // // --- HELPERS ---
// // // const getRingPath = (start, end, offsetFactor) => { 
// // //     const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; 
// // //     return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; 
// // // };

// // // const generatePointsOnPath = (path, count) => { 
// // //     const points = []; 
// // //     for (let i = 1; i <= count; i++) { 
// // //         const ratio = i / (count + 1); 
// // //         points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); 
// // //     } 
// // //     return points; 
// // // };

// // // const getSessionDuration = (str) => { 
// // //     if (!str) return '-'; const diff = new Date() - new Date(str); return `${Math.floor(diff/60000)} mins`; 
// // // };

// // // const isRecent = (timestamp) => {
// // //     if (!timestamp) return false; const now = new Date(); const surveyDate = new Date(timestamp);
// // //     const diffHours = Math.abs(now - surveyDate) / 36e5; return diffHours < 24;
// // // };

// // // const getBSNLTimestamp = (dateString) => {
// // //     const d = dateString ? new Date(dateString) : new Date();
// // //     const day = String(d.getDate()).padStart(2, '0'); const month = String(d.getMonth() + 1).padStart(2, '0');
// // //     return `${day}${month}${d.getFullYear()}`;
// // // };

// // // // --- COMPONENTS ---
// // // const ModalWrapper = ({ children, title, onClose }) => ( 
// // //     <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
// // //         <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> 
// // //             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> 
// // //                 <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> 
// // //                 <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> 
// // //             </div> 
// // //             <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> 
// // //         </div> 
// // //     </div> 
// // // );

// // // const MapPickHandler = ({ isPicking, onPick }) => { 
// // //     useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); 
// // //     useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); 
// // //     return null; 
// // // };

// // // const MapUpdater = ({ center }) => { 
// // //     const map = useMap(); useEffect(() => { if (center) map.flyTo(center, 13); }, [center, map]); return null; 
// // // };

// // // const Dashboard = ({ user, role, onLogout, logAction }) => {
// // //     const [selectedDistrict, setSelectedDistrict] = useState('');
// // //     const [selectedBlock, setSelectedBlock] = useState('');
// // //     const [selectedSpan, setSelectedSpan] = useState('');
// // //     const [selectedRing, setSelectedRing] = useState('');

// // //     const [currentPage, setCurrentPage] = useState(1);
// // //     const [totalPages, setTotalPages] = useState(1);

// // //     const [startPoint, setStartPoint] = useState(null);
// // //     const [endPoint, setEndPoint] = useState(null);
// // //     const [displayPath, setDisplayPath] = useState([]);
// // //     const [isRingView, setIsRingView] = useState(false);
// // //     const [diggingPoints, setDiggingPoints] = useState([]);

// // //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// // //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// // //     const [userRoutes, setUserRoutes] = useState([]);

// // //     const [userStatuses, setUserStatuses] = useState([]);
// // //     const [logs, setLogs] = useState([]);

// // //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// // //     const [editingSurvey, setEditingSurvey] = useState(null);
// // //     const [isViewMode, setIsViewMode] = useState(false);

// // //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// // //     const [pickedCoords, setPickedCoords] = useState(null);
// // //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// // //     const [showUserStatus, setShowUserStatus] = useState(false);
// // //     const [currentMedia, setCurrentMedia] = useState(null);
// // //     const [uploadModalId, setUploadModalId] = useState(null);

// // //     const [searchDist, setSearchDist] = useState('');
// // //     const [searchBlock, setSearchBlock] = useState('');
// // //     const [searchGeneric, setSearchGeneric] = useState('');
// // //     const [searchDateFrom, setSearchDateFrom] = useState('');
// // //     const [searchDateTo, setSearchDateTo] = useState('');
// // //     const [filterStart, setFilterStart] = useState('');
// // //     const [filterEnd, setFilterEnd] = useState('');

// // //     const visibleDistricts = role === 'admin' ? DATA_HIERARCHY.districts : ['Hyderabad', 'VARANASI']; 
// // //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// // //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// // //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// // //     useEffect(() => {
// // //         if (!selectedSpan) { setStartPoint(null); setEndPoint(null); setDisplayPath([]); setDiggingPoints([]); return; }
// // //         const data = SPAN_COORDS[selectedSpan];
// // //         if(data) {
// // //             setStartPoint(data.start); setEndPoint(data.end);
// // //             if (selectedRing) {
// // //                 const idx = DATA_HIERARCHY.rings[selectedSpan].indexOf(selectedRing);
// // //                 const path = getRingPath(data.start, data.end, idx % 2 === 0 ? 0.006 : -0.006);
// // //                 setIsRingView(true); setDisplayPath(path); setDiggingPoints(generatePointsOnPath(path, 4));
// // //             } else {
// // //                 setIsRingView(false); setDisplayPath([data.start, data.end]); setDiggingPoints(generatePointsOnPath([data.start, data.end], 6));
// // //             }
// // //         }
// // //     }, [selectedSpan, selectedRing]);

// // //     const applyFilters = useCallback((data) => {
// // //         let filtered = data;
// // //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// // //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// // //         if (searchGeneric) {
// // //             const term = searchGeneric.toLowerCase();
// // //             filtered = filtered.filter(s => 
// // //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
// // //                 (s.routeName && s.routeName.toLowerCase().includes(term))
// // //             );
// // //         }
// // //         if (searchDateFrom && searchDateTo) {
// // //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// // //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// // //             filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
// // //         }
// // //         setFilteredSurveys(filtered);
// // //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// // //     // --- CRITICAL: DATA MAPPING ---
// // //     const refreshData = useCallback(async () => {
// // //         try {
// // //             const response = await axios.get(`${API_BASE}/surveys/all`, { 
// // //                 params: { page: currentPage, limit: 10 }
// // //             });

// // //             const { surveys, pagination } = response.data;

// // //             if (Array.isArray(surveys)) {
// // //                 const mergedData = surveys.map(s => {
// // //                     const mFiles = s.mediaFiles || [];

// // //                     const getProxyUrl = (path) => {
// // //                         if (!path) return null;
// // //                         return `${API_BASE}/surveys/read-file?path=${encodeURIComponent(path)}&mode=open`;
// // //                     };

// // //                     const sitePhotoObj = mFiles.find(f => f.type === 'photo' || f.type === 'site_photo');
// // //                     const liveVideoObj = mFiles.find(f => f.type === 'video' || f.type === 'live_video');
// // //                     const selfieObj = mFiles.find(f => f.type === 'selfie');
// // //                     const goproObj = mFiles.find(f => f.type === 'gopro' || f.type === 'gopro_video');

// // //                     const getPath = (obj) => obj ? (obj.url || obj.path || obj.filename) : null;

// // //                     return {
// // //                         ...s,
// // //                         id: s.id,
// // //                         routeName: s.routeName || s.route_name,
// // //                         locationType: s.locationType || s.location_type,
// // //                         shotNumber: s.shotNumber || s.shot_number,
// // //                         ringNumber: s.ringNumber || s.ring_number,
// // //                         startLocName: s.startLocName || s.start_location,
// // //                         endLocName: s.endLocName || s.end_location,
// // //                         surveyorName: s.surveyor_name,
// // //                         surveyorMobile: s.surveyor_mobile,
// // //                         dateTime: s.survey_date,
// // //                         generatedFileName: s.generated_filename || `SURVEY_${s.id}`,
// // //                         latitude: parseFloat(s.latitude || 0),
// // //                         longitude: parseFloat(s.longitude || 0),

// // //                         // Map URLs explicitly for Form
// // //                         sitePhoto: getPath(sitePhotoObj) ? getProxyUrl(getPath(sitePhotoObj)) : null,
// // //                         liveVideo: getPath(liveVideoObj) ? getProxyUrl(getPath(liveVideoObj)) : null,
// // //                         selfie: getPath(selfieObj) ? getProxyUrl(getPath(selfieObj)) : null,
// // //                         goproVideo: getPath(goproObj) ? getProxyUrl(getPath(goproObj)) : null,

// // //                         mediaFiles: mFiles
// // //                     };
// // //                 });

// // //                 const sorted = mergedData.sort((a, b) => new Date(b.created_at || b.dateTime) - new Date(a.created_at || a.dateTime));
// // //                 setSubmittedSurveys(sorted);
// // //                 applyFilters(sorted);

// // //                 if (pagination) setTotalPages(pagination.totalPages);

// // //                 const lines = [];
// // //                 sorted.forEach(s => {
// // //                     if (['HDD Start Point', 'HDD End Point'].includes(s.locationType)) {
// // //                         const lat = parseFloat(s.latitude);
// // //                         const lng = parseFloat(s.longitude);
// // //                         if (lat && lng) {
// // //                              lines.push({ start: {lat, lng}, end: {lat: lat+0.0001, lng: lng+0.0001}, name: s.routeName });
// // //                         }
// // //                     }
// // //                 });
// // //                 setUserRoutes(lines);
// // //             }
// // //         } catch(e) { console.error("Fetch Error", e); }
// // //     }, [applyFilters, currentPage]);

// // //     useEffect(() => {
// // //         refreshData(); 
// // //         if (role === 'admin') {
// // //             setUserStatuses([{ username: 'admin', status: 'Online', loginTime: new Date().toISOString() }]);
// // //             setLogs([{ displayTime: new Date().toLocaleString(), username: 'admin', action: 'LOGIN', details: 'System Access' }]);
// // //         }
// // //     }, [refreshData, role]);

// // //     const handleSurveySubmit = async (formData) => {
// // //         if (!formData || !formData.district) { alert("District is required"); return; }

// // //         try {
// // //             const apiData = new FormData();
// // //             const append = (key, value) => {
// // //                 if (value !== null && value !== undefined && value !== '') { apiData.append(key, value); }
// // //             };

// // //             append('district', formData.district);
// // //             append('block', formData.block);
// // //             append('routeName', formData.routeName);
// // //             append('locationType', formData.locationType);
// // //             append('shotNumber', formData.shotNumber || '0'); 
// // //             append('ringNumber', formData.ringNumber || '0');
// // //             append('startLocName', formData.startLocName);
// // //             append('endLocName', formData.endLocName);
// // //             append('fileNamePrefix', formData.generatedFileName); 
// // //             append('surveyorName', formData.surveyorName);
// // //             append('surveyorMobile', formData.surveyorMobile);
// // //             append('submittedBy', user.username || user || 'admin');
// // //             append('dateTime', formData.dateTime || new Date().toISOString());
// // //             append('latitude', formData.latitude);
// // //             append('longitude', formData.longitude);
// // //             append('remarks', formData.remarks || '');

// // //             if (formData.sitePhotoBlob instanceof Blob) apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');
// // //             if (formData.liveVideoBlob instanceof Blob) apiData.append('videos', formData.liveVideoBlob, 'live_video.mp4');
// // //             if (formData.goproBlob instanceof Blob || formData.goproBlob instanceof File) apiData.append('videos', formData.goproBlob, 'gopro_video.mp4');
// // //             if (formData.selfieBlob instanceof Blob) apiData.append('selfie', formData.selfieBlob, 'selfie.jpg');

// // //             const config = { headers: { 'Content-Type': 'multipart/form-data' } };
// // //             let response;

// // //             if (formData.id) {
// // //                 response = await axios.put(`${API_BASE}/surveys/${formData.id}`, apiData, config);
// // //             } else {
// // //                 response = await axios.post(`${API_BASE}/surveys`, apiData, config);
// // //             }

// // //             if (response.data.success) {
// // //                 alert("Saved Successfully!");
// // //                 setShowSurveyForm(false);
// // //                 setEditingSurvey(null);
// // //                 refreshData(); 
// // //             }

// // //         } catch (e) {
// // //             console.error("FULL ERROR:", e);
// // //             const serverMessage = e.response?.data?.message || e.response?.statusText || "Server Error";
// // //             alert(`Failed to save: ${serverMessage}`);
// // //         }
// // //     };

// // //     const handleDeleteSurvey = async (id) => {
// // //         if(window.confirm("Admin: Permanently delete this record?")) {
// // //             try {
// // //                 await axios.delete(`${API_BASE}/surveys/${id}/cancel`); 
// // //                 if (typeof logAction === 'function') logAction(user, 'DELETED_DATA', `ID: ${id}`);
// // //                 refreshData();
// // //             } catch (e) { console.error(e); alert("Failed to delete."); }
// // //         }
// // //     };

// // //     const fetchBackendFile = async (path, mode = 'open') => {
// // //         try {
// // //             const response = await axios.get(`${API_BASE}/surveys/read-file?path=${encodeURIComponent(path)}&mode=${mode}`, { responseType: 'blob' });
// // //             return response.data; 
// // //         } catch (error) { console.error("File Fetch Error:", error); return null; }
// // //     };

// // //     const handleViewMedia = async (type, survey) => {
// // //         if (!survey.mediaFiles || survey.mediaFiles.length === 0) { alert("No media found on server."); return; }
// // //         const targetType = (type === 'gopro' || type === 'video') ? 'video' : 'photo';
// // //         const fileObj = survey.mediaFiles.find(m => m.type === targetType);
// // //         if (fileObj && fileObj.url) {
// // //             const blob = await fetchBackendFile(fileObj.url, 'open');
// // //             if (blob) {
// // //                 const objectUrl = URL.createObjectURL(blob);
// // //                 setCurrentMedia({ type, url: objectUrl, blob: blob, filename: `file.${targetType === 'video'?'mp4':'jpg'}`, meta: survey });
// // //             } else { alert("Failed to load file."); }
// // //         } else { alert(`No ${type} found for this survey.`); }
// // //     };

// // //     const handleGoProUpload = async (e) => {
// // //         const file = e.target.files[0];
// // //         if (!file || !uploadModalId) return;
// // //         const formData = new FormData();
// // //         formData.append('videos', file); 
// // //         try {
// // //             await axios.put(`${API_BASE}/surveys/${uploadModalId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
// // //             alert("GoPro Uploaded Successfully!");
// // //             setUploadModalId(null);
// // //             refreshData(); 
// // //         } catch (error) { console.error("Upload failed", error); alert("Upload Failed"); }
// // //     };

// // //     const getDetailedFilename = () => {
// // //         if (!currentMedia || !currentMedia.meta) return 'BSNL_Download';
// // //         const { district, block, locationType, shotNumber, dateTime } = currentMedia.meta;
// // //         const d = (district || 'UNK').substring(0, 3).toUpperCase();
// // //         const b = (block || 'UNK').substring(0, 3).toUpperCase();
// // //         const t = TYPE_CODES[locationType] || "OTH";
// // //         const date = getBSNLTimestamp(dateTime);
// // //         return `${d}_${b}_${t}_SHOTNO${shotNumber || '1'}_${date}`;
// // //     };

// // //     const handleDirectDownload = () => {
// // //         if (!currentMedia || !currentMedia.blob) return;
// // //         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
// // //         const finalName = `${getDetailedFilename()}.${ext}`;
// // //         saveAs(currentMedia.blob, finalName);
// // //     };

// // //     const handleDownloadZip = async () => {
// // //         if (!currentMedia || !currentMedia.blob) return;
// // //         const zip = new JSZip();
// // //         const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg';
// // //         const finalName = getDetailedFilename();
// // //         zip.file(`${finalName}.${ext}`, currentMedia.blob);
// // //         const metaInfo = `Filename: ${finalName}\nSurveyor: ${currentMedia.meta.surveyorName}`;
// // //         zip.file("details.txt", metaInfo);
// // //         const content = await zip.generateAsync({type:"blob"});
// // //         saveAs(content, `${finalName}.zip`);
// // //     };

// // //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// // //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
// // //     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime()+86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

// // //     const styles = {
// // //         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
// // //         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
// // //         controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // //         headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// // //         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// // //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
// // //         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // //         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // //         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// // //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// // //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// // //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// // //         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// // //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// // //         downloadBtn: { flex:1, padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', textAlign:'center', textDecoration:'none', fontSize:'14px' },
// // //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// // //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// // //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' },
// // //         adminCard: { background:'#fff', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.05)' },
// // //         adminHeader: { background:'#f5f5f5', padding:'10px 15px', borderBottom:'1px solid #ddd', fontWeight:'bold', color:'#333' }
// // //     };

// // //     return (
// // //         <div style={styles.container}>
// // //             <div style={styles.header}>
// // //                 <div style={styles.headerLeft}>
// // //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// // //                     <span style={styles.badge}>{role.toUpperCase()}</span>
// // //                     <select style={styles.select} onChange={e=>setSelectedDistrict(e.target.value)}><option>District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // //                     <select style={styles.select} onChange={e=>setSelectedBlock(e.target.value)}><option>Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // //                     <select style={styles.select} onChange={e=>setSelectedSpan(e.target.value)}><option>Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// // //                     <select style={styles.select} onChange={e=>setSelectedRing(e.target.value)}><option>Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// // //                 </div>
// // //                 <div style={styles.controls}>
// // //                     <button onClick={() => { setEditingSurvey(null); setIsViewMode(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
// // //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
// // //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// // //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// // //                 </div>
// // //             </div>

// // //             <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ flex: 1 }}>
// // //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// // //                 <LayersControl position="topright">
// // //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// // //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// // //                 </LayersControl>
// // //                 {startPoint && <MapUpdater center={startPoint} />}
// // //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// // //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// // //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// // //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// // //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
// // //                 {submittedSurveys.map(s => s.latitude && (
// // //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// // //                         <Popup minWidth={250}>
// // //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// // //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
// // //                                 <div><b>File:</b> {s.generatedFileName}</div>
// // //                                 <div><b>Route:</b> {s.routeName}</div>
// // //                                 <div style={{marginTop:'10px'}}>
// // //                                     {s.mediaFiles?.some(m => m.type === 'video') && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
// // //                                     {s.mediaFiles?.some(m => m.type === 'photo') && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // //                                 </div>
// // //                             </div>
// // //                         </Popup>
// // //                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
// // //                             <div style={{textAlign:'left', minWidth: '150px'}}>
// // //                                 {isRecent(s.survey_date) && <div style={{background:'#e65100', color:'white', fontSize:'10px', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginBottom:'5px', fontWeight:'bold'}}>RECENT</div>}
// // //                                 <div style={{fontWeight:'bold', fontSize:'13px', color: '#1a237e'}}>{s.locationType}</div>
// // //                                 <div style={{fontSize:'12px', fontWeight:'bold', color:'#007bff', margin: '2px 0'}}>{s.generatedFileName || "No Filename"}</div>
// // //                                 <div style={{fontSize:'11px', color:'#333'}}>Route: {s.routeName}</div>
// // //                                 <div style={{fontSize:'11px', color:'#555'}}>Date: {getBSNLTimestamp(s.survey_date)}</div>
// // //                                 <div style={{marginTop:'6px', paddingTop:'4px', borderTop:'1px solid #eee', display:'flex', gap:'8px', fontSize:'11px', fontWeight:'bold'}}>
// // //                                     {s.mediaFiles?.some(m => m.type === 'photo') && <span style={{color:'#2e7d32'}}>[Photo]</span>}
// // //                                     {s.mediaFiles?.some(m => m.type === 'video') && <span style={{color:'#d32f2f'}}>[Video]</span>}
// // //                                 </div>
// // //                             </div>
// // //                         </Tooltip>
// // //                     </Marker>
// // //                 ))}
// // //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// // //             </MapContainer>

// // //             {showSurveyForm && (
// // //                 <SurveyForm 
// // //                     onClose={() => { setShowSurveyForm(false); refreshData(); }} 
// // //                     pickedCoords={pickedCoords} 
// // //                      districts={DATA_HIERARCHY.districts} 
// // //                      blocks={Object.values(DATA_HIERARCHY.blocks)} 
// // //                      onSubmitData={handleSurveySubmit} 
// // //                     user={user} 
// // //                      onPickLocation={handlePickLocationStart} 
// // //                     initialData={editingSurvey} 
// // //                     viewOnly={isViewMode}
// // //                 />
// // //             )}

// // //             {showSurveyTable && (
// // //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// // //                     <div style={styles.filterBox}>
// // //                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
// // //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// // //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// // //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// // //                     </div>
// // //                     <table style={styles.table}>
// // //                         <thead><tr style={{textAlign:'left', background:'#f9f9f9'}}><th style={styles.th}>Filename</th><th style={styles.th}>Shot</th><th style={styles.th}>Type</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead>
// // //                         <tbody>{filteredSurveys.map(s => (<tr key={s.id} title={`Route: ${s.routeName}`} style={{cursor:'help', borderBottom:'1px solid #f0f0f0'}}><td style={styles.td}><b>{s.generatedFileName}</b></td><td style={styles.td}>{s.shotNumber}</td><td style={styles.td}>{s.locationType}</td><td style={styles.td}>
// // //                             {s.mediaFiles?.some(m => m.type === 'video') && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('video', s)}>Live Vid</button>}
// // //                             {s.mediaFiles?.some(m => m.type === 'photo') && <button style={{...styles.actionBtn, color:'green', borderColor:'green'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// // //                         </td><td style={styles.td}>

// // //                             {/* VIEW BUTTON */}
// // //                             <button style={{...styles.actionBtn, background:'#e3f2fd', color:'#0d47a1', border:'1px solid #0d47a1'}} 
// // //                                 onClick={()=>{ 
// // //                                     setEditingSurvey(s); 
// // //                                     setIsViewMode(true); 
// // //                                     setShowSurveyTable(false); 
// // //                                     setShowSurveyForm(true); 
// // //                                 }}>
// // //                                 View
// // //                             </button>

// // //                             {/* EDIT BUTTON */}
// // //                             {(role === 'admin' || s.submittedBy === user) && 
// // //                                 <button style={{...styles.actionBtn, background:'#fff3e0', color:'#e65100', border:'1px solid #e65100'}} 
// // //                                     onClick={()=>{ 
// // //                                         setEditingSurvey(s); 
// // //                                         setIsViewMode(false); 
// // //                                         setShowSurveyTable(false); 
// // //                                         setShowSurveyForm(true); 
// // //                                     }}>
// // //                                     Edit
// // //                                 </button>
// // //                             }

// // //                             {role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}

// // //                         </td></tr>))}</tbody>
// // //                     </table>
// // //                     <div style={{display:'flex', justifyContent:'flex-end', gap:'10px', padding:'15px', alignItems:'center', borderTop:'1px solid #eee'}}>
// // //                         <button style={styles.btnWhite} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt; Prev</button>
// // //                         <span style={{fontSize:'13px', fontWeight:'bold'}}>Page {currentPage} of {totalPages}</span>
// // //                         <button style={styles.btnWhite} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next &gt;</button>
// // //                     </div>
// // //                 </ModalWrapper>
// // //             )}

// // //             {showUserStatus && role === 'admin' && (
// // //                 <ModalWrapper title="Admin Logs" onClose={() => setShowUserStatus(false)}>
// // //                      <div style={{display:'flex', gap:'20px', height:'100%', flexDirection:'row'}}>
// // //                         <div style={{flex:1, minWidth:'300px'}}>
// // //                             <div style={styles.adminCard}>
// // //                                 <div style={styles.adminHeader}>Live User Status</div>
// // //                                 <table style={styles.table}>
// // //                                     <thead><tr style={{background:'#f9f9f9'}}><th style={{padding:'10px'}}>User</th><th>Status</th><th>Time</th></tr></thead>
// // //                                     <tbody>{userStatuses.map((u, i) => (<tr key={i} style={{borderBottom:'1px solid #eee'}}><td style={{padding:'10px', fontWeight:'bold'}}>{u.username}</td><td><span style={{...styles.statusDot, background: u.status==='Online'?'#4caf50':'#9e9e9e'}}></span>{u.status}</td><td style={{fontSize:'12px', color:'#666'}}>{u.status==='Online' ? getSessionDuration(u.loginTime) : '-'}</td></tr>))}</tbody>
// // //                                 </table>
// // //                             </div>
// // //                         </div>
// // //                         <div style={{flex:2}}>
// // //                             <div style={styles.adminCard}>
// // //                                 <div style={{...styles.adminHeader, display:'flex', justifyContent:'space-between', alignItems:'center'}}><span>System Logs</span><div style={{fontSize:'12px', fontWeight:'normal'}}>Filter: <input type="date" onChange={e => setFilterStart(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/> to <input type="date" onChange={e => setFilterEnd(e.target.value)} style={{border:'1px solid #ccc', padding:'2px', borderRadius:'3px'}}/></div></div>
// // //                                 <div style={{maxHeight:'400px', overflowY:'auto'}}>
// // //                                     <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
// // //                                         <thead style={{position:'sticky', top:0, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,0.1)'}}><tr><th style={{padding:'10px', textAlign:'left'}}>Time</th><th style={{textAlign:'left'}}>User</th><th style={{textAlign:'left'}}>Action</th><th style={{textAlign:'left'}}>Details</th></tr></thead>
// // //                                         <tbody>{getFilteredLogs().map((l,i) => (<tr key={i} style={{borderBottom:'1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa'}}><td style={{padding:'8px', color:'#666', whiteSpace:'nowrap'}}>{l.displayTime}</td><td style={{fontWeight:'bold', color:'#333'}}>{l.username}</td><td style={{color: l.action.includes('DELETED')?'red':'#1565c0'}}>{l.action}</td><td style={{color:'#555'}}>{l.details}</td></tr>))}</tbody>
// // //                                     </table>
// // //                                 </div>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 </ModalWrapper>
// // //             )}

// // //             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}

// // //             {currentMedia && (
// // //                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
// // //                     <div style={{textAlign:'center', background:'black', padding:'15px', borderRadius:'8px'}}>
// // //                         {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (<video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />) : (<img src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />)}
// // //                         <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
// // //                             <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}</button>
// // //                             <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>Download ZIP</button>
// // //                         </div>
// // //                     </div>
// // //                 </ModalWrapper>
// // //             )}

// // //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>PICKING MODE ACTIVE - Click map</div>}
// // //         </div>
// // //     );
// // // };

// // // export default Dashboard;



// // import React, { useState, useEffect, useCallback } from 'react';
// // import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import L from 'leaflet';
// // import SurveyForm from './SurveyForm';
// // import JSZip from 'jszip';
// // import { saveAs } from 'file-saver';
// // import axios from 'axios';

// // // --- ICONS ---
// // const DefaultIcon = L.icon({ 
// //     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", 
// //     shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", 
// //     iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] 
// // });
// // L.Marker.prototype.options.icon = DefaultIcon;

// // const SurveyIcon = L.divIcon({ 
// //     className: 'custom-survey-icon', 
// //     html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', 
// //     iconSize: [16, 16] 
// // });

// // // --- DISTRICT COORDINATES ---
// // const DISTRICT_COORDS = {
// //     "Ambedkar Nagar": [26.4416, 82.5925],
// //     "Ayodhya": [26.7992, 82.2023],
// //     "Azamgarh": [26.0669, 83.1861],
// //     "Ballia": [25.8398, 84.1523],
// //     "Balrampur": [27.4265, 82.1760],
// //     "Banda": [25.4800, 80.3340],
// //     "Barabanki": [26.9388, 81.1912],
// //     "Basti": [26.7937, 82.4700],
// //     "Bhadohi": [25.3941, 82.5709],
// //     "Deoria": [26.5056, 83.7780],
// //     "Ghazipur": [25.5794, 83.5684],
// //     "Gonda": [27.1303, 81.9669],
// //     "Gorakhpur": [26.7606, 83.3732],
// //     "Kushi Nagar": [26.9031, 83.8967],
// //     "Maharajganj": [27.1437, 83.5645],
// //     "Mau": [25.9452, 83.5599],
// //     "Mirzapur": [25.1337, 82.5644],
// //     "Sant Kabeer Nagar": [26.7329, 83.0261],
// //     "Siddharth Nagar": [27.2848, 82.7845],
// //     "Varanasi": [25.3176, 82.9739]
// // };

// // // --- DATA HIERARCHY ---
// // const DATA_HIERARCHY = { 
// //     blocks: { 
// //         "Ambedkar Nagar": ["Bhiti", "Ram Nagar", "Baskhari", "Bhiyawan", "Jahangir Ganj", "Jalal Pur", "Katehari", "Tanda"],
// //         "Ayodhya": ["Bikapur", "Pura Bazar", "Amaniganj", "Hariyangatanganj", "Mawai", "Milkipur", "Rudauli", "Sohawal", "Tarun"],
// //         "Azamgarh": ["Mehnagar", "Azmatgarh", "Jahanaganj", "Rani Ki Sarai", "Lalganj", "Mahrajganj", "Palhani", "Mirzapur", "Tahbarpur", "Ahiraula", "Haraiya", "Martinganj", "Mohammadpur", "Palhana", "Pawai", "Thekma", "Bilariyaganj", "Sathiyaon", "Tarwa", "Phulpur"],
// //         "Ballia": ["Garwar", "Bansdih", "Chilkahar", "Dubhar", "Maniar", "Reoti", "Belhari", "Beruarbari", "Hanumanganj", "Navanagar", "Rasra", "Sohanv", "Siar"],
// //         "Balrampur": ["Shriduttganj", "Balrampur", "Pachpedwa", "Harriya Satgharwa", "Raheera Bazaar", "Gaindas Bujurg", "Utraula", "Tulsipur", "Gasiri"],
// //         "Banda": ["Bisanda", "Tindwari", "Badokhar Khurd"],
// //         "Barabanki": ["Suratganj", "Ramnagar", "Sirauli Gauspur", "Bani Kodar", "Haidargarh", "Nindaura", "Puredalai", "Trivediganj"],
// //         "Basti": ["Saltaua Gopal Pur", "Bahadurpur", "Basti", "Dubauliya", "Gaur", "Harraiya", "Kaptanganj", "Bankati", "Kudraha", "Paras Rampur", "Rudauli", "Sau Ghat", "Ramnagar", "Vikram Jot"],
// //         "Bhadohi": ["Aurai"],
// //         "Deoria": ["Bhatni", "Baitalpur", "Bankata", "Barhaj", "Bhaluani", "Bhatpar Rani", "Deoria Sadar", "Desai Deoria", "Gauri Bazar", "Lar", "Pathar Dewa", "Rampur Karkhana", "Rudrapur", "Salempur", "Tarkalua", "Bhagalpur"],
// //         "Ghazipur": ["Mohammadabad", "Virno"],
// //         "Gonda": ["Mankapur", "Haldharmau", "Babhanjot", "Belsar", "Chhapia", "Colonelganj", "Itiyathok", "Jhanjhari", "Katra Bazar", "Mujehana", "Pandri Kripal", "Paraspur", "Rupaideeh", "Tarabganj", "Nawabganj", "Wazirganj"],
// //         "Gorakhpur": ["Khorabar", "Pali", "Pipraich", "Brahmpur", "Sardarngar", "Bharohiya", "Bhathat", "Campierganj", "Chargawan", "Gagaha", "Gola", "Jangal Kaudia", "Kauri Ram", "Khajni", "Piprauli", "Sahjanawa", "Uruwa"],
// //         "Kushi Nagar": ["Dudhahi", "Fazilnagar", "Hata", "Kaptainganj", "Kasaya", "Khadda", "Motichak", "Nebua Naurangia", "Padrauna", "Ramkola", "Seorahi", "Sukrauli", "Tamkuhiraj", "Vishunpura"],
// //         "Maharajganj": ["Dhani", "Ghughli", "Lakshmipur", "Brijmanganj", "Mithaura", "Nautanwa", "Nichlaul", "Pharenda", "Mahrajganj", "Paniyara", "Partawal", "Siswa"],
// //         "Mau": ["Atraulia", "Dohari Ghat", "Pardaha", "Badraon", "Fatehpur Madaun", "Ghosi", "Kopaganj", "Mohammadabad Gohana", "Ratanpura"],
// //         "Mirzapur": ["Lalganj"],
// //         "Sant Kabeer Nagar": ["Baghauli", "Belhar Kala", "Hainsar Bazar", "Khalilabad", "Mehdawal", "Nath Nagar", "Pauli", "Santha", "Semariyawan"],
// //         "Siddharth Nagar": ["Barhni", "Bansi", "Itwa", "Lotan", "Shohartgarh", "Ranipur", "Birdpur", "Bhanwapur", "Jogia", "Khesraha", "Khuniyaon", "Mithwal", "Naugarh", "Uska Bazar"],
// //         "Varanasi": ["Baragaon", "Arajiline", "Harahua", "Pindra", "Sevapuri"]
// //     },
// //     spans: {}, 
// //     rings: {} 
// // };

// // // GLOBAL TYPE CODES
// // const TYPE_CODES = { "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM", "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP", "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH" };

// // const API_BASE = process.env.REACT_APP_API_URL;

// // // --- HELPERS ---
// // const getRingPath = (start, end, offsetFactor) => { 
// //     const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; 
// //     return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; 
// // };

// // const generatePointsOnPath = (path, count) => { 
// //     const points = []; 
// //     for (let i = 1; i <= count; i++) { 
// //         const ratio = i / (count + 1); 
// //         points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); 
// //     } 
// //     return points; 
// // };

// // const getSessionDuration = (str) => { if (!str) return '-'; const diff = new Date() - new Date(str); return `${Math.floor(diff/60000)} mins`; };

// // const isRecent = (timestamp) => {
// //     if (!timestamp) return false; const now = new Date(); const surveyDate = new Date(timestamp);
// //     const diffHours = Math.abs(now - surveyDate) / 36e5; return diffHours < 24;
// // };

// // const isJustUpdated = (dateString) => {
// //     if (!dateString) return false;
// //     const now = new Date();
// //     const target = new Date(dateString);
// //     const diffMins = (now - target) / 60000;
// //     return diffMins < 15 && diffMins >= 0;
// // };

// // const formatTableDate = (dateString) => {
// //     if (!dateString) return '-';
// //     return new Date(dateString).toLocaleString('en-IN', {
// //         day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
// //     });
// // };

// // const getBSNLTimestamp = (dateString) => {
// //     const d = dateString ? new Date(dateString) : new Date();
// //     const day = String(d.getDate()).padStart(2, '0'); const month = String(d.getMonth() + 1).padStart(2, '0');
// //     return `${day}${month}${d.getFullYear()}`;
// // };

// // // --- COMPONENTS ---
// // const ModalWrapper = ({ children, title, onClose }) => ( 
// //     <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
// //         <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> 
// //             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> 
// //                 <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> 
// //                 <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> 
// //             </div> 
// //             <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> 
// //         </div> 
// //     </div> 
// // );

// // const MapPickHandler = ({ isPicking, onPick }) => { 
// //     useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); 
// //     useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); 
// //     return null; 
// // };

// // const MapUpdater = ({ center, zoom }) => { 
// //     const map = useMap(); 
// //     useEffect(() => { 
// //         if (center) {
// //             map.flyTo(center, zoom || 13, { duration: 1.5 });
// //         } 
// //     }, [center, zoom, map]); 
// //     return null; 
// // };

// // const Dashboard = ({ user, role, onLogout, logAction }) => {
// //     const [selectedDistrict, setSelectedDistrict] = useState('');
// //     const [selectedBlock, setSelectedBlock] = useState('');
// //     const [selectedSpan, setSelectedSpan] = useState('');
// //     const [selectedRing, setSelectedRing] = useState('');

// //     // --- MAP STATE ---
// //     const [mapCenter, setMapCenter] = useState([26.8467, 80.9462]); 
// //     const [mapZoom, setMapZoom] = useState(7);

// //     const [currentPage, setCurrentPage] = useState(1);
// //     const [totalPages, setTotalPages] = useState(1);

// //     const [startPoint, setStartPoint] = useState(null);
// //     const [endPoint, setEndPoint] = useState(null);
// //     const [displayPath, setDisplayPath] = useState([]);
// //     const [isRingView, setIsRingView] = useState(false);
// //     const [diggingPoints, setDiggingPoints] = useState([]);

// //     const [submittedSurveys, setSubmittedSurveys] = useState([]);
// //     const [filteredSurveys, setFilteredSurveys] = useState([]);
// //     const [userRoutes, setUserRoutes] = useState([]);

// //     const [userStatuses, setUserStatuses] = useState([]);
// //     const [logs, setLogs] = useState([]);

// //     const [showSurveyForm, setShowSurveyForm] = useState(false);
// //     const [editingSurvey, setEditingSurvey] = useState(null);
// //     const [isViewMode, setIsViewMode] = useState(false);

// //     const [isPickingLocation, setIsPickingLocation] = useState(false);
// //     const [pickedCoords, setPickedCoords] = useState(null);
// //     const [showSurveyTable, setShowSurveyTable] = useState(false);
// //     const [showUserStatus, setShowUserStatus] = useState(false);
// //     const [currentMedia, setCurrentMedia] = useState(null);
// //     const [uploadModalId, setUploadModalId] = useState(null);

// //     const [searchDist, setSearchDist] = useState('');
// //     const [searchBlock, setSearchBlock] = useState('');
// //     const [searchGeneric, setSearchGeneric] = useState('');
// //     const [searchDateFrom, setSearchDateFrom] = useState('');
// //     const [searchDateTo, setSearchDateTo] = useState('');
// //     const [filterStart, setFilterStart] = useState('');
// //     const [filterEnd, setFilterEnd] = useState('');

// //     const visibleDistricts = Object.keys(DATA_HIERARCHY.blocks).sort();
// //     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];
// //     const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : [];
// //     const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

// //     useEffect(() => {
// //         if (navigator.geolocation) {
// //             navigator.geolocation.getCurrentPosition(
// //                 (position) => {
// //                     setMapCenter([position.coords.latitude, position.coords.longitude]);
// //                     setMapZoom(12);
// //                 },
// //                 (error) => { console.warn("Location access denied."); }
// //             );
// //         }
// //     }, []);

// //     useEffect(() => {
// //         if (selectedDistrict && DISTRICT_COORDS[selectedDistrict]) {
// //             setMapCenter(DISTRICT_COORDS[selectedDistrict]);
// //             setMapZoom(10);
// //         }
// //     }, [selectedDistrict]);

// //     useEffect(() => {
// //         if (selectedBlock && selectedDistrict) {
// //             const fetchBlockCoords = async () => {
// //                 try {
// //                     const query = `${selectedBlock}, ${selectedDistrict}, Uttar Pradesh, India`;
// //                     const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
// //                     if (response.data && response.data.length > 0) {
// //                         setMapCenter([parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)]);
// //                         setMapZoom(13);
// //                     }
// //                 } catch (e) { console.error("Auto-locate failed", e); }
// //             };
// //             fetchBlockCoords();
// //         }
// //     }, [selectedBlock, selectedDistrict]);

// //     const applyFilters = useCallback((data) => {
// //         let filtered = data;
// //         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
// //         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
// //         if (searchGeneric) {
// //             const term = searchGeneric.toLowerCase();
// //             filtered = filtered.filter(s => 
// //                 (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) ||
// //                 (s.routeName && s.routeName.toLowerCase().includes(term))
// //             );
// //         }
// //         if (searchDateFrom && searchDateTo) {
// //             const from = new Date(searchDateFrom).setHours(0,0,0,0);
// //             const to = new Date(searchDateTo).setHours(23,59,59,999);
// //             filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; });
// //         }
// //         setFilteredSurveys(filtered);
// //     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

// //     // --- REFRESH DATA (LEFTOVER ALLOCATION STRATEGY) ---
// //     const refreshData = useCallback(async () => {
// //         try {
// //             const response = await axios.get(`${API_BASE}/surveys/all`, { 
// //                 params: { page: currentPage, limit: 10 }
// //             });
// //             const { surveys, pagination } = response.data;
// //             if (Array.isArray(surveys)) {
// //                 const mergedData = surveys.map(s => {
// //                     const mFiles = s.mediaFiles || [];
// //                     const getProxyUrl = (path) => path ? `${API_BASE}/surveys/read-file?path=${encodeURIComponent(path)}&mode=open&t=${Date.now()}` : null;
// //                     const getFileName = (f) => (f.filename || f.path || f.url || '').toLowerCase();

// //                     // 1. Get all video objects
// //                     const allVideos = mFiles.filter(f => f.type === 'video' || f.type === 'live_video' || f.type === 'gopro_video' || f.type === 'gopro');

// //                     // 2. Identify Strict Matches First
// //                     let goproObj = allVideos.find(f => f.type === 'gopro' || f.type === 'gopro_video' || getFileName(f).includes('gopro'));
// //                     let liveVideoObj = allVideos.find(f => f.type === 'live_video' || getFileName(f).includes('live'));

// //                     // 3. Identify Leftovers (Videos that didn't match Strict rules)
// //                     const leftovers = allVideos.filter(f => f !== goproObj && f !== liveVideoObj);

// //                     // 4. ALLOCATION STRATEGY (The Fix)
// //                     // If we have unmatched videos, fill the empty slots.
// //                     // Priority: If GoPro slot is empty, put the first leftover there.
// //                     // Why? Because GoPro uploads are more likely to have generic names if backend renames them.

// //                     if (!goproObj && leftovers.length > 0) {
// //                         goproObj = leftovers.shift(); // Take first leftover for GoPro
// //                     }

// //                     if (!liveVideoObj && leftovers.length > 0) {
// //                         liveVideoObj = leftovers.shift(); // Take next leftover for Live
// //                     }

// //                     // --- OTHER MEDIA ---
// //                     const sitePhotoObj = mFiles.find(f => f.type === 'photo' || f.type === 'site_photo');
// //                     const selfieObj = mFiles.find(f => f.type === 'selfie');

// //                     const getPath = (obj) => obj ? (obj.url || obj.path || obj.filename) : null;

// //                     const userDisplay = s.submittedBy || s.submitted_by || 'Unknown';
// //                     const lastModified = s.updated_at || s.updatedAt || s.created_at || s.survey_date;

// //                     return {
// //                         ...s,
// //                         id: s.id,
// //                         routeName: s.routeName || s.route_name,
// //                         locationType: s.locationType || s.location_type,
// //                         shotNumber: s.shotNumber || s.shot_number,
// //                         ringNumber: s.ringNumber || s.ring_number,
// //                         startLocName: s.startLocName || s.start_location,
// //                         endLocName: s.endLocName || s.end_location,
// //                         surveyorName: s.surveyor_name,
// //                         surveyorMobile: s.surveyor_mobile,
// //                         dateTime: s.survey_date,

// //                         submittedBy: userDisplay, 
// //                         lastModifiedTime: lastModified, 

// //                         generatedFileName: s.generated_filename || `SURVEY_${s.id}`,
// //                         latitude: parseFloat(s.latitude || 0),
// //                         longitude: parseFloat(s.longitude || 0),

// //                         // MAPPED CORRECTLY
// //                         sitePhoto: getPath(sitePhotoObj) ? getProxyUrl(getPath(sitePhotoObj)) : null,
// //                         liveVideo: getPath(liveVideoObj) ? getProxyUrl(getPath(liveVideoObj)) : null,
// //                         goproVideo: getPath(goproObj) ? getProxyUrl(getPath(goproObj)) : null,
// //                         selfie: getPath(selfieObj) ? getProxyUrl(getPath(selfieObj)) : null,

// //                         mediaFiles: mFiles
// //                     };
// //                 });

// //                 const sorted = mergedData.sort((a, b) => new Date(b.lastModifiedTime) - new Date(a.lastModifiedTime));

// //                 setSubmittedSurveys(sorted);
// //                 applyFilters(sorted);
// //                 if (pagination) setTotalPages(pagination.totalPages);
// //                 const lines = [];
// //                 sorted.forEach(s => {
// //                     if (['HDD Start Point', 'HDD End Point'].includes(s.locationType)) {
// //                         const lat = parseFloat(s.latitude);
// //                         const lng = parseFloat(s.longitude);
// //                         if (lat && lng) lines.push({ start: {lat, lng}, end: {lat: lat+0.0001, lng: lng+0.0001}, name: s.routeName });
// //                     }
// //                 });
// //                 setUserRoutes(lines);
// //             }
// //         } catch(e) { console.error("Fetch Error", e); }
// //     }, [applyFilters, currentPage]);

// //     useEffect(() => {
// //         refreshData(); 
// //         if (role === 'admin') {
// //             setUserStatuses([{ username: 'admin', status: 'Online', loginTime: new Date().toISOString() }]);
// //             setLogs([{ displayTime: new Date().toLocaleString(), username: 'admin', action: 'LOGIN', details: 'System Access' }]);
// //         }
// //     }, [refreshData, role]);

// //     const handleSurveySubmit = async (formData) => {
// //         if (!formData || !formData.district) { alert("District is required"); return; }
// //         try {
// //             const apiData = new FormData();
// //             const append = (key, value) => { if (value !== null && value !== undefined && value !== '') apiData.append(key, value); };
// //             append('district', formData.district); append('block', formData.block); append('routeName', formData.routeName);
// //             append('locationType', formData.locationType); append('shotNumber', formData.shotNumber || '0'); append('ringNumber', formData.ringNumber || '0');
// //             append('startLocName', formData.startLocName); append('endLocName', formData.endLocName); append('fileNamePrefix', formData.generatedFileName);
// //             append('surveyorName', formData.surveyorName); append('surveyorMobile', formData.surveyorMobile); 

// //             const submittedByUser = (user && user.username) ? user.username : (typeof user === 'string' ? user : 'admin');
// //             append('submittedBy', submittedByUser);

// //             append('dateTime', formData.dateTime || new Date().toISOString()); append('latitude', formData.latitude); append('longitude', formData.longitude);
// //             append('remarks', formData.remarks || '');

// //             // --- STRICT FILENAME SAVING ---
// //             if (formData.sitePhotoBlob instanceof Blob) apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');
// //             if (formData.liveVideoBlob instanceof Blob) apiData.append('videos', formData.liveVideoBlob, 'live_video.mp4');
// //             if (formData.goproBlob instanceof Blob || formData.goproBlob instanceof File) apiData.append('videos', formData.goproBlob, 'gopro_video.mp4');
// //             if (formData.selfieBlob instanceof Blob) apiData.append('selfie', formData.selfieBlob, 'selfie.jpg');

// //             const config = { headers: { 'Content-Type': 'multipart/form-data' } };
// //             let response = formData.id ? await axios.put(`${API_BASE}/surveys/${formData.id}`, apiData, config) : await axios.post(`${API_BASE}/surveys`, apiData, config);

// //             if (response.data.success) { 
// //                 alert("Saved Successfully!"); 
// //                 setShowSurveyForm(false); 
// //                 setEditingSurvey(null); 
// //                 setTimeout(() => { refreshData(); }, 500); 
// //             }
// //         } catch (e) { console.error("FULL ERROR:", e); alert(`Failed to save: ${e.response?.data?.message || e.message}`); }
// //     };

// //     const handleDeleteSurvey = async (id) => {
// //         if(window.confirm("Admin: Permanently delete this record?")) {
// //             try { await axios.delete(`${API_BASE}/surveys/${id}/cancel`); refreshData(); } catch (e) { console.error(e); alert("Failed to delete."); }
// //         }
// //     };

// //     const fetchBackendFile = async (path, mode = 'open') => {
// //         try { const response = await axios.get(`${API_BASE}/surveys/read-file?path=${encodeURIComponent(path)}&mode=${mode}&t=${Date.now()}`, { responseType: 'blob' }); return response.data; } 
// //         catch (error) { console.error("File Fetch Error:", error); return null; }
// //     };

// //     // --- VIEW MEDIA HANDLER ---
// //     const handleViewMedia = (type, survey) => {
// //         let mediaUrl = null;
// //         let ext = 'jpg';

// //         // Direct access to mapped properties from refreshData
// //         if(type === 'video') { mediaUrl = survey.liveVideo; ext = 'mp4'; }
// //         else if(type === 'gopro') { mediaUrl = survey.goproVideo; ext = 'mp4'; }
// //         else if(type === 'photo') { mediaUrl = survey.sitePhoto; ext = 'jpg'; }

// //         if (mediaUrl) {
// //             setCurrentMedia({ 
// //                 type, 
// //                 url: mediaUrl, 
// //                 filename: `file.${ext}`, 
// //                 meta: survey 
// //             });
// //         } else {
// //             alert(`No ${type} found for this survey.`);
// //         }
// //     };

// //     const handleDirectDownload = async () => {
// //         if (!currentMedia || !currentMedia.url) return;
// //         try {
// //             const response = await fetch(currentMedia.url);
// //             const blob = await response.blob();
// //             saveAs(blob, `${getDetailedFilename()}.${(currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg'}`);
// //         } catch(e) { console.error("Download failed", e); }
// //     };

// //     const handleDownloadZip = async () => {
// //         if (!currentMedia || !currentMedia.url) return;
// //         try {
// //             const response = await fetch(currentMedia.url);
// //             const blob = await response.blob();
// //             const zip = new JSZip(); 
// //             const ext = (currentMedia.type === 'video' || currentMedia.type === 'gopro') ? 'mp4' : 'jpg'; 
// //             const finalName = getDetailedFilename();
// //             zip.file(`${finalName}.${ext}`, blob); 
// //             zip.file("details.txt", `Filename: ${finalName}\nSurveyor: ${currentMedia.meta.surveyorName}`);
// //             saveAs(await zip.generateAsync({type:"blob"}), `${finalName}.zip`);
// //         } catch(e) { console.error("Zip failed", e); }
// //     };

// //     const handleGoProUpload = async (e) => {
// //         const file = e.target.files[0]; if (!file || !uploadModalId) return;
// //         const formData = new FormData(); formData.append('videos', file, 'gopro_video.mp4'); 
// //         try { await axios.put(`${API_BASE}/surveys/${uploadModalId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); alert("GoPro Uploaded Successfully!"); setUploadModalId(null); refreshData(); } 
// //         catch (error) { console.error("Upload failed", error); alert("Upload Failed"); }
// //     };

// //     const getDetailedFilename = () => {
// //         if (!currentMedia || !currentMedia.meta) return 'BSNL_Download';
// //         const { district, block, locationType, shotNumber, dateTime } = currentMedia.meta;
// //         return `${(district||'UNK').substring(0,3).toUpperCase()}_${(block||'UNK').substring(0,3).toUpperCase()}_${TYPE_CODES[locationType]||"OTH"}_SHOTNO${shotNumber||'1'}_${getBSNLTimestamp(dateTime)}`;
// //     };

// //     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
// //     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
// //     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime()+86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

// //     const styles = {
// //         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
// //         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
// //         controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// //         headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
// //         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
// //         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
// //         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// //         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// //         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
// //         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
// //         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
// //         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
// //         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
// //         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
// //         downloadBtn: { flex:1, padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', textAlign:'center', textDecoration:'none', fontSize:'14px' },
// //         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
// //         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
// //         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' },
// //         adminCard: { background:'#fff', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.05)' },
// //         adminHeader: { background:'#f5f5f5', padding:'10px 15px', borderBottom:'1px solid #ddd', fontWeight:'bold', color:'#333' }
// //     };

// //     return (
// //         <div style={styles.container}>
// //             <div style={styles.header}>
// //                 <div style={styles.headerLeft}>
// //                     <strong style={{fontSize:'20px'}}>GIS</strong>
// //                     <span style={styles.badge}>{(role || 'USER').toUpperCase()}</span>
// //                     <select style={styles.select} value={selectedDistrict} onChange={e=>setSelectedDistrict(e.target.value)}><option value="">District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// //                     <select style={styles.select} value={selectedBlock} onChange={e=>setSelectedBlock(e.target.value)}><option value="">Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// //                     <select style={styles.select} value={selectedSpan} onChange={e=>setSelectedSpan(e.target.value)}><option value="">Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
// //                     <select style={styles.select} value={selectedRing} onChange={e=>setSelectedRing(e.target.value)}><option value="">Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
// //                 </div>
// //                 <div style={styles.controls}>
// //                     <button onClick={() => { setEditingSurvey(null); setIsViewMode(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
// //                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
// //                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
// //                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
// //                 </div>
// //             </div>

// //             <MapContainer center={mapCenter} zoom={mapZoom} style={{ flex: 1 }}>
// //                 <MapUpdater center={mapCenter} zoom={mapZoom} />
// //                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
// //                 <LayersControl position="topright">
// //                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
// //                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
// //                 </LayersControl>
// //                 {startPoint && <MapUpdater center={startPoint} zoom={13} />}
// //                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
// //                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
// //                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
// //                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
// //                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
// //                 {submittedSurveys.map(s => s.latitude && (
// //                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
// //                         <Popup minWidth={250}>
// //                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
// //                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
// //                                 <div><b>File:</b> {s.generatedFileName}</div>
// //                                 <div><b>Route:</b> {s.routeName}</div>
// //                                 <div style={{marginTop:'10px'}}>
// //                                     {s.liveVideo && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
// //                                     {s.sitePhoto && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// //                                 </div>
// //                             </div>
// //                         </Popup>
// //                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
// //                             <div style={{textAlign:'left', minWidth: '150px'}}>
// //                                 {isRecent(s.survey_date) && <div style={{background:'#e65100', color:'white', fontSize:'10px', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginBottom:'5px', fontWeight:'bold'}}>RECENT</div>}
// //                                 <div style={{fontWeight:'bold', fontSize:'13px', color: '#1a237e'}}>{s.locationType}</div>
// //                                 <div style={{fontSize:'12px', fontWeight:'bold', color:'#007bff', margin: '2px 0'}}>{s.generatedFileName || "No Filename"}</div>
// //                                 <div style={{fontSize:'11px', color:'#333'}}>Route: {s.routeName}</div>
// //                                 <div style={{fontSize:'11px', color:'#555'}}>Date: {getBSNLTimestamp(s.survey_date)}</div>
// //                                 <div style={{marginTop:'6px', paddingTop:'4px', borderTop:'1px solid #eee', display:'flex', gap:'8px', fontSize:'11px', fontWeight:'bold'}}>
// //                                     {s.sitePhoto && <span style={{color:'#2e7d32'}}>[Photo]</span>}
// //                                     {s.liveVideo && <span style={{color:'#d32f2f'}}>[Video]</span>}
// //                                     {s.goproVideo && <span style={{color:'#1565c0'}}>[GoPro]</span>}
// //                                 </div>
// //                             </div>
// //                         </Tooltip>
// //                     </Marker>
// //                 ))}
// //                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
// //             </MapContainer>

// //             {showSurveyForm && (
// //                 <SurveyForm 
// //                     onClose={() => { setShowSurveyForm(false); refreshData(); }} 
// //                     pickedCoords={pickedCoords} 
// //                      districts={visibleDistricts} 
// //                      blocks={Object.values(DATA_HIERARCHY.blocks)} 
// //                      onSubmitData={handleSurveySubmit} 
// //                     user={user} 
// //                      onPickLocation={handlePickLocationStart} 
// //                     initialData={editingSurvey} 
// //                     viewOnly={isViewMode}
// //                 />
// //             )}

// //             {showSurveyTable && (
// //                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
// //                     <div style={styles.filterBox}>
// //                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
// //                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
// //                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
// //                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
// //                     </div>

// //                     <table style={styles.table}>
// //                         <thead>
// //                             <tr style={{textAlign:'left', background:'#f9f9f9'}}>
// //                                 <th style={styles.th}>Filename</th>
// //                                 <th style={styles.th}>User / Role</th>
// //                                 <th style={styles.th}>Shot</th>
// //                                 <th style={styles.th}>Type</th>
// //                                 <th style={styles.th}>Last Mod.</th>
// //                                 <th style={styles.th}>Media</th>
// //                                 <th style={styles.th}>Action</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {filteredSurveys.map(s => {
// //                                 const justEdited = isJustUpdated(s.lastModifiedTime);
// //                                 const rowStyle = {
// //                                     borderBottom: '1px solid #f0f0f0',
// //                                     backgroundColor: justEdited ? '#e8f5e9' : 'white',
// //                                     transition: 'background-color 0.5s ease'
// //                                 };

// //                                 return (
// //                                     <tr key={s.id} title={`Route: ${s.routeName}`} style={rowStyle}>
// //                                         <td style={styles.td}>
// //                                             <b>{s.generatedFileName}</b>
// //                                             {justEdited && <span style={{marginLeft:'5px', fontSize:'9px', background:'#2e7d32', color:'white', padding:'2px 4px', borderRadius:'3px'}}>UPDATED</span>}
// //                                         </td>
// //                                         <td style={styles.td}>
// //                                             <div style={{fontWeight:'bold', color:'#2A4480', fontSize:'12px'}}>{s.submittedBy}</div>
// //                                             <div style={{fontSize:'10px', color:'#666'}}>{s.submittedBy === 'admin' ? 'Administrator' : 'Surveyor'}</div>
// //                                         </td>
// //                                         <td style={styles.td}>{s.shotNumber}</td>
// //                                         <td style={styles.td}>{s.locationType}</td>
// //                                         <td style={styles.td} style={{fontSize:'11px', color:'#444'}}>{formatTableDate(s.lastModifiedTime)}</td>
// //                                         <td style={styles.td}>
// //                                             {s.liveVideo && <button style={{...styles.actionBtn, color:'green', borderColor:'green', fontSize:'10px'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
// //                                             {s.sitePhoto && <button style={{...styles.actionBtn, color:'green', borderColor:'green', fontSize:'10px'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
// //                                             {s.goproVideo && <button style={{...styles.actionBtn, color:'#1565c0', borderColor:'#1565c0', fontSize:'10px'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button>}
// //                                         </td>
// //                                         <td style={styles.td}>
// //                                             <div style={{display:'flex'}}>
// //                                                 <button style={{...styles.actionBtn, background:'#e3f2fd', color:'#0d47a1', border:'1px solid #0d47a1'}} onClick={()=>{ setEditingSurvey(s); setIsViewMode(true); setShowSurveyTable(false); setShowSurveyForm(true); }}>View</button>
// //                                                 {(role === 'admin' || s.submittedBy === (user?.username || user)) && <button style={{...styles.actionBtn, background:'#fff3e0', color:'#e65100', border:'1px solid #e65100'}} onClick={()=>{ setEditingSurvey(s); setIsViewMode(false); setShowSurveyTable(false); setShowSurveyForm(true); }}>Edit</button>}
// //                                                 {role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}
// //                                             </div>
// //                                         </td>
// //                                     </tr>
// //                                 );
// //                             })}
// //                         </tbody>
// //                     </table>

// //                     <div style={{display:'flex', justifyContent:'flex-end', gap:'10px', padding:'15px', alignItems:'center', borderTop:'1px solid #eee'}}>
// //                         <button style={styles.btnWhite} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt; Prev</button>
// //                         <span style={{fontSize:'13px', fontWeight:'bold'}}>Page {currentPage} of {totalPages}</span>
// //                         <button style={styles.btnWhite} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next &gt;</button>
// //                     </div>
// //                 </ModalWrapper>
// //             )}

// //             {showUserStatus && role === 'admin' && (
// //                 <ModalWrapper title="Admin Logs" onClose={() => setShowUserStatus(false)}>
// //                      {/* ... (Admin Log UI remains same) ... */}
// //                 </ModalWrapper>
// //             )}

// //             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}

// //             {currentMedia && (
// //                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
// //                     <div style={{textAlign:'center', background:'black', padding:'15px', borderRadius:'8px'}}>
// //                         {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (<video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />) : (<img src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />)}
// //                         <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
// //                             <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}</button>
// //                             <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>Download ZIP</button>
// //                         </div>
// //                     </div>
// //                 </ModalWrapper>
// //             )}

// //             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>PICKING MODE ACTIVE - Click map</div>}
// //         </div>
// //     );
// // };

// // export default Dashboard;


// import React, { useState, useEffect, useCallback } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import SurveyForm from './SurveyForm';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver';
// import axios from 'axios';

// // --- ICONS ---
// const DefaultIcon = L.icon({ 
//     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", 
//     shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", 
//     iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] 
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// const SurveyIcon = L.divIcon({ 
//     className: 'custom-survey-icon', 
//     html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>', 
//     iconSize: [16, 16] 
// });

// // --- CONSTANTS ---
// // FIX: Hardcoded to Cloud to ensure images load
// const API_BASE = 'https://gis-backend-9ajk.onrender.com';

// const DISTRICT_COORDS = { "Ambedkar Nagar": [26.4416, 82.5925], "Ayodhya": [26.7992, 82.2023], "Azamgarh": [26.0669, 83.1861], "Ballia": [25.8398, 84.1523], "Balrampur": [27.4265, 82.1760], "Banda": [25.4800, 80.3340], "Barabanki": [26.9388, 81.1912], "Basti": [26.7937, 82.4700], "Bhadohi": [25.3941, 82.5709], "Deoria": [26.5056, 83.7780], "Ghazipur": [25.5794, 83.5684], "Gonda": [27.1303, 81.9669], "Gorakhpur": [26.7606, 83.3732], "Kushi Nagar": [26.9031, 83.8967], "Maharajganj": [27.1437, 83.5645], "Mau": [25.9452, 83.5599], "Mirzapur": [25.1337, 82.5644], "Sant Kabeer Nagar": [26.7329, 83.0261], "Siddharth Nagar": [27.2848, 82.7845], "Varanasi": [25.3176, 82.9739] };
// const DATA_HIERARCHY = { blocks: { "Ambedkar Nagar": ["Bhiti", "Ram Nagar", "Baskhari", "Bhiyawan", "Jahangir Ganj", "Jalal Pur", "Katehari", "Tanda"], "Ayodhya": ["Bikapur", "Pura Bazar", "Amaniganj", "Hariyangatanganj", "Mawai", "Milkipur", "Rudauli", "Sohawal", "Tarun"], "Azamgarh": ["Mehnagar", "Azmatgarh", "Jahanaganj", "Rani Ki Sarai", "Lalganj", "Mahrajganj", "Palhani", "Mirzapur", "Tahbarpur", "Ahiraula", "Haraiya", "Martinganj", "Mohammadpur", "Palhana", "Pawai", "Thekma", "Bilariyaganj", "Sathiyaon", "Tarwa", "Phulpur"], "Ballia": ["Garwar", "Bansdih", "Chilkahar", "Dubhar", "Maniar", "Reoti", "Belhari", "Beruarbari", "Hanumanganj", "Navanagar", "Rasra", "Sohanv", "Siar"], "Balrampur": ["Shriduttganj", "Balrampur", "Pachpedwa", "Harriya Satgharwa", "Raheera Bazaar", "Gaindas Bujurg", "Utraula", "Tulsipur", "Gasiri"], "Banda": ["Bisanda", "Tindwari", "Badokhar Khurd"], "Barabanki": ["Suratganj", "Ramnagar", "Sirauli Gauspur", "Bani Kodar", "Haidargarh", "Nindaura", "Puredalai", "Trivediganj"], "Basti": ["Saltaua Gopal Pur", "Bahadurpur", "Basti", "Dubauliya", "Gaur", "Harraiya", "Kaptanganj", "Bankati", "Kudraha", "Paras Rampur", "Rudauli", "Sau Ghat", "Ramnagar", "Vikram Jot"], "Bhadohi": ["Aurai"], "Deoria": ["Bhatni", "Baitalpur", "Bankata", "Barhaj", "Bhaluani", "Bhatpar Rani", "Deoria Sadar", "Desai Deoria", "Gauri Bazar", "Lar", "Pathar Dewa", "Rampur Karkhana", "Rudrapur", "Salempur", "Tarkalua", "Bhagalpur"], "Ghazipur": ["Mohammadabad", "Virno"], "Gonda": ["Mankapur", "Haldharmau", "Babhanjot", "Belsar", "Chhapia", "Colonelganj", "Itiyathok", "Jhanjhari", "Katra Bazar", "Mujehana", "Pandri Kripal", "Paraspur", "Rupaideeh", "Tarabganj", "Nawabganj", "Wazirganj"], "Gorakhpur": ["Khorabar", "Pali", "Pipraich", "Brahmpur", "Sardarngar", "Bharohiya", "Bhathat", "Campierganj", "Chargawan", "Gagaha", "Gola", "Jangal Kaudia", "Kauri Ram", "Khajni", "Piprauli", "Sahjanawa", "Uruwa"], "Kushi Nagar": ["Dudhahi", "Fazilnagar", "Hata", "Kaptainganj", "Kasaya", "Khadda", "Motichak", "Nebua Naurangia", "Padrauna", "Ramkola", "Seorahi", "Sukrauli", "Tamkuhiraj", "Vishunpura"], "Maharajganj": ["Dhani", "Ghughli", "Lakshmipur", "Brijmanganj", "Mithaura", "Nautanwa", "Nichlaul", "Pharenda", "Mahrajganj", "Paniyara", "Partawal", "Siswa"], "Mau": ["Atraulia", "Dohari Ghat", "Pardaha", "Badraon", "Fatehpur Madaun", "Ghosi", "Kopaganj", "Mohammadabad Gohana", "Ratanpura"], "Mirzapur": ["Lalganj"], "Sant Kabeer Nagar": ["Baghauli", "Belhar Kala", "Hainsar Bazar", "Khalilabad", "Mehdawal", "Nath Nagar", "Pauli", "Santha", "Semariyawan"], "Siddharth Nagar": ["Barhni", "Bansi", "Itwa", "Lotan", "Shohartgarh", "Ranipur", "Birdpur", "Bhanwapur", "Jogia", "Khesraha", "Khuniyaon", "Mithwal", "Naugarh", "Uska Bazar"], "Varanasi": ["Baragaon", "Arajiline", "Harahua", "Pindra", "Sevapuri"] }, spans: {}, rings: {} };
// const TYPE_CODES = { "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM", "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP", "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH" };

// // --- HELPERS ---
// const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
// const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };
// const getSessionDuration = (str) => { if (!str) return '-'; const diff = new Date() - new Date(str); return `${Math.floor(diff/60000)} mins`; };
// const isRecent = (timestamp) => { if (!timestamp) return false; const now = new Date(); const diffHours = Math.abs(now - new Date(timestamp)) / 36e5; return diffHours < 24; };
// const isJustUpdated = (dateString) => { if (!dateString) return false; const now = new Date(); const diffMins = (now - new Date(dateString)) / 60000; return diffMins < 15 && diffMins >= 0; };
// const formatTableDate = (dateString) => { if (!dateString) return '-'; return new Date(dateString).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }); };
// const getBSNLTimestamp = (dateString) => { const d = dateString ? new Date(dateString) : new Date(); return `${String(d.getDate()).padStart(2,'0')}${String(d.getMonth()+1).padStart(2,'0')}${d.getFullYear()}`; };

// // --- COMPONENTS ---
// const ModalWrapper = ({ children, title, onClose }) => ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight:'90vh', overflow:'hidden' }}> <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 20px', borderBottom:'1px solid #eee', background:'#fff'}}> <h3 style={{margin:0, color:'#2A4480', fontSize:'18px'}}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight:'bold', fontSize:'12px' }}>CLOSE</button> </div> <div style={{flex:1, overflowY:'auto', padding:'20px'}}>{children}</div> </div> </div> );
// const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el=document.querySelector('.leaflet-container'); if(el) el.style.cursor=isPicking?'crosshair':'grab'; }, [isPicking]); return null; };
// const MapUpdater = ({ center, zoom }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, zoom || 13, { duration: 1.5 }); }, [center, zoom, map]); return null; };

// const Dashboard = ({ user, role, onLogout, logAction }) => {
//     const [selectedDistrict, setSelectedDistrict] = useState(''); const [selectedBlock, setSelectedBlock] = useState(''); const [selectedSpan, setSelectedSpan] = useState(''); const [selectedRing, setSelectedRing] = useState('');
//     const [mapCenter, setMapCenter] = useState([26.8467, 80.9462]); const [mapZoom, setMapZoom] = useState(7);
//     const [currentPage, setCurrentPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
//     const [startPoint, setStartPoint] = useState(null); const [endPoint, setEndPoint] = useState(null); const [displayPath, setDisplayPath] = useState([]); const [isRingView, setIsRingView] = useState(false); const [diggingPoints, setDiggingPoints] = useState([]);
//     const [submittedSurveys, setSubmittedSurveys] = useState([]); const [filteredSurveys, setFilteredSurveys] = useState([]); const [userRoutes, setUserRoutes] = useState([]);
//     const [userStatuses, setUserStatuses] = useState([]); const [logs, setLogs] = useState([]);
//     const [showSurveyForm, setShowSurveyForm] = useState(false); const [editingSurvey, setEditingSurvey] = useState(null); const [isViewMode, setIsViewMode] = useState(false);
//     const [isPickingLocation, setIsPickingLocation] = useState(false); const [pickedCoords, setPickedCoords] = useState(null); const [showSurveyTable, setShowSurveyTable] = useState(false); const [showUserStatus, setShowUserStatus] = useState(false); const [currentMedia, setCurrentMedia] = useState(null); const [uploadModalId, setUploadModalId] = useState(null);
//     const [searchDist, setSearchDist] = useState(''); const [searchBlock, setSearchBlock] = useState(''); const [searchGeneric, setSearchGeneric] = useState(''); const [searchDateFrom, setSearchDateFrom] = useState(''); const [searchDateTo, setSearchDateTo] = useState(''); const [filterStart, setFilterStart] = useState(''); const [filterEnd, setFilterEnd] = useState('');

//     const visibleDistricts = Object.keys(DATA_HIERARCHY.blocks).sort(); const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : []; const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : []; const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

//     useEffect(() => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition((pos) => { setMapCenter([pos.coords.latitude, pos.coords.longitude]); setMapZoom(12); }, (err) => console.warn("Loc denied")); } }, []);
//     useEffect(() => { if (selectedDistrict && DISTRICT_COORDS[selectedDistrict]) { setMapCenter(DISTRICT_COORDS[selectedDistrict]); setMapZoom(10); } }, [selectedDistrict]);
//     useEffect(() => { if (selectedBlock && selectedDistrict) { axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${selectedBlock}, ${selectedDistrict}, Uttar Pradesh, India`)}`).then(res => { if(res.data.length > 0) { setMapCenter([parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]); setMapZoom(13); } }); } }, [selectedBlock, selectedDistrict]);

//     const applyFilters = useCallback((data) => {
//         let filtered = data;
//         if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
//         if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
//         if (searchGeneric) { const term = searchGeneric.toLowerCase(); filtered = filtered.filter(s => (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) || (s.routeName && s.routeName.toLowerCase().includes(term))); }
//         if (searchDateFrom && searchDateTo) { const from = new Date(searchDateFrom).setHours(0,0,0,0); const to = new Date(searchDateTo).setHours(23,59,59,999); filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; }); }
//         setFilteredSurveys(filtered);
//     }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

//     // --- REFRESH DATA (FIXED URL AND MAPPING) ---
//     const refreshData = useCallback(async () => {
//         try {
//             const response = await axios.get(`${API_BASE}/surveys/all`, { params: { page: currentPage, limit: 10 } });
//             const { surveys, pagination } = response.data;
//             if (Array.isArray(surveys)) {
//                 const mergedData = surveys.map(s => {
//                     const mFiles = s.mediaFiles || [];

//                     // SAFE PROXY URL GENERATOR (Prevents 500 Errors & Fixes Path Issues)
//                     const getProxyUrl = (path) => {
//                         if (!path) return null;
//                         if (path.startsWith('http')) return path;
//                         // Clean the path to remove 'uploads/' prefix if backend stores it
//                         const cleanPath = path.replace(/^uploads[\\/]/, '');
//                         // Append timestamp to bust cache
//                         return `${API_BASE}/surveys/read-file?path=${encodeURIComponent(cleanPath)}&mode=open&t=${Date.now()}`;
//                     };

//                     const getFileName = (f) => (f.filename || f.path || f.url || '').toLowerCase();

//                     // --- VIDEO ALLOCATION STRATEGY ---
//                     let availableVideos = mFiles.filter(f => f.type === 'video' || f.type === 'live_video' || f.type === 'gopro_video' || f.type === 'gopro');
//                     let goproObj = null;
//                     let liveVideoObj = null;

//                     // 1. FIND GOPRO (Remove from pool)
//                     const goproIndex = availableVideos.findIndex(f => f.type === 'gopro' || f.type === 'gopro_video' || getFileName(f).includes('gopro'));
//                     if (goproIndex !== -1) {
//                         goproObj = availableVideos[goproIndex];
//                         availableVideos.splice(goproIndex, 1); 
//                     }

//                     // 2. FIND LIVE VIDEO (Remove from pool)
//                     const liveIndex = availableVideos.findIndex(f => f.type === 'live_video' || getFileName(f).includes('live'));
//                     if (liveIndex !== -1) {
//                         liveVideoObj = availableVideos[liveIndex];
//                         availableVideos.splice(liveIndex, 1);
//                     }

//                     // 3. FALLBACKS
//                     if (!liveVideoObj && availableVideos.length > 0) { liveVideoObj = availableVideos.shift(); }
//                     if (!goproObj && availableVideos.length > 0) { goproObj = availableVideos.shift(); }

//                     // --- OTHER MEDIA ---
//                     const sitePhotoObj = mFiles.find(f => f.type === 'photo' || f.type === 'site_photo');
//                     const selfieObj = mFiles.find(f => f.type === 'selfie');

//                     const getPath = (obj) => obj ? (obj.url || obj.path || obj.filename) : null;

//                     return {
//                         ...s,
//                         id: s.id,
//                         routeName: s.routeName || s.route_name,
//                         locationType: s.locationType || s.location_type,
//                         shotNumber: s.shotNumber || s.shot_number,
//                         ringNumber: s.ringNumber || s.ring_number,
//                         startLocName: s.startLocName || s.start_location,
//                         endLocName: s.endLocName || s.end_location,
//                         surveyorName: s.surveyor_name,
//                         surveyorMobile: s.surveyor_mobile,
//                         dateTime: s.survey_date,
//                         submittedBy: s.submittedBy || s.submitted_by || 'Unknown',
//                         lastModifiedTime: s.updated_at || s.updatedAt || s.created_at || s.survey_date,
//                         generatedFileName: s.generated_filename || `SURVEY_${s.id}`,
//                         latitude: parseFloat(s.latitude || 0), longitude: parseFloat(s.longitude || 0),

//                         sitePhoto: getPath(sitePhotoObj) ? getProxyUrl(getPath(sitePhotoObj)) : null,
//                         liveVideo: getPath(liveVideoObj) ? getProxyUrl(getPath(liveVideoObj)) : null,
//                         goproVideo: getPath(goproObj) ? getProxyUrl(getPath(goproObj)) : null,
//                         selfie: getPath(selfieObj) ? getProxyUrl(getPath(selfieObj)) : null,

//                         mediaFiles: mFiles
//                     };
//                 });
//                 setSubmittedSurveys(mergedData.sort((a, b) => new Date(b.lastModifiedTime) - new Date(a.lastModifiedTime)));
//                 applyFilters(mergedData);
//                 if (pagination) setTotalPages(pagination.totalPages);
//                 const lines = []; mergedData.forEach(s => { if (['HDD Start Point', 'HDD End Point'].includes(s.locationType)) { const lat = parseFloat(s.latitude); const lng = parseFloat(s.longitude); if (lat && lng) lines.push({ start: {lat, lng}, end: {lat: lat+0.0001, lng: lng+0.0001}, name: s.routeName }); } }); setUserRoutes(lines);
//             }
//         } catch(e) { console.error("Fetch Error", e); }
//     }, [applyFilters, currentPage]);

//     useEffect(() => { refreshData(); if (role === 'admin') { setUserStatuses([{ username: 'admin', status: 'Online', loginTime: new Date().toISOString() }]); setLogs([{ displayTime: new Date().toLocaleString(), username: 'admin', action: 'LOGIN', details: 'System Access' }]); } }, [refreshData, role]);

//     const handleSurveySubmit = async (formData) => {
//         if (!formData || !formData.district) { alert("District is required"); return; }
//         try {
//             const apiData = new FormData();
//             const append = (key, value) => { if (value !== null && value !== undefined && value !== '') apiData.append(key, value); };
//             append('district', formData.district); append('block', formData.block); append('routeName', formData.routeName);
//             append('locationType', formData.locationType); append('shotNumber', formData.shotNumber || '0'); append('ringNumber', formData.ringNumber || '0');
//             append('startLocName', formData.startLocName); append('endLocName', formData.endLocName); append('fileNamePrefix', formData.generatedFileName);
//             append('surveyorName', formData.surveyorName); append('surveyorMobile', formData.surveyorMobile); 
//             append('submittedBy', (user && user.username) ? user.username : (typeof user === 'string' ? user : 'admin'));
//             append('dateTime', formData.dateTime || new Date().toISOString()); append('latitude', formData.latitude); append('longitude', formData.longitude);
//             append('remarks', formData.remarks || '');

//             if (formData.sitePhotoBlob instanceof Blob) apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');
//             if (formData.liveVideoBlob instanceof Blob) apiData.append('videos', formData.liveVideoBlob, 'live_video.mp4');
//             if (formData.goproBlob instanceof Blob || formData.goproBlob instanceof File) apiData.append('videos', formData.goproBlob, 'gopro_video.mp4');
//             if (formData.selfieBlob instanceof Blob) apiData.append('selfie', formData.selfieBlob, 'selfie.jpg');

//             const config = { headers: { 'Content-Type': 'multipart/form-data' } };
//             let response = formData.id ? await axios.put(`${API_BASE}/surveys/${formData.id}`, apiData, config) : await axios.post(`${API_BASE}/surveys`, apiData, config);
//             if (response.data.success) { alert("Saved Successfully!"); setShowSurveyForm(false); setEditingSurvey(null); setTimeout(() => { refreshData(); }, 500); }
//         } catch (e) { console.error("FULL ERROR:", e); alert(`Failed to save: ${e.response?.data?.message || e.message}`); }
//     };

//     const handleDeleteSurvey = async (id) => { if(window.confirm("Admin: Permanently delete this record?")) { try { await axios.delete(`${API_BASE}/surveys/${id}/cancel`); refreshData(); } catch (e) { console.error(e); alert("Failed to delete."); } } };

//     // --- VIEW MEDIA HANDLER ---
//     const handleViewMedia = (type, survey) => {
//         let mediaUrl = null; let ext = 'jpg';
//         if(type === 'video') { mediaUrl = survey.liveVideo; ext = 'mp4'; }
//         else if(type === 'gopro') { mediaUrl = survey.goproVideo; ext = 'mp4'; }
//         else if(type === 'photo') { mediaUrl = survey.sitePhoto; ext = 'jpg'; }

//         if (mediaUrl) { setCurrentMedia({ type, url: mediaUrl, filename: `file.${ext}`, meta: survey }); } 
//         else { alert(`No ${type} found for this survey.`); }
//     };

//     const handleDirectDownload = async () => { if (!currentMedia || !currentMedia.url) return; try { const response = await fetch(currentMedia.url); const blob = await response.blob(); saveAs(blob, `${currentMedia.meta.generatedFileName}_${currentMedia.type}.${(currentMedia.type.includes('video')||currentMedia.type.includes('gopro')) ? 'mp4' : 'jpg'}`); } catch(e) { console.error("Download failed", e); } };
//     const handleDownloadZip = async () => { if (!currentMedia || !currentMedia.url) return; try { const response = await fetch(currentMedia.url); const blob = await response.blob(); const zip = new JSZip(); const ext = (currentMedia.type.includes('video')||currentMedia.type.includes('gopro')) ? 'mp4' : 'jpg'; zip.file(`${currentMedia.meta.generatedFileName}.${ext}`, blob); zip.file("details.txt", `Filename: ${currentMedia.meta.generatedFileName}\nSurveyor: ${currentMedia.meta.surveyorName}`); saveAs(await zip.generateAsync({type:"blob"}), `${currentMedia.meta.generatedFileName}.zip`); } catch(e) { console.error("Zip failed", e); } };
//     const handleGoProUpload = async (e) => { const file = e.target.files[0]; if (!file || !uploadModalId) return; const formData = new FormData(); formData.append('videos', file, 'gopro_video.mp4'); try { await axios.put(`${API_BASE}/surveys/${uploadModalId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); alert("GoPro Uploaded Successfully!"); setUploadModalId(null); refreshData(); } catch (error) { console.error("Upload failed", error); alert("Upload Failed"); } };
//     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
//     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
//     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime()+86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

//     const styles = {
//         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width:'100vw', fontFamily: 'Arial, sans-serif', overflow:'hidden', position:'fixed', top:0, left:0 },
//         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', zIndex:2000, gap:'20px', overflowX:'auto', whiteSpace:'nowrap', flexShrink:0 },
//         controls: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
//         headerLeft: { display:'flex', gap:'10px', alignItems:'center', flexShrink:0 },
//         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border:'1px solid #ccc', background:'white', fontSize:'13px', cursor:'pointer' },
//         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
//         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
//         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
//         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'12px', whiteSpace:'nowrap' },
//         table: { width: '100%', borderCollapse: 'collapse', fontSize:'13px' },
//         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color:'#555', fontWeight:'bold' },
//         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color:'#333' },
//         actionBtn: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc', background:'white', cursor:'pointer', marginRight:'5px', fontSize:'12px', fontWeight:'bold' },
//         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
//         downloadBtn: { flex:1, padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', cursor:'pointer', border:'none', color:'white', textAlign:'center', textDecoration:'none', fontSize:'14px' },
//         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor:'pointer' },
//         filterBox: {display:'flex', gap:'10px', marginBottom:'15px', background:'#f5f5f5', padding:'15px', borderRadius:'6px', flexWrap:'wrap', alignItems:'center', border:'1px solid #e0e0e0'},
//         searchInput: { padding: '8px 12px', borderRadius: '4px', border:'1px solid #ccc', minWidth:'180px' },
//         adminCard: { background:'#fff', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.05)' },
//         adminHeader: { background:'#f5f5f5', padding:'10px 15px', borderBottom:'1px solid #ddd', fontWeight:'bold', color:'#333' }
//     };

//     return (
//         <div style={styles.container}>
//             <div style={styles.header}>
//                 <div style={styles.headerLeft}>
//                     <strong style={{fontSize:'20px'}}>GIS</strong>
//                     <span style={styles.badge}>{(role || 'USER').toUpperCase()}</span>
//                     <select style={styles.select} value={selectedDistrict} onChange={e=>setSelectedDistrict(e.target.value)}><option value="">District</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
//                     <select style={styles.select} value={selectedBlock} onChange={e=>setSelectedBlock(e.target.value)}><option value="">Block</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
//                     <select style={styles.select} value={selectedSpan} onChange={e=>setSelectedSpan(e.target.value)}><option value="">Span</option>{spanOptions.map(s=><option key={s}>{s}</option>)}</select>
//                     <select style={styles.select} value={selectedRing} onChange={e=>setSelectedRing(e.target.value)}><option value="">Ring</option>{ringOptions.map(r=><option key={r}>{r}</option>)}</select>
//                 </div>
//                 <div style={styles.controls}>
//                     <button onClick={() => { setEditingSurvey(null); setIsViewMode(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
//                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
//                     {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
//                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
//                 </div>
//             </div>

//             <MapContainer center={mapCenter} zoom={mapZoom} style={{ flex: 1 }}>
//                 <MapUpdater center={mapCenter} zoom={mapZoom} />
//                 <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
//                 <LayersControl position="topright">
//                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
//                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
//                 </LayersControl>
//                 {startPoint && <MapUpdater center={startPoint} zoom={13} />}
//                 {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
//                 {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
//                 {userRoutes.map((route, idx) => ( <Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline> ))}
//                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
//                 {submittedSurveys.map(s => s.latitude && (
//                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
//                         <Popup minWidth={250}>
//                             <div style={{fontSize:'13px', lineHeight:'1.6'}}>
//                                 <div style={{background:'#1a237e', color:'white', padding:'5px 10px', borderRadius:'4px', fontWeight:'bold', marginBottom:'8px'}}>{s.locationType}</div>
//                                 <div><b>File:</b> {s.generatedFileName}</div>
//                                 <div><b>Route:</b> {s.routeName}</div>
//                                 <div style={{marginTop:'10px'}}>
//                                     {s.liveVideo && <button style={{...styles.actionBtn, background:'#e65100', color:'white'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
//                                     {s.sitePhoto && <button style={{...styles.actionBtn, background:'#2e7d32', color:'white'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
//                                 </div>
//                             </div>
//                         </Popup>
//                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
//                             <div style={{textAlign:'left', minWidth: '150px'}}>
//                                 {isRecent(s.survey_date) && <div style={{background:'#e65100', color:'white', fontSize:'10px', padding:'2px 5px', borderRadius:'3px', display:'inline-block', marginBottom:'5px', fontWeight:'bold'}}>RECENT</div>}
//                                 <div style={{fontWeight:'bold', fontSize:'13px', color: '#1a237e'}}>{s.locationType}</div>
//                                 <div style={{fontSize:'12px', fontWeight:'bold', color:'#007bff', margin: '2px 0'}}>{s.generatedFileName || "No Filename"}</div>
//                                 <div style={{fontSize:'11px', color:'#333'}}>Route: {s.routeName}</div>
//                                 <div style={{fontSize:'11px', color:'#555'}}>Date: {getBSNLTimestamp(s.survey_date)}</div>
//                                 <div style={{marginTop:'6px', paddingTop:'4px', borderTop:'1px solid #eee', display:'flex', gap:'8px', fontSize:'11px', fontWeight:'bold'}}>
//                                     {s.sitePhoto && <span style={{color:'#2e7d32'}}>[Photo]</span>}
//                                     {s.liveVideo && <span style={{color:'#d32f2f'}}>[Video]</span>}
//                                     {s.goproVideo && <span style={{color:'#1565c0'}}>[GoPro]</span>}
//                                 </div>
//                             </div>
//                         </Tooltip>
//                     </Marker>
//                 ))}
//                 {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
//             </MapContainer>

//             {showSurveyForm && (
//                 <SurveyForm 
//                     onClose={() => { setShowSurveyForm(false); refreshData(); }} 
//                     pickedCoords={pickedCoords} 
//                      districts={visibleDistricts} 
//                      blocks={Object.values(DATA_HIERARCHY.blocks)} 
//                      onSubmitData={handleSurveySubmit} 
//                     user={user} 
//                      onPickLocation={handlePickLocationStart} 
//                     initialData={editingSurvey} 
//                     viewOnly={isViewMode}
//                 />
//             )}

//             {showSurveyTable && (
//                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
//                     <div style={styles.filterBox}>
//                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e=>setSearchGeneric(e.target.value)} />
//                         <select style={styles.select} onChange={e=>setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d=><option key={d}>{d}</option>)}</select>
//                         <select style={styles.select} onChange={e=>setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b=><option key={b}>{b}</option>)}</select>
//                         <input type="date" style={styles.select} onChange={e=>setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e=>setSearchDateTo(e.target.value)} />
//                     </div>

//                     <table style={styles.table}>
//                         <thead>
//                             <tr style={{textAlign:'left', background:'#f9f9f9'}}>
//                                 <th style={styles.th}>Filename</th>
//                                 <th style={styles.th}>User / Role</th>
//                                 <th style={styles.th}>Shot</th>
//                                 <th style={styles.th}>Type</th>
//                                 <th style={styles.th}>Last Mod.</th>
//                                 <th style={styles.th}>Media</th>
//                                 <th style={styles.th}>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredSurveys.map(s => {
//                                 const justEdited = isJustUpdated(s.lastModifiedTime);
//                                 const rowStyle = {
//                                     borderBottom: '1px solid #f0f0f0',
//                                     backgroundColor: justEdited ? '#e8f5e9' : 'white',
//                                     transition: 'background-color 0.5s ease'
//                                 };

//                                 return (
//                                     <tr key={s.id} title={`Route: ${s.routeName}`} style={rowStyle}>
//                                         <td style={styles.td}>
//                                             <b>{s.generatedFileName}</b>
//                                             {justEdited && <span style={{marginLeft:'5px', fontSize:'9px', background:'#2e7d32', color:'white', padding:'2px 4px', borderRadius:'3px'}}>UPDATED</span>}
//                                         </td>
//                                         <td style={styles.td}>
//                                             <div style={{fontWeight:'bold', color:'#2A4480', fontSize:'12px'}}>{s.submittedBy}</div>
//                                             <div style={{fontSize:'10px', color:'#666'}}>{s.submittedBy === 'admin' ? 'Administrator' : 'Surveyor'}</div>
//                                         </td>
//                                         <td style={styles.td}>{s.shotNumber}</td>
//                                         <td style={styles.td}>{s.locationType}</td>
//                                         <td style={styles.td} style={{fontSize:'11px', color:'#444'}}>{formatTableDate(s.lastModifiedTime)}</td>
//                                         <td style={styles.td}>
//                                             {s.liveVideo && <button style={{...styles.actionBtn, color:'green', borderColor:'green', fontSize:'10px'}} onClick={() => handleViewMedia('video', s)}>Video</button>}
//                                             {s.sitePhoto && <button style={{...styles.actionBtn, color:'green', borderColor:'green', fontSize:'10px'}} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
//                                             {s.goproVideo && <button style={{...styles.actionBtn, color:'#1565c0', borderColor:'#1565c0', fontSize:'10px'}} onClick={() => handleViewMedia('gopro', s)}>GoPro</button>}
//                                         </td>
//                                         <td style={styles.td}>
//                                             <div style={{display:'flex'}}>
//                                                 <button style={{...styles.actionBtn, background:'#e3f2fd', color:'#0d47a1', border:'1px solid #0d47a1'}} onClick={()=>{ setEditingSurvey(s); setIsViewMode(true); setShowSurveyTable(false); setShowSurveyForm(true); }}>View</button>
//                                                 {(role === 'admin' || s.submittedBy === (user?.username || user)) && <button style={{...styles.actionBtn, background:'#fff3e0', color:'#e65100', border:'1px solid #e65100'}} onClick={()=>{ setEditingSurvey(s); setIsViewMode(false); setShowSurveyTable(false); setShowSurveyForm(true); }}>Edit</button>}
//                                                 {role === 'admin' && <button style={{...styles.actionBtn, color:'red', borderColor:'red'}} onClick={()=>handleDeleteSurvey(s.id)}>Del</button>}
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>

//                     <div style={{display:'flex', justifyContent:'flex-end', gap:'10px', padding:'15px', alignItems:'center', borderTop:'1px solid #eee'}}>
//                         <button style={styles.btnWhite} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt; Prev</button>
//                         <span style={{fontSize:'13px', fontWeight:'bold'}}>Page {currentPage} of {totalPages}</span>
//                         <button style={styles.btnWhite} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next &gt;</button>
//                     </div>
//                 </ModalWrapper>
//             )}

//             {showUserStatus && role === 'admin' && (
//                 <ModalWrapper title="Admin Logs" onClose={() => setShowUserStatus(false)}>
//                      {/* ... (Admin Log UI remains same) ... */}
//                 </ModalWrapper>
//             )}

//             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={()=>setUploadModalId(null)}><div style={{padding:'20px'}}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}

//             {currentMedia && (
//                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
//                     <div style={{textAlign:'center', background:'black', padding:'15px', borderRadius:'8px'}}>
//                         {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (<video src={currentMedia.url} controls style={{width:'100%', maxHeight:'500px'}} />) : (<img src={currentMedia.url} alt="Evidence" style={{width:'100%', maxHeight:'500px', objectFit:'contain'}} />)}
//                         <div style={{marginTop:'20px', display:'flex', gap:'15px', justifyContent:'center'}}>
//                             <button onClick={handleDirectDownload} style={{...styles.downloadBtn, background:'#43a047'}}>Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}</button>
//                             <button onClick={handleDownloadZip} style={{...styles.downloadBtn, background:'#1e88e5'}}>Download ZIP</button>
//                         </div>
//                     </div>
//                 </ModalWrapper>
//             )}

//             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>PICKING MODE ACTIVE - Click map</div>}
//         </div>
//     );
// };

// export default Dashboard;


import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl, useMapEvents, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SurveyForm from './SurveyForm';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import axios from 'axios';

// --- ICONS ---
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

const SurveyIcon = L.divIcon({
    className: 'custom-survey-icon',
    html: '<div style="background: #00e676; color: black; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white; box-shadow: 0 0 5px black;"></div>',
    iconSize: [16, 16]
});

// --- CONSTANTS ---
const API_BASE = process.env.REACT_APP_API_URL;

const DISTRICT_COORDS = { "Ambedkar Nagar": [26.4416, 82.5925], "Ayodhya": [26.7992, 82.2023], "Azamgarh": [26.0669, 83.1861], "Ballia": [25.8398, 84.1523], "Balrampur": [27.4265, 82.1760], "Banda": [25.4800, 80.3340], "Barabanki": [26.9388, 81.1912], "Basti": [26.7937, 82.4700], "Bhadohi": [25.3941, 82.5709], "Deoria": [26.5056, 83.7780], "Ghazipur": [25.5794, 83.5684], "Gonda": [27.1303, 81.9669], "Gorakhpur": [26.7606, 83.3732], "Kushi Nagar": [26.9031, 83.8967], "Maharajganj": [27.1437, 83.5645], "Mau": [25.9452, 83.5599], "Mirzapur": [25.1337, 82.5644], "Sant Kabeer Nagar": [26.7329, 83.0261], "Siddharth Nagar": [27.2848, 82.7845], "Varanasi": [25.3176, 82.9739] };
const DATA_HIERARCHY = { blocks: { "Ambedkar Nagar": ["Bhiti", "Ram Nagar", "Baskhari", "Bhiyawan", "Jahangir Ganj", "Jalal Pur", "Katehari", "Tanda"], "Ayodhya": ["Bikapur", "Pura Bazar", "Amaniganj", "Hariyangatanganj", "Mawai", "Milkipur", "Rudauli", "Sohawal", "Tarun"], "Azamgarh": ["Mehnagar", "Azmatgarh", "Jahanaganj", "Rani Ki Sarai", "Lalganj", "Mahrajganj", "Palhani", "Mirzapur", "Tahbarpur", "Ahiraula", "Haraiya", "Martinganj", "Mohammadpur", "Palhana", "Pawai", "Thekma", "Bilariyaganj", "Sathiyaon", "Tarwa", "Phulpur"], "Ballia": ["Garwar", "Bansdih", "Chilkahar", "Dubhar", "Maniar", "Reoti", "Belhari", "Beruarbari", "Hanumanganj", "Navanagar", "Rasra", "Sohanv", "Siar"], "Balrampur": ["Shriduttganj", "Balrampur", "Pachpedwa", "Harriya Satgharwa", "Raheera Bazaar", "Gaindas Bujurg", "Utraula", "Tulsipur", "Gasiri"], "Banda": ["Bisanda", "Tindwari", "Badokhar Khurd"], "Barabanki": ["Suratganj", "Ramnagar", "Sirauli Gauspur", "Bani Kodar", "Haidargarh", "Nindaura", "Puredalai", "Trivediganj"], "Basti": ["Saltaua Gopal Pur", "Bahadurpur", "Basti", "Dubauliya", "Gaur", "Harraiya", "Kaptanganj", "Bankati", "Kudraha", "Paras Rampur", "Rudauli", "Sau Ghat", "Ramnagar", "Vikram Jot"], "Bhadohi": ["Aurai"], "Deoria": ["Bhatni", "Baitalpur", "Bankata", "Barhaj", "Bhaluani", "Bhatpar Rani", "Deoria Sadar", "Desai Deoria", "Gauri Bazar", "Lar", "Pathar Dewa", "Rampur Karkhana", "Rudrapur", "Salempur", "Tarkalua", "Bhagalpur"], "Ghazipur": ["Mohammadabad", "Virno"], "Gonda": ["Mankapur", "Haldharmau", "Babhanjot", "Belsar", "Chhapia", "Colonelganj", "Itiyathok", "Jhanjhari", "Katra Bazar", "Mujehana", "Pandri Kripal", "Paraspur", "Rupaideeh", "Tarabganj", "Nawabganj", "Wazirganj"], "Gorakhpur": ["Khorabar", "Pali", "Pipraich", "Brahmpur", "Sardarngar", "Bharohiya", "Bhathat", "Campierganj", "Chargawan", "Gagaha", "Gola", "Jangal Kaudia", "Kauri Ram", "Khajni", "Piprauli", "Sahjanawa", "Uruwa"], "Kushi Nagar": ["Dudhahi", "Fazilnagar", "Hata", "Kaptainganj", "Kasaya", "Khadda", "Motichak", "Nebua Naurangia", "Padrauna", "Ramkola", "Seorahi", "Sukrauli", "Tamkuhiraj", "Vishunpura"], "Maharajganj": ["Dhani", "Ghughli", "Lakshmipur", "Brijmanganj", "Mithaura", "Nautanwa", "Nichlaul", "Pharenda", "Mahrajganj", "Paniyara", "Partawal", "Siswa"], "Mau": ["Atraulia", "Dohari Ghat", "Pardaha", "Badraon", "Fatehpur Madaun", "Ghosi", "Kopaganj", "Mohammadabad Gohana", "Ratanpura"], "Mirzapur": ["Lalganj"], "Sant Kabeer Nagar": ["Baghauli", "Belhar Kala", "Hainsar Bazar", "Khalilabad", "Mehdawal", "Nath Nagar", "Pauli", "Santha", "Semariyawan"], "Siddharth Nagar": ["Barhni", "Bansi", "Itwa", "Lotan", "Shohartgarh", "Ranipur", "Birdpur", "Bhanwapur", "Jogia", "Khesraha", "Khuniyaon", "Mithwal", "Naugarh", "Uska Bazar"], "Varanasi": ["Baragaon", "Arajiline", "Harahua", "Pindra", "Sevapuri"] }, spans: {}, rings: {} };
const TYPE_CODES = { "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM", "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP", "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH" };

// --- HELPERS ---
const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };
const getSessionDuration = (str) => { if (!str) return '-'; const diff = new Date() - new Date(str); return `${Math.floor(diff / 60000)} mins`; };
const isRecent = (timestamp) => { if (!timestamp) return false; const now = new Date(); const diffHours = Math.abs(now - new Date(timestamp)) / 36e5; return diffHours < 24; };
const isJustUpdated = (dateString) => { if (!dateString) return false; const now = new Date(); const diffMins = (now - new Date(dateString)) / 60000; return diffMins < 15 && diffMins >= 0; };
const formatTableDate = (dateString) => { if (!dateString) return '-'; return new Date(dateString).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }); };
const getBSNLTimestamp = (dateString) => { const d = dateString ? new Date(dateString) : new Date(); return `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`; };

// --- COMPONENTS ---
const ModalWrapper = ({ children, title, onClose }) => (<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}> <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #eee', background: '#fff' }}> <h3 style={{ margin: 0, color: '#2A4480', fontSize: '18px' }}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>CLOSE</button> </div> <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</div> </div> </div>);
const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el = document.querySelector('.leaflet-container'); if (el) el.style.cursor = isPicking ? 'crosshair' : 'grab'; }, [isPicking]); return null; };
const MapUpdater = ({ center, zoom }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, zoom || 13, { duration: 1.5 }); }, [center, zoom, map]); return null; };

const Dashboard = ({ user, role, onLogout, logAction }) => {
    const [selectedDistrict, setSelectedDistrict] = useState(''); const [selectedBlock, setSelectedBlock] = useState(''); const [selectedSpan, setSelectedSpan] = useState(''); const [selectedRing, setSelectedRing] = useState('');
    const [mapCenter, setMapCenter] = useState([26.8467, 80.9462]); const [mapZoom, setMapZoom] = useState(7);
    const [currentPage, setCurrentPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
    const [startPoint, setStartPoint] = useState(null); const [endPoint, setEndPoint] = useState(null); const [displayPath, setDisplayPath] = useState([]); const [isRingView, setIsRingView] = useState(false); const [diggingPoints, setDiggingPoints] = useState([]);
    const [submittedSurveys, setSubmittedSurveys] = useState([]); const [filteredSurveys, setFilteredSurveys] = useState([]); const [userRoutes, setUserRoutes] = useState([]);
    const [userStatuses, setUserStatuses] = useState([]); const [logs, setLogs] = useState([]);
    const [showSurveyForm, setShowSurveyForm] = useState(false); const [editingSurvey, setEditingSurvey] = useState(null); const [isViewMode, setIsViewMode] = useState(false);
    const [isPickingLocation, setIsPickingLocation] = useState(false); const [pickedCoords, setPickedCoords] = useState(null); const [showSurveyTable, setShowSurveyTable] = useState(false); const [showUserStatus, setShowUserStatus] = useState(false); const [currentMedia, setCurrentMedia] = useState(null); const [uploadModalId, setUploadModalId] = useState(null);
    const [searchDist, setSearchDist] = useState(''); const [searchBlock, setSearchBlock] = useState(''); const [searchGeneric, setSearchGeneric] = useState(''); const [searchDateFrom, setSearchDateFrom] = useState(''); const [searchDateTo, setSearchDateTo] = useState(''); const [filterStart, setFilterStart] = useState(''); const [filterEnd, setFilterEnd] = useState('');

    const visibleDistricts = Object.keys(DATA_HIERARCHY.blocks).sort(); const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : []; const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : []; const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

    useEffect(() => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition((pos) => { setMapCenter([pos.coords.latitude, pos.coords.longitude]); setMapZoom(12); }, (err) => console.warn("Loc denied")); } }, []);
    useEffect(() => { if (selectedDistrict && DISTRICT_COORDS[selectedDistrict]) { setMapCenter(DISTRICT_COORDS[selectedDistrict]); setMapZoom(10); } }, [selectedDistrict]);
    useEffect(() => { if (selectedBlock && selectedDistrict) { axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${selectedBlock}, ${selectedDistrict}, Uttar Pradesh, India`)}`).then(res => { if (res.data.length > 0) { setMapCenter([parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]); setMapZoom(13); } }); } }, [selectedBlock, selectedDistrict]);

    const applyFilters = useCallback((data) => {
        let filtered = data;
        if (searchDist) filtered = filtered.filter(s => s.district === searchDist);
        if (searchBlock) filtered = filtered.filter(s => s.block === searchBlock);
        if (searchGeneric) { const term = searchGeneric.toLowerCase(); filtered = filtered.filter(s => (s.generatedFileName && s.generatedFileName.toLowerCase().includes(term)) || (s.routeName && s.routeName.toLowerCase().includes(term))); }
        if (searchDateFrom && searchDateTo) { const from = new Date(searchDateFrom).setHours(0, 0, 0, 0); const to = new Date(searchDateTo).setHours(23, 59, 59, 999); filtered = filtered.filter(s => { const t = new Date(s.id).getTime(); return t >= from && t <= to; }); }
        setFilteredSurveys(filtered);
    }, [searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

    // --- CRITICAL FIX: STRICT BUCKET LOGIC (Prevents Mixing) ---
    // const refreshData = useCallback(async () => {
    //     try {
    //         const response = await axios.get(`${API_BASE}/surveys/all`, { params: { page: currentPage, limit: 10 } });
    //         const { surveys, pagination } = response.data;
    //         if (Array.isArray(surveys)) {
    //             const mergedData = surveys.map(s => {
    //                 const mFiles = s.mediaFiles || [];
    //                 const getProxyUrl = (path) => {
    //                     if (!path) return null;
    //                     if (path.startsWith('http')) return path;
    //                     const cleanPath = path.replace(/^uploads[\\/]/, '');
    //                     // Append timestamp to bust cache
    //                     return `${API_BASE}/surveys/read-file?path=${encodeURIComponent(cleanPath)}&mode=open&t=${Date.now()}`;
    //                 };
    //                 const getFileName = (f) => (f.filename || f.path || f.url || '').toLowerCase();

    //                 // --- STRICT "BUCKET" SEPARATION ---
    //                 // 1. Separate into pools
    //                 let videoPool = mFiles.filter(f => f.type === 'video' || f.type === 'live_video' || f.type === 'gopro_video' || f.type === 'gopro' || (f.mimetype && f.mimetype.startsWith('video')));
    //                 let imagePool = mFiles.filter(f => f.type === 'photo' || f.type === 'site_photo' || f.type === 'selfie' || (f.mimetype && f.mimetype.startsWith('image')));

    //                 let goproObj = null, liveVideoObj = null, selfieObj = null, sitePhotoObj = null;

    //                 // 2a. Find GoPro (Strict) -> Remove from pool
    //                 const goproIndex = videoPool.findIndex(f => f.type === 'gopro' || f.type === 'gopro_video' || getFileName(f).includes('gopro'));
    //                 if (goproIndex !== -1) { goproObj = videoPool[goproIndex]; videoPool.splice(goproIndex, 1); }

    //                 // 2b. Find Live Video (Strict + Fallback) -> Remove from pool
    //                 const liveIndex = videoPool.findIndex(f => f.type === 'live_video' || getFileName(f).includes('live'));
    //                 if (liveIndex !== -1) { liveVideoObj = videoPool[liveIndex]; videoPool.splice(liveIndex, 1); }
    //                 else if (videoPool.length > 0) { liveVideoObj = videoPool.shift(); } // Fallback to remaining

    //                 // 3a. Find Selfie (Strict) -> Remove from pool
    //                 const selfieIndex = imagePool.findIndex(f => f.type === 'selfie' || getFileName(f).includes('selfie'));
    //                 if (selfieIndex !== -1) { selfieObj = imagePool[selfieIndex]; imagePool.splice(selfieIndex, 1); }

    //                 // 3b. Find Site Photo (Strict + Fallback) -> Remove from pool
    //                 const siteIndex = imagePool.findIndex(f => f.type === 'site_photo' || f.type === 'photo' || getFileName(f).includes('site'));
    //                 if (siteIndex !== -1) { sitePhotoObj = imagePool[siteIndex]; imagePool.splice(siteIndex, 1); }
    //                 else if (imagePool.length > 0) { sitePhotoObj = imagePool.shift(); } // Fallback to remaining

    //                 const getPath = (obj) => obj ? (obj.url || obj.path || obj.filename) : null;

    //                 return {
    //                     ...s,
    //                     id: s.id,
    //                     routeName: s.routeName || s.route_name,
    //                     locationType: s.locationType || s.location_type,
    //                     shotNumber: s.shotNumber || s.shot_number,
    //                     ringNumber: s.ringNumber || s.ring_number,
    //                     startLocName: s.startLocName || s.start_location,
    //                     endLocName: s.endLocName || s.end_location,
    //                     surveyorName: s.surveyor_name,
    //                     surveyorMobile: s.surveyor_mobile,
    //                     dateTime: s.survey_date,
    //                     submittedBy: s.submittedBy || s.submitted_by || 'Unknown',
    //                     lastModifiedTime: s.updated_at || s.updatedAt || s.created_at || s.survey_date,
    //                     generatedFileName: s.generated_filename || `SURVEY_${s.id}`,
    //                     latitude: parseFloat(s.latitude || 0), longitude: parseFloat(s.longitude || 0),

    //                     // ASSIGN STRICTLY
    //                     sitePhoto: getPath(sitePhotoObj) ? getProxyUrl(getPath(sitePhotoObj)) : null,
    //                     liveVideo: getPath(liveVideoObj) ? getProxyUrl(getPath(liveVideoObj)) : null,
    //                     goproVideo: getPath(goproObj) ? getProxyUrl(getPath(goproObj)) : null,
    //                     selfie: getPath(selfieObj) ? getProxyUrl(getPath(selfieObj)) : null,

    //                     mediaFiles: mFiles
    //                 };
    //             });
    //             setSubmittedSurveys(mergedData.sort((a, b) => new Date(b.lastModifiedTime) - new Date(a.lastModifiedTime)));
    //             applyFilters(mergedData);
    //             if (pagination) setTotalPages(pagination.totalPages);
    //             const lines = []; mergedData.forEach(s => { if (['HDD Start Point', 'HDD End Point'].includes(s.locationType)) { const lat = parseFloat(s.latitude); const lng = parseFloat(s.longitude); if (lat && lng) lines.push({ start: {lat, lng}, end: {lat: lat+0.0001, lng: lng+0.0001}, name: s.routeName }); } }); setUserRoutes(lines);
    //         }
    //     } catch(e) { console.error("Fetch Error", e); }
    // }, [applyFilters, currentPage]);

    //     const refreshData = useCallback(async () => {
    //         try {
    //             const response = await axios.get(`${API_BASE}/surveys/all`, { params: { page: currentPage, limit: 10 } });
    //             const { surveys, pagination } = response.data;
    //             if (Array.isArray(surveys)) {
    //                 const mergedData = surveys.map(s => {
    //                     const mFiles = s.mediaFiles || [];
    //                    const getProxyUrl = (path) => {
    //     if (!path) return null;
    //     // Remove JSON artifacts from DB string
    //     const cleanPath = path.replace(/[\[\]"']/g, '');
    //     return `${API_BASE}/surveys/read-file?path=${encodeURIComponent(cleanPath)}&mode=open&t=${Date.now()}`;
    // };
    //                     const getFileName = (f) => (f.filename || f.path || f.url || '').toLowerCase();

    //                     // --- STRICT "BUCKET" SEPARATION ---
    //                     // 1. Separate into pools
    //                     let videoPool = mFiles.filter(f => f.type === 'video' || f.type === 'live_video' || f.type === 'gopro_video' || f.type === 'gopro' || (f.mimetype && f.mimetype.startsWith('video')));
    //                     let imagePool = mFiles.filter(f => f.type === 'photo' || f.type === 'site_photo' || f.type === 'selfie' || (f.mimetype && f.mimetype.startsWith('image')));

    //                     let goproObj = null, liveVideoObj = null, selfieObj = null, sitePhotoObj = null;

    //                     // 2a. Find GoPro (Strict) -> Remove from pool
    //                     const goproIndex = videoPool.findIndex(f => f.type === 'gopro' || f.type === 'gopro_video' || getFileName(f).includes('gopro'));
    //                     if (goproIndex !== -1) { goproObj = videoPool[goproIndex]; videoPool.splice(goproIndex, 1); }

    //                     // 2b. Find Live Video (Strict + Fallback) -> Remove from pool
    //                     const liveIndex = videoPool.findIndex(f => f.type === 'live_video' || getFileName(f).includes('live'));
    //                     if (liveIndex !== -1) { liveVideoObj = videoPool[liveIndex]; videoPool.splice(liveIndex, 1); }
    //                     else if (videoPool.length > 0) { liveVideoObj = videoPool.shift(); } // Fallback to remaining

    //                     // 3a. Find Selfie (Strict) -> Remove from pool
    //                     const selfieIndex = imagePool.findIndex(f => f.type === 'selfie' || getFileName(f).includes('selfie'));
    //                     if (selfieIndex !== -1) { selfieObj = imagePool[selfieIndex]; imagePool.splice(selfieIndex, 1); }

    //                     // 3b. Find Site Photo (Strict + Fallback) -> Remove from pool
    //                     const siteIndex = imagePool.findIndex(f => f.type === 'site_photo' || f.type === 'photo' || getFileName(f).includes('site'));
    //                     if (siteIndex !== -1) { sitePhotoObj = imagePool[siteIndex]; imagePool.splice(siteIndex, 1); }
    //                     else if (imagePool.length > 0) { sitePhotoObj = imagePool.shift(); } // Fallback to remaining

    //                     const getPath = (obj) => obj ? (obj.url || obj.path || obj.filename) : null;

    //                     return {
    //                         ...s,
    //                         id: s.id,
    //                         submitter_id: clean(s.submitter_id || s.submitted_by),
    //                         submittedBy: clean(s.submitted_by) || 'Unknown',
    //                         routeName: s.routeName || s.route_name,
    //                         locationType: s.locationType || s.location_type,
    //                         shotNumber: s.shotNumber || s.shot_number,
    //                         ringNumber: s.ringNumber || s.ring_number,
    //                         startLocName: s.startLocName || s.start_location,
    //                         endLocName: s.endLocName || s.end_location,
    //                         surveyorName: s.surveyor_name,
    //                         surveyorMobile: s.surveyor_mobile,
    //                         dateTime: s.survey_date,
    //                         submittedBy: s.submittedBy || s.submitted_by || 'Unknown',
    //                         lastModifiedTime: s.updated_at || s.updatedAt || s.created_at || s.survey_date,
    //                         generatedFileName: s.generated_filename || `SURVEY_${s.id}`,
    //                         latitude: parseFloat(s.latitude || 0), longitude: parseFloat(s.longitude || 0),

    //                         // ASSIGN STRICTLY
    //                         sitePhoto: getPath(sitePhotoObj) ? getProxyUrl(getPath(sitePhotoObj)) : null,
    //                         liveVideo: getPath(liveVideoObj) ? getProxyUrl(getPath(liveVideoObj)) : null,
    //                         goproVideo: getPath(goproObj) ? getProxyUrl(getPath(goproObj)) : null,
    //                         selfie: getPath(selfieObj) ? getProxyUrl(getPath(selfieObj)) : null,

    //                         mediaFiles: mFiles
    //                     };
    //                 });

    //                 setSubmittedSurveys(mergedData.sort((a, b) => new Date(b.lastModifiedTime) - new Date(a.lastModifiedTime)));
    //                 applyFilters(mergedData);
    //                 if (pagination) setTotalPages(pagination.totalPages);
    //                 const lines = []; mergedData.forEach(s => { if (['HDD Start Point', 'HDD End Point'].includes(s.locationType)) { const lat = parseFloat(s.latitude); const lng = parseFloat(s.longitude); if (lat && lng) lines.push({ start: { lat, lng }, end: { lat: lat + 0.0001, lng: lng + 0.0001 }, name: s.routeName }); } }); setUserRoutes(lines);
    //             }
    //         } catch (e) { console.error("Fetch Error", e); }
    //     }, [applyFilters, currentPage]);
    const refreshData = useCallback(async () => {
        try {
            // Define clean function to handle PostgreSQL array strings like {"user12"}
            const clean = (val) => {
                if (!val) return "";
                return String(val).replace(/[{}" ]/g, '').split(',')[0];
            };

            const response = await axios.get(`${API_BASE}/surveys/all`, { params: { page: currentPage, limit: 10 } });
            const { surveys, pagination } = response.data;

            if (Array.isArray(surveys)) {
                const mergedData = surveys.map(s => {
                    const mFiles = s.mediaFiles || [];
                    const getProxyUrl = (path) => {
                        if (!path) return null;
                        const cleanPath = path.replace(/[[\]"']/g, '');
                        return `${API_BASE}/surveys/read-file?path=${encodeURIComponent(cleanPath)}&mode=open&t=${Date.now()}`;
                    };
                    const getFileName = (f) => (f.filename || f.path || f.url || '').toLowerCase();

                    // --- MEDIA SEPARATION ---
                    let videoPool = mFiles.filter(f => f.type === 'video' || f.type === 'live_video' || f.type === 'gopro_video' || f.type === 'gopro' || (f.mimetype && f.mimetype.startsWith('video')));
                    let imagePool = mFiles.filter(f => f.type === 'photo' || f.type === 'site_photo' || f.type === 'selfie' || (f.mimetype && f.mimetype.startsWith('image')));

                    let goproObj = null, liveVideoObj = null, selfieObj = null, sitePhotoObj = null;

                    const goproIndex = videoPool.findIndex(f => f.type === 'gopro' || f.type === 'gopro_video' || getFileName(f).includes('gopro'));
                    if (goproIndex !== -1) { goproObj = videoPool[goproIndex]; videoPool.splice(goproIndex, 1); }

                    const liveIndex = videoPool.findIndex(f => f.type === 'live_video' || getFileName(f).includes('live'));
                    if (liveIndex !== -1) { liveVideoObj = videoPool[liveIndex]; videoPool.splice(liveIndex, 1); }
                    else if (videoPool.length > 0) { liveVideoObj = videoPool.shift(); }

                    const selfieIndex = imagePool.findIndex(f => f.type === 'selfie' || getFileName(f).includes('selfie'));
                    if (selfieIndex !== -1) { selfieObj = imagePool[selfieIndex]; imagePool.splice(selfieIndex, 1); }

                    const siteIndex = imagePool.findIndex(f => f.type === 'site_photo' || f.type === 'photo' || getFileName(f).includes('site'));
                    if (siteIndex !== -1) { sitePhotoObj = imagePool[siteIndex]; imagePool.splice(siteIndex, 1); }
                    else if (imagePool.length > 0) { sitePhotoObj = imagePool.shift(); }

                    const getPath = (obj) => obj ? (obj.url || obj.path || obj.filename) : null;

                    // Create the mapped object
                    return {
                        ...s,
                        id: s.id,
                        // Clean the identifiers for filtering
                        submitter_id: clean(s.submitter_id || s.submitted_by),
                        submittedBy: clean(s.submitted_by) || 'Unknown',

                        routeName: s.routeName || s.route_name,
                        locationType: s.locationType || s.location_type,
                        shotNumber: s.shotNumber || s.shot_number,
                        ringNumber: s.ringNumber || s.ring_number,
                        startLocName: s.startLocName || s.start_location,
                        endLocName: s.endLocName || s.end_location,
                        surveyorName: s.surveyor_name,
                        surveyorMobile: s.surveyor_mobile,
                        dateTime: s.survey_date,
                        lastModifiedTime: s.updated_at || s.updatedAt || s.created_at || s.survey_date,
                        generatedFileName: s.generated_filename || `SURVEY_${s.id}`,
                        latitude: parseFloat(s.latitude || 0),
                        longitude: parseFloat(s.longitude || 0),

                        sitePhoto: getPath(sitePhotoObj) ? getProxyUrl(getPath(sitePhotoObj)) : null,
                        liveVideo: getPath(liveVideoObj) ? getProxyUrl(getPath(liveVideoObj)) : null,
                        goproVideo: getPath(goproObj) ? getProxyUrl(getPath(goproObj)) : null,
                        selfie: getPath(selfieObj) ? getProxyUrl(getPath(selfieObj)) : null,
                        mediaFiles: mFiles
                    };
                });

                // --- ROLE-BASED FILTRATION ---
                let finalFilteredData;
                const currentUserId = String(user?.id || user?.username || user || "unknown").toLowerCase();
                const currentUserName = String(user?.username || user || "Surveyor");
                const currentUserIdClean = currentUserId;
                if (role === 'admin') {
                    finalFilteredData = mergedData; // Admin: See everything
                } else {
                    // User: Only see their own data
                    finalFilteredData = mergedData.filter(item =>
                        item.submitter_id.toLowerCase() === currentUserIdClean
                    );
                }

                // Sort and Update State
                const sortedData = finalFilteredData.sort((a, b) => new Date(b.lastModifiedTime) - new Date(a.lastModifiedTime));

                setSubmittedSurveys(sortedData);
                applyFilters(sortedData);

                if (pagination) setTotalPages(pagination.totalPages);

                // Update Map Lines for filtered data only
                const lines = [];
                sortedData.forEach(s => {
                    if (['HDD Start Point', 'HDD End Point'].includes(s.locationType) && s.latitude && s.longitude) {
                        lines.push({
                            start: { lat: s.latitude, lng: s.longitude },
                            end: { lat: s.latitude + 0.0001, lng: s.longitude + 0.0001 },
                            name: s.routeName
                        });
                    }
                });
                setUserRoutes(lines);
            }
        } catch (e) {
            console.error("Fetch Error", e);
        }
    }, [applyFilters, currentPage, role, user, currentUserId, currentUserIdClean]); // Added role and user to dependencies
    useEffect(() => { refreshData(); if (role === 'admin') { setUserStatuses([{ username: 'admin', status: 'Online', loginTime: new Date().toISOString() }]); setLogs([{ displayTime: new Date().toLocaleString(), username: 'admin', action: 'LOGIN', details: 'System Access' }]); } }, [refreshData, role]);

    // --- HANDLE SUBMIT (With Explicit File Keys) ---
    const handleSurveySubmit = async (formData) => {
        if (!formData || !formData.district) { alert("District is required"); return; }

        try {
            // Note: This logic assumes 'onSubmitData' calls the API. 
            // Since this function is passed to SurveyForm, SurveyForm usually handles the UI loader.
            // Dashboard.js handles the API logic here.

            const apiData = new FormData();
            const append = (key, value) => { if (value !== null && value !== undefined && value !== '') apiData.append(key, value); };
            apiData.append('submitter_id', String(currentUserId));
            apiData.append('submittedBy', String(currentUserName));
            append('district', formData.district); append('block', formData.block); append('routeName', formData.routeName);
            append('locationType', formData.locationType); append('shotNumber', formData.shotNumber || '0'); append('ringNumber', formData.ringNumber || '0');
            append('startLocName', formData.startLocName); append('endLocName', formData.endLocName); append('fileNamePrefix', formData.generatedFileName);
            append('surveyorName', formData.surveyorName); append('surveyorMobile', formData.surveyorMobile);
            append('submittedBy', (user && user.username) ? user.username : (typeof user === 'string' ? user : 'admin'));
            append('dateTime', formData.dateTime || new Date().toISOString()); append('latitude', formData.latitude); append('longitude', formData.longitude);
            append('remarks', formData.remarks || '');

            // --- EXPLICIT NAMING TO PREVENT MIXUP ---
            // if (formData.sitePhotoBlob instanceof Blob) apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');
            // if (formData.liveVideoBlob instanceof Blob) apiData.append('videos', formData.liveVideoBlob, 'live_video.mp4');
            // if (formData.goproBlob instanceof Blob || formData.goproBlob instanceof File) apiData.append('videos', formData.goproBlob, 'gopro_video.mp4');
            // if (formData.selfieBlob instanceof Blob) apiData.append('selfie', formData.selfieBlob, 'team_selfie.jpg');

            if (formData.sitePhotoBlob instanceof Blob) apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');

            // LIVE VIDEO -> 'live_video.mp4'
            if (formData.liveVideoBlob instanceof Blob) apiData.append('videos', formData.liveVideoBlob, 'live_video.mp4');

            // GOPRO -> 'gopro_video.mp4'
            if (formData.goproBlob instanceof Blob || formData.goproBlob instanceof File) apiData.append('gopro', formData.goproBlob, 'gopro_video.mp4');

            // SELFIE -> 'team_selfie.jpg'
            if (formData.selfieBlob instanceof Blob) apiData.append('selfie', formData.selfieBlob, 'team_selfie.jpg');

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            debugger;
            let response = formData.id ? await axios.put(`${API_BASE}/surveys/${formData.id}`, apiData, config) : await axios.post(`${API_BASE}/surveys`, apiData, config);

            // Success handled by SurveyForm's local state, but we refresh data here
            if (response.data.success) {
                setTimeout(() => { refreshData(); }, 500);
                return true; // Return success to SurveyForm
            }
        } catch (e) {
            console.error("FULL ERROR:", e);
            throw e; // Throw to SurveyForm to handle UI error
        }
    };

    const handleDeleteSurvey = async (id) => { if (window.confirm("Admin: Permanently delete this record?")) { try { await axios.delete(`${API_BASE}/surveys/${id}/cancel`); refreshData(); } catch (e) { console.error(e); alert("Failed to delete."); } } };

    // --- VIEW MEDIA HANDLER (Use Mapped Props) ---
    const handleViewMedia = (type, survey) => {
        let mediaUrl = null; let ext = 'jpg';
        if (type === 'video') { mediaUrl = survey.liveVideo; ext = 'mp4'; }
        else if (type === 'gopro') { mediaUrl = survey.goproVideo; ext = 'mp4'; }
        else if (type === 'photo') { mediaUrl = survey.sitePhoto; ext = 'jpg'; }

        if (mediaUrl) { setCurrentMedia({ type, url: mediaUrl, filename: `file.${ext}`, meta: survey }); }
        else { alert(`No ${type} found for this survey.`); }
    };

    const handleDirectDownload = async () => { if (!currentMedia || !currentMedia.url) return; try { const response = await fetch(currentMedia.url); const blob = await response.blob(); saveAs(blob, `${currentMedia.meta.generatedFileName}_${currentMedia.type}.${(currentMedia.type.includes('video') || currentMedia.type.includes('gopro')) ? 'mp4' : 'jpg'}`); } catch (e) { console.error("Download failed", e); } };
    const handleDownloadZip = async () => { if (!currentMedia || !currentMedia.url) return; try { const response = await fetch(currentMedia.url); const blob = await response.blob(); const zip = new JSZip(); const ext = (currentMedia.type.includes('video') || currentMedia.type.includes('gopro')) ? 'mp4' : 'jpg'; zip.file(`${currentMedia.meta.generatedFileName}.${ext}`, blob); zip.file("details.txt", `Filename: ${currentMedia.meta.generatedFileName}\nSurveyor: ${currentMedia.meta.surveyorName}`); saveAs(await zip.generateAsync({ type: "blob" }), `${currentMedia.meta.generatedFileName}.zip`); } catch (e) { console.error("Zip failed", e); } };
    const handleGoProUpload = async (e) => { const file = e.target.files[0]; if (!file || !uploadModalId) return; const formData = new FormData(); formData.append('videos', file, 'gopro_video.mp4'); try { await axios.put(`${API_BASE}/surveys/${uploadModalId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); alert("GoPro Uploaded Successfully!"); setUploadModalId(null); refreshData(); } catch (error) { console.error("Upload failed", error); alert("Upload Failed"); } };
    const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
    const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
    const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime() + 86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

    const styles = {
        container: { display: 'flex', flexDirection: 'column', height: '100dvh', width: '100vw', fontFamily: 'Arial, sans-serif', overflow: 'hidden', position: 'fixed', top: 0, left: 0 },
        header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 2000, gap: '20px', overflowX: 'auto', whiteSpace: 'nowrap', flexShrink: 0 },
        controls: { display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 },
        headerLeft: { display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 },
        select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border: '1px solid #ccc', background: 'white', fontSize: '13px', cursor: 'pointer' },
        badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
        btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' },
        btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' },
        btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' },
        table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
        th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color: '#555', fontWeight: 'bold' },
        td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color: '#333' },
        actionBtn: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', marginRight: '5px', fontSize: '12px', fontWeight: 'bold' },
        statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
        downloadBtn: { flex: 1, padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', border: 'none', color: 'white', textAlign: 'center', textDecoration: 'none', fontSize: '14px' },
        pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor: 'pointer' },
        filterBox: { display: 'flex', gap: '10px', marginBottom: '15px', background: '#f5f5f5', padding: '15px', borderRadius: '6px', flexWrap: 'wrap', alignItems: 'center', border: '1px solid #e0e0e0' },
        searchInput: { padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '180px' },
        adminCard: { background: '#fff', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
        adminHeader: { background: '#f5f5f5', padding: '10px 15px', borderBottom: '1px solid #ddd', fontWeight: 'bold', color: '#333' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <strong style={{ fontSize: '20px' }}>GIS</strong>
                    <span style={styles.badge}>{(role || 'USER').toUpperCase()}</span>
                    <select style={styles.select} value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}><option value="">District</option>{visibleDistricts.map(d => <option key={d}>{d}</option>)}</select>
                    <select style={styles.select} value={selectedBlock} onChange={e => setSelectedBlock(e.target.value)}><option value="">Block</option>{blockOptions.map(b => <option key={b}>{b}</option>)}</select>
                    <select style={styles.select} value={selectedSpan} onChange={e => setSelectedSpan(e.target.value)}><option value="">Span</option>{spanOptions.map(s => <option key={s}>{s}</option>)}</select>
                    <select style={styles.select} value={selectedRing} onChange={e => setSelectedRing(e.target.value)}><option value="">Ring</option>{ringOptions.map(r => <option key={r}>{r}</option>)}</select>
                </div>
                <div style={styles.controls}>
                    <button onClick={() => { setEditingSurvey(null); setIsViewMode(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
                    <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({filteredSurveys.length})</button>
                    {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>}
                    <button onClick={onLogout} style={styles.btnRed}>Logout</button>
                </div>
            </div>

            <MapContainer center={mapCenter} zoom={mapZoom} style={{ flex: 1 }}>
                <MapUpdater center={mapCenter} zoom={mapZoom} />
                <MapPickHandler isPicking={isPickingLocation} onPick={handleMapClick} />
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
                </LayersControl>
                {startPoint && <MapUpdater center={startPoint} zoom={13} />}
                {startPoint && <Marker position={startPoint}><Popup>Source</Popup></Marker>}
                {endPoint && <Marker position={endPoint}><Popup>Destination</Popup></Marker>}
                {displayPath.length > 0 && <Polyline positions={displayPath} color={isRingView ? "#28a745" : "#007bff"} weight={isRingView ? 4 : 6} />}
                {userRoutes.map((route, idx) => (<Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline>))}
                {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
                {submittedSurveys.map(s => s.latitude && (
                    <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
                        <Popup minWidth={250}>
                            <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                                <div style={{ background: '#1a237e', color: 'white', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', marginBottom: '8px' }}>{s.locationType}</div>
                                <div><b>File:</b> {s.generatedFileName}</div>
                                <div><b>Route:</b> {s.routeName}</div>
                                <div style={{ marginTop: '10px' }}>
                                    {s.liveVideo && <button style={{ ...styles.actionBtn, background: '#e65100', color: 'white' }} onClick={() => handleViewMedia('video', s)}>Video</button>}
                                    {s.sitePhoto && <button style={{ ...styles.actionBtn, background: '#2e7d32', color: 'white' }} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
                                </div>
                            </div>
                        </Popup>
                        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                            <div style={{ textAlign: 'left', minWidth: '150px' }}>
                                {isRecent(s.survey_date) && <div style={{ background: '#e65100', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '3px', display: 'inline-block', marginBottom: '5px', fontWeight: 'bold' }}>RECENT</div>}
                                <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1a237e' }}>{s.locationType}</div>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#007bff', margin: '2px 0' }}>{s.generatedFileName || "No Filename"}</div>
                                <div style={{ fontSize: '11px', color: '#333' }}>Route: {s.routeName}</div>
                                <div style={{ fontSize: '11px', color: '#555' }}>Date: {getBSNLTimestamp(s.survey_date)}</div>
                                <div style={{ marginTop: '6px', paddingTop: '4px', borderTop: '1px solid #eee', display: 'flex', gap: '8px', fontSize: '11px', fontWeight: 'bold' }}>
                                    {s.sitePhoto && <span style={{ color: '#2e7d32' }}>[Photo]</span>}
                                    {s.liveVideo && <span style={{ color: '#d32f2f' }}>[Video]</span>}
                                </div>
                            </div>
                        </Tooltip>
                    </Marker>
                ))}
                {pickedCoords && !isPickingLocation && <Marker position={pickedCoords}><Popup>Picked</Popup></Marker>}
            </MapContainer>

            {showSurveyForm && (
                <SurveyForm
                    onClose={() => { setShowSurveyForm(false); refreshData(); }}
                    pickedCoords={pickedCoords}
                    districts={visibleDistricts}
                    blocks={Object.values(DATA_HIERARCHY.blocks)}
                    onSubmitData={handleSurveySubmit}
                    user={user}
                    onPickLocation={handlePickLocationStart}
                    initialData={editingSurvey}
                    viewOnly={isViewMode}
                />
            )}

            {showSurveyTable && (
                <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
                    <div style={styles.filterBox}>
                        <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e => setSearchGeneric(e.target.value)} />
                        <select style={styles.select} onChange={e => setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d => <option key={d}>{d}</option>)}</select>
                        <select style={styles.select} onChange={e => setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b => <option key={b}>{b}</option>)}</select>
                        <input type="date" style={styles.select} onChange={e => setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e => setSearchDateTo(e.target.value)} />
                    </div>

                    <table style={styles.table}>
                        <thead>
                            <tr style={{ textAlign: 'left', background: '#f9f9f9' }}>
                                <th style={styles.th}>Filename</th>
                                <th style={styles.th}>User / Role</th>
                                <th style={styles.th}>Shot</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Last Mod.</th>
                                <th style={styles.th}>Media</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSurveys.map(s => {
                                const justEdited = isJustUpdated(s.lastModifiedTime);
                                const rowStyle = {
                                    borderBottom: '1px solid #f0f0f0',
                                    backgroundColor: justEdited ? '#e8f5e9' : 'white',
                                    transition: 'background-color 0.5s ease'
                                };

                                return (
                                    <tr key={s.id} title={`Route: ${s.routeName}`} style={rowStyle}>
                                        <td style={styles.td}>
                                            <b>{s.generatedFileName}</b>
                                            {justEdited && <span style={{ marginLeft: '5px', fontSize: '9px', background: '#2e7d32', color: 'white', padding: '2px 4px', borderRadius: '3px' }}>UPDATED</span>}
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ fontWeight: 'bold', color: '#2A4480', fontSize: '12px' }}>{s.submittedBy}</div>
                                            <div style={{ fontSize: '10px', color: '#666' }}>{s.submittedBy === 'admin' ? 'Administrator' : 'Surveyor'}</div>
                                        </td>
                                        <td style={styles.td}>{s.shotNumber}</td>
                                        <td style={styles.td}>{s.locationType}</td>
                                        <td style={{ fontSize: '11px', color: '#444', ...styles.td }}>{formatTableDate(s.lastModifiedTime)}</td>
                                        <td style={styles.td}>
                                            {s.liveVideo && <button style={{ ...styles.actionBtn, color: 'green', borderColor: 'green', fontSize: '10px' }} onClick={() => handleViewMedia('video', s)}>Video</button>}
                                            {s.sitePhoto && <button style={{ ...styles.actionBtn, color: 'green', borderColor: 'green', fontSize: '10px' }} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
                                            {s.goproVideo && <button style={{ ...styles.actionBtn, color: '#1565c0', borderColor: '#1565c0', fontSize: '10px' }} onClick={() => handleViewMedia('gopro', s)}>GoPro</button>}
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex' }}>
                                                <button onClick={() => { setEditingSurvey(s); setIsViewMode(true); setShowSurveyTable(false); setShowSurveyForm(true); }}>
                                                    View
                                                </button>

                                                {/* User can only Edit their OWN unique ID records. Admin can edit anything */}
                                                {(role === 'admin' || s.submitter_id === currentUserId) && (
                                                    <button onClick={() => { setEditingSurvey(s); setIsViewMode(false); setShowSurveyTable(false); setShowSurveyForm(true); }}>
                                                        Edit
                                                    </button>
                                                )}

                                                {role === 'admin' && <button onClick={() => handleDeleteSurvey(s.id)}>Del</button>}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '15px', alignItems: 'center', borderTop: '1px solid #eee' }}>
                        <button style={styles.btnWhite} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt; Prev</button>
                        <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Page {currentPage} of {totalPages}</span>
                        <button style={styles.btnWhite} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next &gt;</button>
                    </div>
                </ModalWrapper>
            )}

            {showUserStatus && role === 'admin' && (
                <ModalWrapper title="Admin Logs" onClose={() => setShowUserStatus(false)}>
                    {/* ... (Admin Log UI remains same) ... */}
                </ModalWrapper>
            )}

            {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={() => setUploadModalId(null)}><div style={{ padding: '20px' }}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}

            {currentMedia && (
                <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
                    <div style={{ textAlign: 'center', background: 'black', padding: '15px', borderRadius: '8px' }}>
                        {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (<video src={currentMedia.url} controls style={{ width: '100%', maxHeight: '500px' }} />) : (<img src={currentMedia.url} alt="Evidence" style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />)}
                        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button onClick={handleDirectDownload} style={{ ...styles.downloadBtn, background: '#43a047' }}>Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}</button>
                            <button onClick={handleDownloadZip} style={{ ...styles.downloadBtn, background: '#1e88e5' }}>Download ZIP</button>
                        </div>
                    </div>
                </ModalWrapper>
            )}

            {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>PICKING MODE ACTIVE - Click map</div>}
        </div>
    );
};

export default Dashboard;