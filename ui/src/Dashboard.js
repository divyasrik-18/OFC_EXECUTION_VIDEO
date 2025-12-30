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
// const API_BASE = process.env.REACT_APP_API_URL;

// const DISTRICT_COORDS = { 
//     "Ambedkar Nagar": [26.4416, 82.5925], 
//     "Ayodhya": [26.7992, 82.2023], 
//     "Azamgarh": [26.0669, 83.1861], 
//     "Ballia": [25.8398, 84.1523], 
//     "Balrampur": [27.4265, 82.1760], 
//     "Banda": [25.4800, 80.3340], 
//     "Barabanki": [26.9388, 81.1912], 
//     "Basti": [26.7937, 82.4700], 
//     "Bhadohi": [25.3941, 82.5709], 
//     "Deoria": [26.5056, 83.7780], 
//     "Ghazipur": [25.5794, 83.5684], 
//     "Gonda": [27.1303, 81.9669], 
//     "Gorakhpur": [26.7606, 83.3732], 
//     "Kushi Nagar": [26.9031, 83.8967], 
//     "Maharajganj": [27.1437, 83.5645], 
//     "Mau": [25.9452, 83.5599], 
//     "Mirzapur": [25.1337, 82.5644], 
//     "Sant Kabeer Nagar": [26.7329, 83.0261], 
//     "Siddharth Nagar": [27.2848, 82.7845], 
//     "Varanasi": [25.3176, 82.9739] 
// };

// const DATA_HIERARCHY = { 
//     blocks: { 
//         "Ambedkar Nagar": ["Bhiti", "Ram Nagar", "Akbarpur", "Baskhari", "Bhiyawan", "Jahangir Ganj", "Jalal Pur", "Katehari", "Tanda"], 
//         "Ayodhya": ["Bikapur", "Pura Bazar", "Amaniganj", "Hariyangatanganj", "Mawai", "Milkipur", "Rudauli", "Sohawal", "Tarun"], 
//         "Azamgarh": ["Mehnagar", "Azmatgarh", "Jahanaganj", "Rani Ki Sarai", "Lalganj", "Mahrajganj", "Palhani", "Mirzapur", "Tahbarpur", "Ahiraula", "Haraiya", "Koilsa", "Martinganj", "Mohammadpur", "Palhana", "Pawai", "Thekma", "Bilariyaganj", "Tarwa", "Phulpur", "Sathiyaon"], 
//         "Ballia": ["Garwar", "Bairia", "Bansdih", "Chilkahar", "Dubhar", "Maniar", "Rasra", "Reoti", "Belhari", "Beruarbari", "Hanumanganj", "Navanagar", "Pandah", "Sohanv", "Siar"], 
//         "Balrampur": ["Shriduttganj", "Balrampur", "Gaisri", "Harriya Satgharwa", "Pachpedwa", "Rahera Bazar", "Gaindas Bujurg", "Tulsipur", "Utraula"], 
//         "Banda": ["Bisanda", "Tindwari", "Badokhar Khurd"], 
//         "Barabanki": ["Suratganj", "Dariyabad", "Ramnagar", "Sirauli Gauspur", "Bani Kodar", "Haidargarh", "Nindaura", "Puredalai", "Trivediganj"], 
//         "Basti": ["Saltaua Gopal Pur", "Bahadurpur", "Basti", "Dubauliya", "Gaur", "Harraiya", "Kaptanganj", "Bankati", "Kudraha", "Paras Rampur", "Rudauli", "Sau Ghat", "Ramnagar", "Vikram Jot"], 
//         "Bhadohi": ["Deegh"], 
//         "Deoria": ["Bhatni", "Baitalpur", "Bankata", "Barhaj", "Bhagalpur", "Bhaluani", "Bhatpar Rani", "Deoria Sadar", "Desai Deoria", "Gauri Bazar", "Lar", "Pathar Dewa", "Rampur Karkhana", "Rudrapur", "Salempur", "Tarkalua"], 
//         "Ghazipur": ["Nagra", "Mohammadabad", "Virno"], 
//         "Gonda": ["Mankapur", "Haldharmau", "Babhanjot", "Belsar", "Chhapia", "Colonelganj", "Itiyathok", "Jhanjhari", "Katra Bazar", "Mujehana", "Pandri Kripal", "Paraspur", "Rupaideeh", "Tarabganj", "Nawabganj", "Wazirganj"], 
//         "Gorakhpur": ["Khorabar", "Pali", "Pipraich", "Brahmpur", "Sardarngar", "Bharohiya", "Bhathat", "Campierganj", "Belghat", "Chargawan", "Gagaha", "Gola", "Jangal Kaudia", "Kauri Ram", "Khajni", "Piprauli", "Sahjanawa", "Uruwa"], 
//         "Kushi Nagar": ["Dudhahi", "Fazilnagar", "Hata", "Kaptainganj", "Kasaya", "Khadda", "Motichak", "Nebua Naurangia", "Padrauna", "Ramkola", "Seorahi", "Sukrauli", "Tamkuhiraj", "Vishunpura"], 
//         "Maharajganj": ["Dhani", "Ghughli", "Lakshmipur", "Bridgemanganj", "Mithaura", "Nautanwa", "Nichlaul", "Pharenda", "Mahrajganj", "Paniyara", "Partawal", "Siswa"], 
//         "Mau": ["Atraulia", "Dohari Ghat", "Pardaha", "Badraon", "Fatehpur Madaun", "Ghosi", "Kopaganj", "Mohammadabad Gohana", "Ratanpura"], 
//         "Mirzapur": ["Lalganj"], 
//         "Sant Kabeer Nagar": ["Baghauli", "Belhar Kala", "Hainsar Bazar", "Khalilabad", "Mehdawal", "Nath Nagar", "Pauli", "Santha", "Semariyawan"], 
//         "Siddharth Nagar": ["Barhni", "Itwa", "Lotan", "Shohartgarh", "Ranipur", "Bansi", "Bhanwapur", "Birdpur", "Domariyaganj", "Jogia", "Khesraha", "Khuniyaon", "Mithwal", "Naugarh", "Uska Bazar"], 
//         "Varanasi": ["Baragaon", "Arajiline", "Harahua", "Pindra", "Sevapuri"] 
//     }, 
//     spans: {}, 
//     rings: {} 
// };

// const TYPE_CODES = { 
//     "HDD Start Point": "HSP", 
//     "HDD End Point": "HEP", 
//     "Chamber Location": "CHM", 
//     "GP Location": "GPL", 
//     "Blowing Start Point": "BSP", 
//     "Blowing End Point": "BEP", 
//     "Coupler location": "CPL", 
//     "splicing": "SPL", 
//     "Other": "OTH" 
// };

// // --- HELPERS ---
// const getRingPath = (start, end, offsetFactor) => { const midLat = (start.lat + end.lat) / 2; const midLng = (start.lng + end.lng) / 2; return [start, { lat: midLat + offsetFactor, lng: midLng + offsetFactor }, end]; };
// const generatePointsOnPath = (path, count) => { const points = []; for (let i = 1; i <= count; i++) { const ratio = i / (count + 1); points.push({ lat: path[0].lat + (path[1].lat - path[0].lat) * ratio, lng: path[0].lng + (path[1].lng - path[0].lng) * ratio, id: `SP-${i}` }); } return points; };
// const getSessionDuration = (str) => { if (!str) return '-'; const diff = new Date() - new Date(str); return `${Math.floor(diff / 60000)} mins`; };
// const isRecent = (timestamp) => { if (!timestamp) return false; const now = new Date(); const diffHours = Math.abs(now - new Date(timestamp)) / 36e5; return diffHours < 24; };
// const isJustUpdated = (dateString) => { if (!dateString) return false; const now = new Date(); const diffMins = (now - new Date(dateString)) / 60000; return diffMins < 15 && diffMins >= 0; };
// const formatTableDate = (dateString) => { if (!dateString) return '-'; return new Date(dateString).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }); };
// const getBSNLTimestamp = (dateString) => { const d = dateString ? new Date(dateString) : new Date(); return `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`; };

// // --- COMPONENTS ---
// const ModalWrapper = ({ children, title, onClose }) => (<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}> <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #eee', background: '#fff' }}> <h3 style={{ margin: 0, color: '#2A4480', fontSize: '18px' }}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>CLOSE</button> </div> <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</div> </div> </div>);
// const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el = document.querySelector('.leaflet-container'); if (el) el.style.cursor = isPicking ? 'crosshair' : 'grab'; }, [isPicking]); return null; };
// const MapUpdater = ({ center, zoom }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, zoom || 13, { duration: 1.5 }); }, [center, zoom, map]); return null; };

// const Dashboard = ({ user, role, onLogout, logAction }) => {
//     const loginUserId = localStorage.getItem("id") || '';
//     const [selectedDistrict, setSelectedDistrict] = useState(''); const [selectedBlock, setSelectedBlock] = useState(''); const [selectedSpan, setSelectedSpan] = useState(''); const [selectedRing, setSelectedRing] = useState('');
//     const [mapCenter, setMapCenter] = useState([26.8467, 80.9462]); const [mapZoom, setMapZoom] = useState(7);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null); const [displayPath, setDisplayPath] = useState([]); const [isRingView, setIsRingView] = useState(false); const [diggingPoints, setDiggingPoints] = useState([]);
//     const [submittedSurveys, setSubmittedSurveys] = useState([]);
//     const [filteredSurveys, setFilteredSurveys] = useState([]);
//     const [userRoutes, setUserRoutes] = useState([]);
//     const [userStatuses, setUserStatuses] = useState([]);
//     const [logs, setLogs] = useState([]);
//     const [showSurveyForm, setShowSurveyForm] = useState(false);
//     const [editingSurvey, setEditingSurvey] = useState(null);
//     const [isViewMode, setIsViewMode] = useState(false);
//     const [isPickingLocation, setIsPickingLocation] = useState(false);
//     const [pickedCoords, setPickedCoords] = useState(null);
//     const [showSurveyTable, setShowSurveyTable] = useState(false);
//     const [showUserStatus, setShowUserStatus] = useState(false);
//     const [currentMedia, setCurrentMedia] = useState(null);
//     const [uploadModalId, setUploadModalId] = useState(null);
//     const [searchDist, setSearchDist] = useState('');
//     const [searchBlock, setSearchBlock] = useState('');
//     const [searchGeneric, setSearchGeneric] = useState('');
//     const [searchDateFrom, setSearchDateFrom] = useState('');
//     const [searchDateTo, setSearchDateTo] = useState('');
//     const [filterStart, setFilterStart] = useState('');
//     const [filterEnd, setFilterEnd] = useState('');
//     const blockOptionsModal = searchDist ? DATA_HIERARCHY.blocks[searchDist] || [] : [];

//     const visibleDistricts = Object.keys(DATA_HIERARCHY.blocks).sort(); const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : []; const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : []; const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

//     useEffect(() => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition((pos) => { setMapCenter([pos.coords.latitude, pos.coords.longitude]); setMapZoom(12); }, (err) => console.warn("Loc denied")); } }, []);
//     useEffect(() => { if (selectedDistrict && DISTRICT_COORDS[selectedDistrict]) { setMapCenter(DISTRICT_COORDS[selectedDistrict]); setMapZoom(10); } }, [selectedDistrict]);
//     useEffect(() => { if (selectedBlock && selectedDistrict) { axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${selectedBlock}, ${selectedDistrict}, Uttar Pradesh, India`)}`).then(res => { if (res.data.length > 0) { setMapCenter([parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]); setMapZoom(13); } }); } }, [selectedBlock, selectedDistrict]);

//     const applyFilters = useCallback((data) => {
//         // refreshData();
//     }, []);

//     const refreshData = useCallback(async () => {
//         try {

//             const response = await axios.get(`${API_BASE}/surveys/all`,
//                 {
//                     params: {
//                         page: currentPage,
//                         limit: 10,
//                         submitted_by: role === 'admin' ? "" : user?.username,
//                         submitter_id: loginUserId,
//                         district: searchDist || "",
//                         block: searchBlock || "",
//                         start_date: searchDateFrom || "",
//                         end_date: searchDateTo || "",
//                         search: searchGeneric || ""
//                     }
//                 });
//             const { surveys, pagination } = response.data;
//             if (Array.isArray(surveys)) {
//                 const mergedData = surveys.map(s => {
//                     const mFiles = s.mediaFiles || [];
//                     const getProxyUrl = (path) => {
//                         if (!path) return null;
//                         // Remove JSON artifacts from DB string
//                         const cleanPath = path.replace(/[\[\]"']/g, '');
//                         return `${API_BASE}/surveys/read-file?path=${encodeURIComponent(cleanPath)}&mode=open&t=${Date.now()}`;
//                     };
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
//                 // applyFilters(mergedData);
//                 if (pagination) setTotalPages(pagination.totalPages);
//                 const lines = []; mergedData.forEach(s => { if (['HDD Start Point', 'HDD End Point'].includes(s.locationType)) { const lat = parseFloat(s.latitude); const lng = parseFloat(s.longitude); if (lat && lng) lines.push({ start: { lat, lng }, end: { lat: lat + 0.0001, lng: lng + 0.0001 }, name: s.routeName }); } }); setUserRoutes(lines);
//             }
//         } catch (e) { console.error("Fetch Error", e); }
//     }, [applyFilters, currentPage,  role,user?.username, searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

//     useEffect(() => {
//         refreshData();
//         if (role === 'admin') {
//             setUserStatuses([{ username: 'admin', status: 'Online', loginTime: new Date().toISOString() }]);
//             setLogs([{ displayTime: new Date().toLocaleString(), username: 'admin', action: 'LOGIN', details: 'System Access' }]);
//         }
//     }, [refreshData, role, currentPage, searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

//     // --- HANDLE SUBMIT (With Explicit File Keys) ---
//     const handleSurveySubmit = async (formData) => {
//         if (!formData || !formData.district) { alert("District is required"); return; }

//         try {
//             // Note: This logic assumes 'onSubmitData' calls the API. 
//             // Since this function is passed to SurveyForm, SurveyForm usually handles the UI loader.
//             // Dashboard.js handles the API logic here.

//             const apiData = new FormData();
//             const append = (key, value) => { if (value !== null && value !== undefined && value !== '') apiData.append(key, value); };

//             append('district', formData.district); append('block', formData.block); append('routeName', formData.routeName);
//             append('locationType', formData.locationType); append('shotNumber', formData.shotNumber || '0'); append('ringNumber', formData.ringNumber || '0');
//             append('startLocName', formData.startLocName); append('endLocName', formData.endLocName); append('fileNamePrefix', formData.generatedFileName);
//             append('surveyorName', formData.surveyorName); append('surveyorMobile', formData.surveyorMobile);
//             append('submittedBy', (user && user.username) ? user.username : (typeof user === 'string' ? user : 'admin'));
//             append('dateTime', formData.dateTime || new Date().toISOString()); append('latitude', formData.latitude); append('longitude', formData.longitude);
//             append('remarks', formData.remarks || '');
//             append('submitterId', loginUserId);

//             // --- EXPLICIT NAMING TO PREVENT MIXUP ---
//             // if (formData.sitePhotoBlob instanceof Blob) apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');
//             // if (formData.liveVideoBlob instanceof Blob) apiData.append('videos', formData.liveVideoBlob, 'live_video.mp4');
//             // if (formData.goproBlob instanceof Blob || formData.goproBlob instanceof File) apiData.append('videos', formData.goproBlob, 'gopro_video.mp4');
//             // if (formData.selfieBlob instanceof Blob) apiData.append('selfie', formData.selfieBlob, 'team_selfie.jpg');

//             if (formData.sitePhotoBlob instanceof Blob) apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');

//             // LIVE VIDEO -> 'live_video.mp4'
//             if (formData.liveVideoBlob instanceof Blob) apiData.append('videos', formData.liveVideoBlob, 'live_video.mp4');

//             // GOPRO -> 'gopro_video.mp4'
//             if (formData.goproBlob instanceof Blob || formData.goproBlob instanceof File) apiData.append('gopro', formData.goproBlob, 'gopro_video.mp4');

//             // SELFIE -> 'team_selfie.jpg'
//             if (formData.selfieBlob instanceof Blob) apiData.append('selfie', formData.selfieBlob, 'team_selfie.jpg');

//             const config = { headers: { 'Content-Type': 'multipart/form-data' } };
//             debugger;
//             let response = formData.id ? await axios.put(`${API_BASE}/surveys/${formData.id}`, apiData, config) : await axios.post(`${API_BASE}/surveys`, apiData, config);

//             // Success handled by SurveyForm's local state, but we refresh data here
//             if (response.data.success) {
//                 setTimeout(() => { refreshData(); }, 500);
//                 return true; // Return success to SurveyForm
//             }
//         } catch (e) {
//             console.error("FULL ERROR:", e);
//             throw e; // Throw to SurveyForm to handle UI error
//         }
//     };

//     const handleDeleteSurvey = async (id) => { if (window.confirm("Admin: Permanently delete this record?")) { try { await axios.delete(`${API_BASE}/surveys/${id}/cancel`); refreshData(); } catch (e) { console.error(e); alert("Failed to delete."); } } };

//     // --- VIEW MEDIA HANDLER (Use Mapped Props) ---
//     const handleViewMedia = (type, survey) => {
//         let mediaUrl = null; let ext = 'jpg';
//         if (type === 'video') { mediaUrl = survey.liveVideo; ext = 'mp4'; }
//         else if (type === 'gopro') { mediaUrl = survey.goproVideo; ext = 'mp4'; }
//         else if (type === 'photo') { mediaUrl = survey.sitePhoto; ext = 'jpg'; }

//         if (mediaUrl) { setCurrentMedia({ type, url: mediaUrl, filename: `file.${ext}`, meta: survey }); }
//         else { alert(`No ${type} found for this survey.`); }
//     };

//     const handleDirectDownload = async () => { if (!currentMedia || !currentMedia.url) return; try { const response = await fetch(currentMedia.url); const blob = await response.blob(); saveAs(blob, `${currentMedia.meta.generatedFileName}_${currentMedia.type}.${(currentMedia.type.includes('video') || currentMedia.type.includes('gopro')) ? 'mp4' : 'jpg'}`); } catch (e) { console.error("Download failed", e); } };
//     const handleDownloadZip = async () => { if (!currentMedia || !currentMedia.url) return; try { const response = await fetch(currentMedia.url); const blob = await response.blob(); const zip = new JSZip(); const ext = (currentMedia.type.includes('video') || currentMedia.type.includes('gopro')) ? 'mp4' : 'jpg'; zip.file(`${currentMedia.meta.generatedFileName}.${ext}`, blob); zip.file("details.txt", `Filename: ${currentMedia.meta.generatedFileName}\nSurveyor: ${currentMedia.meta.surveyorName}`); saveAs(await zip.generateAsync({ type: "blob" }), `${currentMedia.meta.generatedFileName}.zip`); } catch (e) { console.error("Zip failed", e); } };
//     const handleGoProUpload = async (e) => { const file = e.target.files[0]; if (!file || !uploadModalId) return; const formData = new FormData(); formData.append('videos', file, 'gopro_video.mp4'); try { await axios.put(`${API_BASE}/surveys/${uploadModalId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); alert("GoPro Uploaded Successfully!"); setUploadModalId(null); refreshData(); } catch (error) { console.error("Upload failed", error); alert("Upload Failed"); } };
//     const handlePickLocationStart = () => { setShowSurveyForm(false); setIsPickingLocation(true); };
//     const handleMapClick = (latlng) => { setPickedCoords(latlng); setIsPickingLocation(false); setShowSurveyForm(true); };
//     const getFilteredLogs = () => { if (!filterStart && !filterEnd) return logs; const s = new Date(filterStart).getTime(); const e = new Date(filterEnd).getTime() + 86400000; return logs.filter(l => new Date(l.isoTime).getTime() >= s && new Date(l.isoTime).getTime() <= e); };

//     const styles = {
//         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width: '100vw', fontFamily: 'Arial, sans-serif', overflow: 'hidden', position: 'fixed', top: 0, left: 0 },
//         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 2000, gap: '20px', overflowX: 'auto', whiteSpace: 'nowrap', flexShrink: 0 },
//         controls: { display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 },
//         headerLeft: { display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 },
//         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border: '1px solid #ccc', background: 'white', fontSize: '13px', cursor: 'pointer' },
//         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
//         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' },
//         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' },
//         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' },
//         table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
//         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color: '#555', fontWeight: 'bold' },
//         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color: '#333' },
//         actionBtn: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', marginRight: '5px', fontSize: '12px', fontWeight: 'bold' },
//         statusDot: { height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px' },
//         downloadBtn: { flex: 1, padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', border: 'none', color: 'white', textAlign: 'center', textDecoration: 'none', fontSize: '14px' },
//         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor: 'pointer' },
//         filterBox: { display: 'flex', gap: '10px', marginBottom: '15px', background: '#f5f5f5', padding: '15px', borderRadius: '6px', flexWrap: 'wrap', alignItems: 'center', border: '1px solid #e0e0e0' },
//         searchInput: { padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '180px' },
//         adminCard: { background: '#fff', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
//         adminHeader: { background: '#f5f5f5', padding: '10px 15px', borderBottom: '1px solid #ddd', fontWeight: 'bold', color: '#333' }
//     };

//     const handleSelectDistrict = (e) => {
//         const district = e.target.value;
//         setSelectedDistrict(district);
//         setSelectedBlock('');
//     };

//     const handleSelectBlock = (e) => {
//         const block = e.target.value;
//         setSelectedBlock(block);
//     };

//     return (
//         <div style={styles.container}>
//             <div style={styles.header}>
//                 <div style={styles.headerLeft}>
//                     <strong style={{ fontSize: '20px' }}>GIS</strong>
//                     <span style={styles.badge}>{(role || 'USER').toUpperCase()}</span>
//                     <select style={styles.select} value={selectedDistrict} onChange={e => handleSelectDistrict(e)}><option value="">District</option>{visibleDistricts.map(d => <option key={d}>{d}</option>)}</select>
//                     <select style={styles.select} value={selectedBlock} onChange={e => handleSelectBlock(e)}><option value="">Block</option>{blockOptions.map(b => <option key={b}>{b}</option>)}</select>
//                     <select style={styles.select} value={selectedSpan} onChange={e => setSelectedSpan(e.target.value)}><option value="">Span</option>{spanOptions.map(s => <option key={s}>{s}</option>)}</select>
//                     <select style={styles.select} value={selectedRing} onChange={e => setSelectedRing(e.target.value)}><option value="">Ring</option>{ringOptions.map(r => <option key={r}>{r}</option>)}</select>
//                 </div>
//                 <div style={styles.controls}>
//                     <button onClick={() => { setEditingSurvey(null); setIsViewMode(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
//                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({submittedSurveys.length})</button>
//                     {/* {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>} */}
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
//                 {userRoutes.map((route, idx) => (<Polyline key={`usr-${idx}`} positions={[route.start, route.end]} color="red" weight={5} dashArray="5, 10"><Popup>User HDD Route: {route.name}</Popup></Polyline>))}
//                 {diggingPoints.map((pt) => (<Marker key={pt.id} position={pt} icon={L.divIcon({ className: 'custom-dig-icon', html: `<div style="background-color: ${isRingView ? '#28a745' : '#ff8c00'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`, iconSize: [12, 12] })}><Popup><b>{pt.id}</b></Popup></Marker>))}
//                 {submittedSurveys.map(s => s.latitude && (
//                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
//                         <Popup minWidth={250}>
//                             <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
//                                 <div style={{ background: '#1a237e', color: 'white', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', marginBottom: '8px' }}>{s.locationType}</div>
//                                 <div><b>File:</b> {s.generatedFileName}</div>
//                                 <div><b>Route:</b> {s.routeName}</div>
//                                 <div style={{ marginTop: '10px' }}>
//                                     {s.liveVideo && <button style={{ ...styles.actionBtn, background: '#e65100', color: 'white' }} onClick={() => handleViewMedia('video', s)}>Video</button>}
//                                     {s.sitePhoto && <button style={{ ...styles.actionBtn, background: '#2e7d32', color: 'white' }} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
//                                 </div>
//                             </div>
//                         </Popup>
//                         <Tooltip direction="top" offset={[0, -10]} opacity={1}>
//                             <div style={{ textAlign: 'left', minWidth: '150px' }}>
//                                 {isRecent(s.survey_date) && <div style={{ background: '#e65100', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '3px', display: 'inline-block', marginBottom: '5px', fontWeight: 'bold' }}>RECENT</div>}
//                                 <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1a237e' }}>{s.locationType}</div>
//                                 <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#007bff', margin: '2px 0' }}>{s.generatedFileName || "No Filename"}</div>
//                                 <div style={{ fontSize: '11px', color: '#333' }}>Route: {s.routeName}</div>
//                                 <div style={{ fontSize: '11px', color: '#555' }}>Date: {getBSNLTimestamp(s.survey_date)}</div>
//                                 <div style={{ marginTop: '6px', paddingTop: '4px', borderTop: '1px solid #eee', display: 'flex', gap: '8px', fontSize: '11px', fontWeight: 'bold' }}>
//                                     {s.sitePhoto && <span style={{ color: '#2e7d32' }}>[Photo]</span>}
//                                     {s.liveVideo && <span style={{ color: '#d32f2f' }}>[Video]</span>}
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
//                     districts={visibleDistricts}
//                     blocks={DATA_HIERARCHY.blocks}
//                     onSubmitData={handleSurveySubmit}
//                     user={user}
//                     onPickLocation={handlePickLocationStart}
//                     initialData={editingSurvey}
//                     viewOnly={isViewMode}
//                 />
//             )}

//             {showSurveyTable && (
//                 <ModalWrapper title="Survey Database" onClose={() => setShowSurveyTable(false)}>
//                     <div style={styles.filterBox}>
//                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e => setSearchGeneric(e.target.value)} />
//                         <select 
//     style={styles.select} 
//     value={searchDist} 
//     onChange={e => { 
//         setSearchDist(e.target.value); 
//         setSearchBlock(''); // Reset block selection when district changes
//     }}
// >
//     <option value="">All Districts</option>
//     {visibleDistricts.map(d => <option key={d} value={d}>{d}</option>)}
// </select>

// {/* 2. Block Filter: Uses the modal-specific block list */}
// <select 
//     style={styles.select} 
//     value={searchBlock} 
//     onChange={e => setSearchBlock(e.target.value)} 
//     disabled={!searchDist} // Disable if no district is selected
// >
//     <option value="">All Blocks</option>
//     {blockOptionsModal.map(b => (
//         <option key={b} value={b}>{b}</option>
//     ))}
// </select>
//                         {/* <select style={styles.select} onChange={e => setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d => <option key={d}>{d}</option>)}</select>
//                         <select style={styles.select} onChange={e => setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b => <option key={b}>{b}</option>)}</select> */}
//                         <input type="date" style={styles.select} onChange={e => setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e => setSearchDateTo(e.target.value)} />
//                     </div>

//                     <table style={styles.table}>
//                         <thead>
//                             <tr style={{ textAlign: 'left', background: '#f9f9f9' }}>
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
//                             {submittedSurveys.map(s => {
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
//                                             {justEdited && <span style={{ marginLeft: '5px', fontSize: '9px', background: '#2e7d32', color: 'white', padding: '2px 4px', borderRadius: '3px' }}>UPDATED</span>}
//                                         </td>
//                                         <td style={styles.td}>
//                                             <div style={{ fontWeight: 'bold', color: '#2A4480', fontSize: '12px' }}>{s.submittedBy}</div>
//                                             <div style={{ fontSize: '10px', color: '#666' }}>{s.submittedBy === 'admin' ? 'Administrator' : 'Surveyor'}</div>
//                                         </td>
//                                         <td style={styles.td}>{s.shotNumber}</td>
//                                         <td style={styles.td}>{s.locationType}</td>
//                                         <td style={{ fontSize: '11px', color: '#444', ...styles.td }}>{formatTableDate(s.lastModifiedTime)}</td>
//                                         <td style={styles.td}>
//                                             {s.liveVideo && <button style={{ ...styles.actionBtn, color: 'green', borderColor: 'green', fontSize: '10px' }} onClick={() => handleViewMedia('video', s)}>Video</button>}
//                                             {s.sitePhoto && <button style={{ ...styles.actionBtn, color: 'green', borderColor: 'green', fontSize: '10px' }} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
//                                             {s.goproVideo && <button style={{ ...styles.actionBtn, color: '#1565c0', borderColor: '#1565c0', fontSize: '10px' }} onClick={() => handleViewMedia('gopro', s)}>GoPro</button>}
//                                         </td>
//                                         <td style={styles.td}>
//                                             <div style={{ display: 'flex' }}>
//                                                 <button style={{ ...styles.actionBtn, background: '#e3f2fd', color: '#0d47a1', border: '1px solid #0d47a1' }} onClick={() => { setEditingSurvey(s); setIsViewMode(true); setShowSurveyTable(false); setShowSurveyForm(true); }}>View</button>
//                                                 {(role === 'admin' || s.submittedBy === (user?.username || user)) && <button style={{ ...styles.actionBtn, background: '#fff3e0', color: '#e65100', border: '1px solid #e65100' }} onClick={() => { setEditingSurvey(s); setIsViewMode(false); setShowSurveyTable(false); setShowSurveyForm(true); }}>Edit</button>}
//                                                 {role === 'admin' && <button style={{ ...styles.actionBtn, color: 'red', borderColor: 'red' }} onClick={() => handleDeleteSurvey(s.id)}>Del</button>}
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>

//                     <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '15px', alignItems: 'center', borderTop: '1px solid #eee' }}>
//                         <button style={styles.btnWhite} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt; Prev</button>
//                         <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Page {currentPage} of {totalPages}</span>
//                         <button style={styles.btnWhite} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next &gt;</button>
//                     </div>
//                 </ModalWrapper>
//             )}

//             {showUserStatus && role === 'admin' && (
//                 <ModalWrapper title="Admin Logs" onClose={() => setShowUserStatus(false)}>
//                     {/* ... (Admin Log UI remains same) ... */}
//                 </ModalWrapper>
//             )}

//             {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={() => setUploadModalId(null)}><div style={{ padding: '20px' }}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}

//             {currentMedia && (
//                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
//                     <div style={{ textAlign: 'center', background: 'black', padding: '15px', borderRadius: '8px' }}>
//                         {currentMedia.type === 'video' || currentMedia.type === 'gopro' ? (<video src={currentMedia.url} controls style={{ width: '100%', maxHeight: '500px' }} />) : (<img src={currentMedia.url} alt="Evidence" style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />)}
//                         <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
//                             <button onClick={handleDirectDownload} style={{ ...styles.downloadBtn, background: '#43a047' }}>Download {currentMedia.type === 'photo' ? 'JPG' : 'MP4'}</button>
//                             <button onClick={handleDownloadZip} style={{ ...styles.downloadBtn, background: '#1e88e5' }}>Download ZIP</button>
//                         </div>
//                     </div>
//                 </ModalWrapper>
//             )}

//             {isPickingLocation && <div style={styles.pickingBanner} onClick={() => setIsPickingLocation(false)}>PICKING MODE ACTIVE - Click map</div>}
//         </div>
//     );
// };

// export default Dashboard;




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
// const API_BASE = process.env.REACT_APP_API_URL;

// const DISTRICT_COORDS = { 
//     "Ambedkar Nagar": [26.4416, 82.5925], 
//     "Ayodhya": [26.7992, 82.2023], 
//     "Azamgarh": [26.0669, 83.1861], 
//     "Ballia": [25.8398, 84.1523], 
//     "Balrampur": [27.4265, 82.1760], 
//     "Banda": [25.4800, 80.3340], 
//     "Barabanki": [26.9388, 81.1912], 
//     "Basti": [26.7937, 82.4700], 
//     "Bhadohi": [25.3941, 82.5709], 
//     "Deoria": [26.5056, 83.7780], 
//     "Ghazipur": [25.5794, 83.5684], 
//     "Gonda": [27.1303, 81.9669], 
//     "Gorakhpur": [26.7606, 83.3732], 
//     "Kushi Nagar": [26.9031, 83.8967], 
//     "Maharajganj": [27.1437, 83.5645], 
//     "Mau": [25.9452, 83.5599], 
//     "Mirzapur": [25.1337, 82.5644], 
//     "Sant Kabeer Nagar": [26.7329, 83.0261], 
//     "Siddharth Nagar": [27.2848, 82.7845], 
//     "Varanasi": [25.3176, 82.9739] 
// };

// const DATA_HIERARCHY = { 
//     blocks: { 
//         "Ambedkar Nagar": ["Bhiti", "Ram Nagar", "Akbarpur", "Baskhari", "Bhiyawan", "Jahangir Ganj", "Jalal Pur", "Katehari", "Tanda"], 
//         "Ayodhya": ["Bikapur", "Pura Bazar", "Amaniganj", "Hariyangatanganj", "Mawai", "Milkipur", "Rudauli", "Sohawal", "Tarun"], 
//         "Azamgarh": ["Mehnagar", "Azmatgarh", "Jahanaganj", "Rani Ki Sarai", "Lalganj", "Mahrajganj", "Palhani", "Mirzapur", "Tahbarpur", "Ahiraula", "Haraiya", "Koilsa", "Martinganj", "Mohammadpur", "Palhana", "Pawai", "Thekma", "Bilariyaganj", "Tarwa", "Phulpur", "Sathiyaon"], 
//         "Ballia": ["Garwar", "Bairia", "Bansdih", "Chilkahar", "Dubhar", "Maniar", "Rasra", "Reoti", "Belhari", "Beruarbari", "Hanumanganj", "Navanagar", "Pandah", "Sohanv", "Siar"], 
//         "Balrampur": ["Shriduttganj", "Balrampur", "Gaisri", "Harriya Satgharwa", "Pachpedwa", "Rahera Bazar", "Gaindas Bujurg", "Tulsipur", "Utraula"], 
//         "Banda": ["Bisanda", "Tindwari", "Badokhar Khurd"], 
//         "Barabanki": ["Suratganj", "Dariyabad", "Ramnagar", "Sirauli Gauspur", "Bani Kodar", "Haidargarh", "Nindaura", "Puredalai", "Trivediganj"], 
//         "Basti": ["Saltaua Gopal Pur", "Bahadurpur", "Basti", "Dubauliya", "Gaur", "Harraiya", "Kaptanganj", "Bankati", "Kudraha", "Paras Rampur", "Rudauli", "Sau Ghat", "Ramnagar", "Vikram Jot"], 
//         "Bhadohi": ["Deegh"], 
//         "Deoria": ["Bhatni", "Baitalpur", "Bankata", "Barhaj", "Bhagalpur", "Bhaluani", "Bhatpar Rani", "Deoria Sadar", "Desai Deoria", "Gauri Bazar", "Lar", "Pathar Dewa", "Rampur Karkhana", "Rudrapur", "Salempur", "Tarkalua"], 
//         "Ghazipur": ["Nagra", "Mohammadabad", "Virno"], 
//         "Gonda": ["Mankapur", "Haldharmau", "Babhanjot", "Belsar", "Chhapia", "Colonelganj", "Itiyathok", "Jhanjhari", "Katra Bazar", "Mujehana", "Pandri Kripal", "Paraspur", "Rupaideeh", "Tarabganj", "Nawabganj", "Wazirganj"], 
//         "Gorakhpur": ["Khorabar", "Pali", "Pipraich", "Brahmpur", "Sardarngar", "Bharohiya", "Bhathat", "Campierganj", "Belghat", "Chargawan", "Gagaha", "Gola", "Jangal Kaudia", "Kauri Ram", "Khajni", "Piprauli", "Sahjanawa", "Uruwa"], 
//         "Kushi Nagar": ["Dudhahi", "Fazilnagar", "Hata", "Kaptainganj", "Kasaya", "Khadda", "Motichak", "Nebua Naurangia", "Padrauna", "Ramkola", "Seorahi", "Sukrauli", "Tamkuhiraj", "Vishunpura"], 
//         "Maharajganj": ["Dhani", "Ghughli", "Lakshmipur", "Bridgemanganj", "Mithaura", "Nautanwa", "Nichlaul", "Pharenda", "Mahrajganj", "Paniyara", "Partawal", "Siswa"], 
//         "Mau": ["Atraulia", "Dohari Ghat", "Pardaha", "Badraon", "Fatehpur Madaun", "Ghosi", "Kopaganj", "Mohammadabad Gohana", "Ratanpura"], 
//         "Mirzapur": ["Lalganj"], 
//         "Sant Kabeer Nagar": ["Baghauli", "Belhar Kala", "Hainsar Bazar", "Khalilabad", "Mehdawal", "Nath Nagar", "Pauli", "Santha", "Semariyawan"], 
//         "Siddharth Nagar": ["Barhni", "Itwa", "Lotan", "Shohartgarh", "Ranipur", "Bansi", "Bhanwapur", "Birdpur", "Domariyaganj", "Jogia", "Khesraha", "Khuniyaon", "Mithwal", "Naugarh", "Uska Bazar"], 
//         "Varanasi": ["Baragaon", "Arajiline", "Harahua", "Pindra", "Sevapuri"] 
//     }, 
// };

// const TYPE_CODES = { 
//     "HDD Start Point": "HSP", 
//     "HDD End Point": "HEP", 
//     "Chamber Location": "CHM", 
//     "GP Location": "GPL", 
//     "Blowing Start Point": "BSP", 
//     "Blowing End Point": "BEP", 
//     "Coupler location": "CPL", 
//     "splicing": "SPL", 
//     "Other": "OTH" 
// };
// // --- HELPERS ---
// const isRecent = (timestamp) => { if (!timestamp) return false; const now = new Date(); const diffHours = Math.abs(now - new Date(timestamp)) / 36e5; return diffHours < 24; };
// const isJustUpdated = (dateString) => { if (!dateString) return false; const now = new Date(); const diffMins = (now - new Date(dateString)) / 60000; return diffMins < 15 && diffMins >= 0; };
// const formatTableDate = (dateString) => { if (!dateString) return '-'; return new Date(dateString).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }); };
// const getBSNLTimestamp = (dateString) => { const d = dateString ? new Date(dateString) : new Date(); return `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`; };

// // --- COMPONENTS ---
// const ModalWrapper = ({ children, title, onClose }) => (<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <div style={{ background: 'white', padding: '0', borderRadius: '8px', width: '95%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}> <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #eee', background: '#fff' }}> <h3 style={{ margin: 0, color: '#2A4480', fontSize: '18px' }}>{title}</h3> <button onClick={onClose} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>CLOSE</button> </div> <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</div> </div> </div>);
// const MapPickHandler = ({ isPicking, onPick }) => { useMapEvents({ click: (e) => { if (isPicking) onPick(e.latlng); } }); useEffect(() => { const el = document.querySelector('.leaflet-container'); if (el) el.style.cursor = isPicking ? 'crosshair' : 'grab'; }, [isPicking]); return null; };
// const MapUpdater = ({ center, zoom }) => { const map = useMap(); useEffect(() => { if (center) map.flyTo(center, zoom || 13, { duration: 1.5 }); }, [center, zoom, map]); return null; };

// const Dashboard = ({ user, role, onLogout, logAction }) => {
//     const loginUserId = localStorage.getItem("id") || '';

    
//     // --- 1. MOVED HOOKS INSIDE COMPONENT ---
//     const [isGlobalLoading, setIsGlobalLoading] = useState(false);
//     const [showAddUser, setShowAddUser] = useState(false);
//     const [regData, setRegData] = useState({ username: '', mobile: '', password: '', role: 'user' });
//     const [totalRecordsCount, setTotalRecordsCount] = useState(0); 

//     const [selectedDistrict, setSelectedDistrict] = useState(''); 
//     const [selectedBlock, setSelectedBlock] = useState(''); 
//     const [mapCenter, setMapCenter] = useState([26.8467, 80.9462]); 
//     const [mapZoom, setMapZoom] = useState(7);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [startPoint] = useState(null);
//     const [endPoint] = useState(null); 
//     const [displayPath] = useState([]); 
//     const [isRingView] = useState(false); 
//     const [diggingPoints] = useState([]);
//     const [submittedSurveys, setSubmittedSurveys] = useState([]);
//     const [userRoutes, setUserRoutes] = useState([]);
//     const [showSurveyForm, setShowSurveyForm] = useState(false);
//     const [editingSurvey, setEditingSurvey] = useState(null);
//     const [isViewMode, setIsViewMode] = useState(false);
//     const [isPickingLocation, setIsPickingLocation] = useState(false);
//     const [pickedCoords, setPickedCoords] = useState(null);
//     const [showSurveyTable, setShowSurveyTable] = useState(false);
//     const [currentMedia, setCurrentMedia] = useState(null);
//     const [uploadModalId, setUploadModalId] = useState(null);
//     const [searchDist, setSearchDist] = useState('');
//     const [searchBlock, setSearchBlock] = useState('');
//     const [searchGeneric, setSearchGeneric] = useState('');
//     const [searchDateFrom, setSearchDateFrom] = useState('');
//     const [searchDateTo, setSearchDateTo] = useState('');
//     const [regError, setRegError] = useState('');
// const [regSuccess, setRegSuccess] = useState('');
//     const blockOptionsModal = searchDist ? DATA_HIERARCHY.blocks[searchDist] || [] : [];

//     const GlobalLoader = () => (
//         <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 99999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
//             <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #1a237e', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
//             <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#1a237e' }}>Processing...</p>
//             <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
//         </div>
//     );

//     // --- 2. INTERCEPTOR FOR GLOBAL LOADER ---
//     useEffect(() => {
//         const reqInt = axios.interceptors.request.use((config) => { setIsGlobalLoading(true); return config; });
//         const resInt = axios.interceptors.response.use(
//             (response) => { setIsGlobalLoading(false); return response; },
//             (error) => { setIsGlobalLoading(false); return Promise.reject(error); }
//         );
//         return () => { axios.interceptors.request.eject(reqInt); axios.interceptors.response.eject(resInt); };
//     }, []);

//     const visibleDistricts = Object.keys(DATA_HIERARCHY.blocks).sort(); 
//     const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : [];

//     useEffect(() => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition((pos) => { setMapCenter([pos.coords.latitude, pos.coords.longitude]); setMapZoom(12); }, (err) => console.warn("Loc denied")); } }, []);
//     useEffect(() => { if (selectedDistrict && DISTRICT_COORDS[selectedDistrict]) { setMapCenter(DISTRICT_COORDS[selectedDistrict]); setMapZoom(10); } }, [selectedDistrict]);

//     // // --- 3. REFRESH DATA WITH TOTAL COUNT ---
//     // const refreshData = useCallback(async () => {
//     //     try {
//     //         const response = await axios.get(`${API_BASE}/surveys/all`, {
//     //             params: {
//     //                 page: currentPage,
//     //                 limit: 10,
//     //                 submitted_by: role === 'admin' ? "" : user?.username,
//     //                 submitter_id: loginUserId,
//     //                 district: searchDist || "",
//     //                 block: searchBlock || "",
//     //                 start_date: searchDateFrom || "",
//     //                 end_date: searchDateTo || "",
//     //                 search: searchGeneric || ""
//     //             }
//     //         });
//     //         const { surveys, pagination } = response.data;
//     //         if (Array.isArray(surveys)) {
//     //             const mergedData = surveys.map(s => {
//     //                 const mFiles = s.mediaFiles || [];
//     //                 const getProxyUrl = (path) => {
//     //                     if (!path) return null;
//     //                     const cleanPath = path.replace(/[[\]"']/g, ''); // FIXED REGEX
//     //                     return `${API_BASE}/surveys/read-file?path=${encodeURIComponent(cleanPath)}&mode=open&t=${Date.now()}`;
//     //                 };
//     //                 const getFileName = (f) => (f.filename || f.path || f.url || '').toLowerCase();
//     //                 let videoPool = mFiles.filter(f => f.type === 'video' || f.type === 'live_video' || f.type === 'gopro_video' || f.type === 'gopro' || (f.mimetype && f.mimetype.startsWith('video')));
//     //                 let imagePool = mFiles.filter(f => f.type === 'photo' || f.type === 'site_photo' || f.type === 'selfie' || (f.mimetype && f.mimetype.startsWith('image')));

//     //                 let goproObj = null, liveVideoObj = null, selfieObj = null, sitePhotoObj = null;

//     //                 const goproIndex = videoPool.findIndex(f => f.type === 'gopro' || f.type === 'gopro_video' || getFileName(f).includes('gopro'));
//     //                 if (goproIndex !== -1) { goproObj = videoPool[goproIndex]; videoPool.splice(goproIndex, 1); }

//     //                 const liveIndex = videoPool.findIndex(f => f.type === 'live_video' || getFileName(f).includes('live'));
//     //                 if (liveIndex !== -1) { liveVideoObj = videoPool[liveIndex]; videoPool.splice(liveIndex, 1); }
//     //                 else if (videoPool.length > 0) { liveVideoObj = videoPool.shift(); }

//     //                 const selfieIndex = imagePool.findIndex(f => f.type === 'selfie' || getFileName(f).includes('selfie'));
//     //                 if (selfieIndex !== -1) { selfieObj = imagePool[selfieIndex]; imagePool.splice(selfieIndex, 1); }

//     //                 const siteIndex = imagePool.findIndex(f => f.type === 'site_photo' || f.type === 'photo' || getFileName(f).includes('site'));
//     //                 if (siteIndex !== -1) { sitePhotoObj = imagePool[siteIndex]; imagePool.splice(siteIndex, 1); }
//     //                 else if (imagePool.length > 0) { sitePhotoObj = imagePool.shift(); }

//     //                 const getPath = (obj) => obj ? (obj.url || obj.path || obj.filename) : null;

//     //                 return {
//     //                     ...s,
//     //                     id: s.id,
//     //                     routeName: s.routeName || s.route_name,
//     //                     locationType: s.locationType || s.location_type,
//     //                     shotNumber: s.shotNumber || s.shot_number,
//     //                     ringNumber: s.ringNumber || s.ring_number,
//     //                     startLocName: s.startLocName || s.start_location,
//     //                     endLocName: s.endLocName || s.end_location,
//     //                     surveyorName: s.surveyor_name,
//     //                     surveyorMobile: s.surveyor_mobile,
//     //                     dateTime: s.survey_date,
//     //                     submittedBy: s.submittedBy || s.submitted_by || 'Unknown',
//     //                     lastModifiedTime: s.updated_at || s.updatedAt || s.created_at || s.survey_date,
//     //                     generatedFileName: s.generated_filename || `SURVEY_${s.id}`,
//     //                     latitude: parseFloat(s.latitude || 0), longitude: parseFloat(s.longitude || 0),
//     //                     sitePhoto: getPath(sitePhotoObj) ? getProxyUrl(getPath(sitePhotoObj)) : null,
//     //                     liveVideo: getPath(liveVideoObj) ? getProxyUrl(getPath(liveVideoObj)) : null,
//     //                     goproVideo: getPath(goproObj) ? getProxyUrl(getPath(goproObj)) : null,
//     //                     selfie: getPath(selfieObj) ? getProxyUrl(getPath(selfieObj)) : null,
//     //                     mediaFiles: mFiles
//     //                 };
//     //             });
//     //             setSubmittedSurveys(mergedData.sort((a, b) => new Date(b.lastModifiedTime) - new Date(a.lastModifiedTime)));
//     //             if (pagination) {
//     //                 setTotalPages(pagination.totalPages);
//     //                 setTotalRecordsCount(pagination.totalRecords); // Sets real count (e.g. 570)
//     //             }
//     //             const lines = []; mergedData.forEach(s => { if (['HDD Start Point', 'HDD End Point'].includes(s.locationType)) { const lat = parseFloat(s.latitude); const lng = parseFloat(s.longitude); if (lat && lng) lines.push({ start: { lat, lng }, end: { lat: lat + 0.0001, lng: lng + 0.0001 }, name: s.routeName }); } }); setUserRoutes(lines);
//     //         }
//     //     } catch (e) { console.error("Fetch Error", e); }
//     // }, [currentPage, role, user?.username, loginUserId, searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);
// // --- 3. REFRESH DATA WITH TOTAL COUNT ---
//     const refreshData = useCallback(async () => {
//         // --- ADDON: Safety check to prevent 400 error on refresh ---
//         // Prevents calling the API before the user session is initialized
//         if (!loginUserId && role !== 'admin') return;

//         try {
//             const response = await axios.get(`${API_BASE}/surveys/all`, {
//                 params: {
//                     page: currentPage,
//                     limit: 10,
//                     submitted_by: role === 'admin' ? "" : user?.username,
//                     submitter_id: loginUserId,
//                     district: searchDist || "",
//                     block: searchBlock || "",
//                     start_date: searchDateFrom || "",
//                     end_date: searchDateTo || "",
//                     search: searchGeneric || ""
//                 }
//             });
            
//             const { surveys, pagination } = response.data;

//             // --- ADDON: Handle Empty/Zero Records ---
//             // Ensures counts reset to 0 so UI buttons reflect "Data (0)"
//             if (!surveys || surveys.length === 0) {
//                 setSubmittedSurveys([]);
//                 setTotalPages(1);
//                 setTotalRecordsCount(0);
//                 setUserRoutes([]);
//                 return;
//             }

//             if (Array.isArray(surveys)) {
//                 const mergedData = surveys.map(s => {
//                     const mFiles = s.mediaFiles || [];
//                     const getProxyUrl = (path) => {
//                         if (!path) return null;
//                         // FIXED REGEX: Removes artifacts without ESLint escape errors
//                         const cleanPath = path.replace(/[[\]"']/g, ''); 
//                         return `${API_BASE}/surveys/read-file?path=${encodeURIComponent(cleanPath)}&mode=open&t=${Date.now()}`;
//                     };
                    
//                     const getFileName = (f) => (f.filename || f.path || f.url || '').toLowerCase();
//                     let videoPool = mFiles.filter(f => f.type === 'video' || f.type === 'live_video' || f.type === 'gopro_video' || f.type === 'gopro' || (f.mimetype && f.mimetype.startsWith('video')));
//                     let imagePool = mFiles.filter(f => f.type === 'photo' || f.type === 'site_photo' || f.type === 'selfie' || (f.mimetype && f.mimetype.startsWith('image')));

//                     let goproObj = null, liveVideoObj = null, selfieObj = null, sitePhotoObj = null;

//                     const goproIndex = videoPool.findIndex(f => f.type === 'gopro' || f.type === 'gopro_video' || getFileName(f).includes('gopro'));
//                     if (goproIndex !== -1) { goproObj = videoPool[goproIndex]; videoPool.splice(goproIndex, 1); }

//                     const liveIndex = videoPool.findIndex(f => f.type === 'live_video' || getFileName(f).includes('live'));
//                     if (liveIndex !== -1) { liveVideoObj = videoPool[liveIndex]; videoPool.splice(liveIndex, 1); }
//                     else if (videoPool.length > 0) { liveVideoObj = videoPool.shift(); }

//                     const selfieIndex = imagePool.findIndex(f => f.type === 'selfie' || getFileName(f).includes('selfie'));
//                     if (selfieIndex !== -1) { selfieObj = imagePool[selfieIndex]; imagePool.splice(selfieIndex, 1); }

//                     const siteIndex = imagePool.findIndex(f => f.type === 'site_photo' || f.type === 'photo' || getFileName(f).includes('site'));
//                     if (siteIndex !== -1) { sitePhotoObj = imagePool[siteIndex]; imagePool.splice(siteIndex, 1); }
//                     else if (imagePool.length > 0) { sitePhotoObj = imagePool.shift(); }

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
                
//                 // --- ADDON: Update Real Total Data Count ---
//                 if (pagination) {
//                     setTotalPages(pagination.totalPages || 1);
//                     setTotalRecordsCount(pagination.totalRecords || 0); // Sets full count (e.g. 570)
//                 }

//                 const lines = []; 
//                 mergedData.forEach(s => { 
//                     if (['HDD Start Point', 'HDD End Point'].includes(s.locationType)) { 
//                         const lat = parseFloat(s.latitude); 
//                         const lng = parseFloat(s.longitude); 
//                         if (lat && lng) lines.push({ start: { lat, lng }, end: { lat: lat + 0.0001, lng: lng + 0.0001 }, name: s.routeName }); 
//                     } 
//                 }); 
//                 setUserRoutes(lines);
//             }
//         } catch (e) { 
//             console.error("Fetch Error", e); 
//             // Reset count on error so button doesn't show wrong data
//             setTotalRecordsCount(0); 
//         }
//     }, [currentPage, role, user?.username, loginUserId, searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo, setSubmittedSurveys, setTotalPages, setTotalRecordsCount, setUserRoutes]);
//     useEffect(() => { refreshData(); }, [refreshData]);
// const handleAdminRegister = async (e) => {
//     e.preventDefault();
//     setRegError('');
//     setRegSuccess('');
    
//     try {
//         const res = await axios.post(`${API_BASE}/users/register`, regData);
        
//         if (res.status === 201 || res.data.success) {
//             setRegSuccess("User Created Successfully!");
//             // Reset and close after 2 seconds
//             setTimeout(() => {
//                 setShowAddUser(false);
//                 setRegSuccess('');
//                 setRegData({ username: '', mobile: '', password: '', role: 'user' });
//             }, 2000);
//         }
//     } catch (err) {
//         // Specifically catches 400 errors like "User already registered"
//         const msg = err.response?.data?.error || err.response?.data?.message || "Registration failed.";
//         setRegError(msg);
//     }
// };

//     const handleSurveySubmit = async (formData) => {
//         if (!formData || !formData.district) { alert("District is required"); return; }
//         try {
//             const apiData = new FormData();
//             const append = (key, value) => { if (value !== null && value !== undefined && value !== '') apiData.append(key, value); };
//             append('district', formData.district); append('block', formData.block); append('routeName', formData.routeName);
//             append('locationType', formData.locationType); append('shotNumber', formData.shotNumber || '0'); append('ringNumber', formData.ringNumber || '0');
//             append('startLocName', formData.startLocName); append('endLocName', formData.endLocName); append('fileNamePrefix', formData.generatedFileName);
//             append('surveyorName', formData.surveyorName); append('surveyorMobile', formData.surveyorMobile);
//             append('submittedBy', user?.username || 'admin');
//             append('dateTime', formData.dateTime || new Date().toISOString()); append('latitude', formData.latitude); append('longitude', formData.longitude);
//             append('remarks', formData.remarks || ''); append('submitterId', loginUserId);
//             if (formData.sitePhotoBlob instanceof Blob) apiData.append('photos', formData.sitePhotoBlob, 'site_photo.jpg');
//             if (formData.liveVideoBlob instanceof Blob) apiData.append('videos', formData.liveVideoBlob, 'live_video.mp4');
//             if (formData.goproBlob instanceof Blob) apiData.append('gopro', formData.goproBlob, 'gopro_video.mp4');
//             if (formData.selfieBlob instanceof Blob) apiData.append('selfie', formData.selfieBlob, 'team_selfie.jpg');

//             let response = formData.id ? await axios.put(`${API_BASE}/surveys/${formData.id}`, apiData) : await axios.post(`${API_BASE}/surveys`, apiData);
//             if (response.data.success) { setTimeout(() => { refreshData(); }, 500); return true; }
//         } catch (e) { throw e; }
//     };

//     const handleDeleteSurvey = async (id) => { if (window.confirm("Admin: Permanently delete this record?")) { try { await axios.delete(`${API_BASE}/surveys/${id}/cancel`); refreshData(); } catch (e) { alert("Failed to delete."); } } };
//     const handleViewMedia = (type, survey) => {
//         let mediaUrl = type === 'video' ? survey.liveVideo : type === 'gopro' ? survey.goproVideo : survey.sitePhoto;
//         if (mediaUrl) setCurrentMedia({ type, url: mediaUrl, meta: survey });
//         else alert(`No ${type} found.`);
//     };

//     const styles = {
//         container: { display: 'flex', flexDirection: 'column', height: '100dvh', width: '100vw', fontFamily: 'Arial, sans-serif', overflow: 'hidden', position: 'fixed', top: 0, left: 0 },
//         header: { padding: '10px 15px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 2000, gap: '20px', overflowX: 'auto', whiteSpace: 'nowrap', flexShrink: 0 },
//         controls: { display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 },
//         headerLeft: { display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 },
//         select: { padding: '8px 10px', borderRadius: '4px', minWidth: '100px', border: '1px solid #ccc', background: 'white', fontSize: '13px', cursor: 'pointer' },
//         badge: { background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginLeft: '8px' },
//         btnGreen: { padding: '8px 14px', background: '#00e676', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' },
//         btnWhite: { padding: '8px 14px', background: '#fff', color: '#1a237e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' },
//         btnRed: { padding: '8px 14px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' },
//         table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
//         th: { background: '#f9f9f9', padding: '12px', borderBottom: '2px solid #eee', textAlign: 'left', color: '#555', fontWeight: 'bold' },
//         td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color: '#333' },
//         actionBtn: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', marginRight: '5px', fontSize: '12px', fontWeight: 'bold' },
//         input: { padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' },
//         label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' },
//         filterBox: { display: 'flex', gap: '10px', marginBottom: '15px', background: '#f5f5f5', padding: '15px', borderRadius: '6px', flexWrap: 'wrap', alignItems: 'center', border: '1px solid #e0e0e0' },
//         searchInput: { padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '180px' },
//         pickingBanner: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff4444', color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 9999, cursor: 'pointer' },
//     };

//     return (
//         <div style={styles.container}>
//             {isGlobalLoading && <GlobalLoader />}
//             <div style={styles.header}>
//                 <div style={styles.headerLeft}>
//                     <strong style={{ fontSize: '20px' }}>GIS</strong>
//                     <span style={styles.badge}>{(role || 'USER').toUpperCase()}</span>
//                     <select style={styles.select} value={selectedDistrict} onChange={e => { setSelectedDistrict(e.target.value); setSelectedBlock(''); }}><option value="">District</option>{visibleDistricts.map(d => <option key={d}>{d}</option>)}</select>
//                     <select style={styles.select} value={selectedBlock} onChange={e => setSelectedBlock(e.target.value)}><option value="">Block</option>{blockOptions.map(b => <option key={b}>{b}</option>)}</select>
//                 </div>
//                 <div style={styles.controls}>
//                     {role === 'admin' && <button onClick={() => setShowAddUser(true)} style={styles.btnWhite}>+ User</button>}
//                     <button onClick={() => { setEditingSurvey(null); setIsViewMode(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
//                     <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({totalRecordsCount})</button>
//                     <button onClick={onLogout} style={styles.btnRed}>Logout</button>
//                 </div>
//             </div>

//             <MapContainer center={mapCenter} zoom={mapZoom} style={{ flex: 1 }}>
//                 <MapUpdater center={mapCenter} zoom={mapZoom} />
//                 <MapPickHandler isPicking={isPickingLocation} onPick={(ll) => { setPickedCoords(ll); setIsPickingLocation(false); setShowSurveyForm(true); }} />
//                 <LayersControl position="topright">
//                     <LayersControl.BaseLayer checked name="Street"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /></LayersControl.BaseLayer>
//                     <LayersControl.BaseLayer name="Satellite"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" /></LayersControl.BaseLayer>
//                 </LayersControl>
//                 {submittedSurveys.map(s => s.latitude && (
//                     <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={SurveyIcon}>
//                         <Popup minWidth={250}>
//                             <div style={{ fontSize: '13px' }}>
//                                 <div style={{ background: '#1a237e', color: 'white', padding: '5px', borderRadius: '4px', fontWeight: 'bold' }}>{s.locationType}</div>
//                                 <div><b>File:</b> {s.generatedFileName}</div>
//                                 <div><b>Route:</b> {s.routeName}</div>
//                                 <div style={{ marginTop: '10px' }}>
//                                     {s.liveVideo && <button style={styles.actionBtn} onClick={() => handleViewMedia('video', s)}>Video</button>}
//                                     {s.sitePhoto && <button style={styles.actionBtn} onClick={() => handleViewMedia('photo', s)}>Photo</button>}
//                                 </div>
//                             </div>
//                         </Popup>
//                     </Marker>
//                 ))}
//             </MapContainer>

//             {showSurveyForm && (
//                 <SurveyForm
//                     onClose={() => { setShowSurveyForm(false); refreshData(); }}
//                     pickedCoords={pickedCoords} districts={visibleDistricts} blocks={DATA_HIERARCHY.blocks}
//                     onSubmitData={handleSurveySubmit} user={user} onPickLocation={() => { setShowSurveyForm(false); setIsPickingLocation(true); }}
//                     initialData={editingSurvey} viewOnly={isViewMode}
//                 />
//             )}

//             {showSurveyTable && (
//                 <ModalWrapper title={`Survey Database - Showing ${totalRecordsCount} Records`} onClose={() => setShowSurveyTable(false)}>
//                     <div style={styles.filterBox}>
//                         <input type="text" style={styles.searchInput} placeholder="Search..." onChange={e => setSearchGeneric(e.target.value)} />
//                         <select style={styles.select} value={searchDist} onChange={e => { setSearchDist(e.target.value); setSearchBlock(''); }}><option value="">All Districts</option>{visibleDistricts.map(d => <option key={d}>{d}</option>)}</select>
//                         <select style={styles.select} value={searchBlock} onChange={e => setSearchBlock(e.target.value)} disabled={!searchDist}><option value="">All Blocks</option>{blockOptionsModal.map(b => <option key={b}>{b}</option>)}</select>
//                         <input type="date" style={styles.select} onChange={e => setSearchDateFrom(e.target.value)} /><span>to</span><input type="date" style={styles.select} onChange={e => setSearchDateTo(e.target.value)} />
//                     </div>
//                     <table style={styles.table}>
//                         <thead><tr><th style={styles.th}>Filename</th><th style={styles.th}>User</th><th style={styles.th}>Type</th><th style={styles.th}>Last Mod.</th><th style={styles.th}>Media</th><th style={styles.th}>Action</th></tr></thead>
//                         <tbody>
//                             {submittedSurveys.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Data Count is showing Zero after searching</td></tr> : 
//                                 submittedSurveys.map(s => (
//                                     <tr key={s.id} style={{ backgroundColor: isJustUpdated(s.lastModifiedTime) ? '#e8f5e9' : 'white' }}>
//                                         <td style={styles.td}><b>{s.generatedFileName}</b></td>
//                                         <td style={styles.td}>{s.submittedBy}</td>
//                                         <td style={styles.td}>{s.locationType}</td>
//                                         <td style={styles.td}>{formatTableDate(s.lastModifiedTime)}</td>
//                                         <td style={styles.td}>
//                                             {s.liveVideo && <button style={styles.actionBtn} onClick={() => handleViewMedia('video', s)}>Vid</button>}
//                                             {s.sitePhoto && <button style={styles.actionBtn} onClick={() => handleViewMedia('photo', s)}>Img</button>}
//                                         </td>
//                                         <td style={styles.td}>
//                                             <button style={styles.actionBtn} onClick={() => { setEditingSurvey(s); setIsViewMode(true); setShowSurveyTable(false); setShowSurveyForm(true); }}>View</button>
//                                             {role === 'admin' && <button style={{ ...styles.actionBtn, color: 'red' }} onClick={() => handleDeleteSurvey(s.id)}>Del</button>}
//                                         </td>
//                                     </tr>
//                                 ))
//                             }
//                         </tbody>
//                     </table>
//                     <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '15px', borderTop: '1px solid #eee' }}>
//                         <button style={styles.btnWhite} disabled={currentPage === 1 || submittedSurveys.length === 0} onClick={() => setCurrentPage(1)}>First</button>
//                         <button style={styles.btnWhite} disabled={currentPage === 1 || submittedSurveys.length === 0} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt; Prev</button>
//                         <span style={{ alignSelf: 'center' }}>Page {currentPage} of {totalPages}</span>
//                         <button style={styles.btnWhite} disabled={currentPage === totalPages || submittedSurveys.length === 0} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next &gt;</button>
//                         <button style={styles.btnWhite} disabled={currentPage === totalPages || submittedSurveys.length === 0} onClick={() => setCurrentPage(totalPages)}>Last</button>
//                     </div>
//                 </ModalWrapper>
//             )}

//             {showAddUser && (
//     <ModalWrapper 
//         title="Add New User / Surveyor" 
//         onClose={() => { setShowAddUser(false); setRegError(''); setRegSuccess(''); }}
//     >
//         <form onSubmit={handleAdminRegister} style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
//             {/* Inline Message Dialogue */}
//             {regError && (
//                 <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', fontSize: '13px', textAlign: 'center', border: '1px solid #ef9a9a' }}>
//                     ⚠️ {regError}
//                 </div>
//             )}
//             {regSuccess && (
//                 <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '4px', fontSize: '13px', textAlign: 'center', border: '1px solid #a5d6a7' }}>
//                     ✅ {regSuccess}
//                 </div>
//             )}

//             <div>
//                 <label style={styles.label}>Username</label>
//                 <input 
//                     type="text" 
//                     style={styles.input} 
//                     required 
//                     value={regData.username} 
//                     onChange={e => setRegData({...regData, username: e.target.value})} 
//                 />
//             </div>

//             <div>
//                 <label style={styles.label}>Mobile Number</label>
//                 <input 
//                     type="tel" 
//                     style={styles.input} 
//                     required 
//                     pattern="[0-9]{10}" 
//                     value={regData.mobile} 
//                     onChange={e => setRegData({...regData, mobile: e.target.value})} 
//                 />
//             </div>

//             <div>
//                 <label style={styles.label}>Password</label>
//                 <input 
//                     type="password" 
//                     style={styles.input} 
//                     required 
//                     value={regData.password} 
//                     onChange={e => setRegData({...regData, password: e.target.value})} 
//                 />
//             </div>

//             <div>
//                 <label style={styles.label}>Role</label>
//                 <select 
//                     style={styles.select} 
//                     value={regData.role} 
//                     onChange={e => setRegData({...regData, role: e.target.value})}
//                 >
//                     <option value="user">User (Surveyor)</option>
//                     <option value="admin">Admin</option>
//                 </select>
//             </div>

//             <button type="submit" style={{ ...styles.btnGreen, padding: '12px', marginTop: '10px' }}>
//                 CREATE USER
//             </button>
//         </form>
//     </ModalWrapper>
// )}

//             {currentMedia && (
//                 <ModalWrapper title="Viewer" onClose={() => setCurrentMedia(null)}>
//                     <div style={{ textAlign: 'center', background: 'black', padding: '15px', borderRadius: '8px' }}>
//                         {currentMedia.type.includes('video') ? <video src={currentMedia.url} controls style={{ width: '100%', maxHeight: '500px' }} /> : <img src={currentMedia.url} alt="Evidence" style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />}
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

const DISTRICT_COORDS = { 
    "Ambedkar Nagar": [26.4416, 82.5925], 
    "Ayodhya": [26.7992, 82.2023], 
    "Azamgarh": [26.0669, 83.1861], 
    "Ballia": [25.8398, 84.1523], 
    "Balrampur": [27.4265, 82.1760], 
    "Banda": [25.4800, 80.3340], 
    "Barabanki": [26.9388, 81.1912], 
    "Basti": [26.7937, 82.4700], 
    "Bhadohi": [25.3941, 82.5709], 
    "Deoria": [26.5056, 83.7780], 
    "Ghazipur": [25.5794, 83.5684], 
    "Gonda": [27.1303, 81.9669], 
    "Gorakhpur": [26.7606, 83.3732], 
    "Kushi Nagar": [26.9031, 83.8967], 
    "Maharajganj": [27.1437, 83.5645], 
    "Mau": [25.9452, 83.5599], 
    "Mirzapur": [25.1337, 82.5644], 
    "Sant Kabeer Nagar": [26.7329, 83.0261], 
    "Siddharth Nagar": [27.2848, 82.7845], 
    "Varanasi": [25.3176, 82.9739] 
};

const DATA_HIERARCHY = { 
    blocks: { 
        "Ambedkar Nagar": ["Bhiti", "Ram Nagar", "Akbarpur", "Baskhari", "Bhiyawan", "Jahangir Ganj", "Jalal Pur", "Katehari", "Tanda"], 
        "Ayodhya": ["Bikapur", "Pura Bazar", "Amaniganj", "Hariyangatanganj", "Mawai", "Milkipur", "Rudauli", "Sohawal", "Tarun"], 
        "Azamgarh": ["Mehnagar", "Azmatgarh", "Jahanaganj", "Rani Ki Sarai", "Lalganj", "Mahrajganj", "Palhani", "Mirzapur", "Tahbarpur", "Ahiraula", "Haraiya", "Koilsa", "Martinganj", "Mohammadpur", "Palhana", "Pawai", "Thekma", "Bilariyaganj", "Tarwa", "Phulpur", "Sathiyaon"], 
        "Ballia": ["Garwar", "Bairia", "Bansdih", "Chilkahar", "Dubhar", "Maniar", "Rasra", "Reoti", "Belhari", "Beruarbari", "Hanumanganj", "Navanagar", "Pandah", "Sohanv", "Siar"], 
        "Balrampur": ["Shriduttganj", "Balrampur", "Gaisri", "Harriya Satgharwa", "Pachpedwa", "Rahera Bazar", "Gaindas Bujurg", "Tulsipur", "Utraula"], 
        "Banda": ["Bisanda", "Tindwari", "Badokhar Khurd"], 
        "Barabanki": ["Suratganj", "Dariyabad", "Ramnagar", "Sirauli Gauspur", "Bani Kodar", "Haidargarh", "Nindaura", "Puredalai", "Trivediganj"], 
        "Basti": ["Saltaua Gopal Pur", "Bahadurpur", "Basti", "Dubauliya", "Gaur", "Harraiya", "Kaptanganj", "Bankati", "Kudraha", "Paras Rampur", "Rudauli", "Sau Ghat", "Ramnagar", "Vikram Jot"], 
        "Bhadohi": ["Deegh"], 
        "Deoria": ["Bhatni", "Baitalpur", "Bankata", "Barhaj", "Bhagalpur", "Bhaluani", "Bhatpar Rani", "Deoria Sadar", "Desai Deoria", "Gauri Bazar", "Lar", "Pathar Dewa", "Rampur Karkhana", "Rudrapur", "Salempur", "Tarkalua"], 
        "Ghazipur": ["Nagra", "Mohammadabad", "Virno"], 
        "Gonda": ["Mankapur", "Haldharmau", "Babhanjot", "Belsar", "Chhapia", "Colonelganj", "Itiyathok", "Jhanjhari", "Katra Bazar", "Mujehana", "Pandri Kripal", "Paraspur", "Rupaideeh", "Tarabganj", "Nawabganj", "Wazirganj"], 
        "Gorakhpur": ["Khorabar", "Pali", "Pipraich", "Brahmpur", "Sardarngar", "Bharohiya", "Bhathat", "Campierganj", "Belghat", "Chargawan", "Gagaha", "Gola", "Jangal Kaudia", "Kauri Ram", "Khajni", "Piprauli", "Sahjanawa", "Uruwa"], 
        "Kushi Nagar": ["Dudhahi", "Fazilnagar", "Hata", "Kaptainganj", "Kasaya", "Khadda", "Motichak", "Nebua Naurangia", "Padrauna", "Ramkola", "Seorahi", "Sukrauli", "Tamkuhiraj", "Vishunpura"], 
        "Maharajganj": ["Dhani", "Ghughli", "Lakshmipur", "Bridgemanganj", "Mithaura", "Nautanwa", "Nichlaul", "Pharenda", "Mahrajganj", "Paniyara", "Partawal", "Siswa"], 
        "Mau": ["Atraulia", "Dohari Ghat", "Pardaha", "Badraon", "Fatehpur Madaun", "Ghosi", "Kopaganj", "Mohammadabad Gohana", "Ratanpura"], 
        "Mirzapur": ["Lalganj"], 
        "Sant Kabeer Nagar": ["Baghauli", "Belhar Kala", "Hainsar Bazar", "Khalilabad", "Mehdawal", "Nath Nagar", "Pauli", "Santha", "Semariyawan"], 
        "Siddharth Nagar": ["Barhni", "Itwa", "Lotan", "Shohartgarh", "Ranipur", "Bansi", "Bhanwapur", "Birdpur", "Domariyaganj", "Jogia", "Khesraha", "Khuniyaon", "Mithwal", "Naugarh", "Uska Bazar"], 
        "Varanasi": ["Baragaon", "Arajiline", "Harahua", "Pindra", "Sevapuri"] 
    }, 
    spans: {}, 
    rings: {} 
};

const TYPE_CODES = { 
    "HDD Start Point": "HSP", 
    "HDD End Point": "HEP", 
    "Chamber Location": "CHM", 
    "GP Location": "GPL", 
    "Blowing Start Point": "BSP", 
    "Blowing End Point": "BEP", 
    "Coupler location": "CPL", 
    "splicing": "SPL", 
    "Other": "OTH" 
};

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
    const loginUserId = localStorage.getItem("id") || '';
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const [regData, setRegData] = useState({ username: '', mobile: '', password: '', role: 'user' });
    const [totalRecordsCount, setTotalRecordsCount] = useState(0); 

    const [selectedDistrict, setSelectedDistrict] = useState(''); const [selectedBlock, setSelectedBlock] = useState(''); const [selectedSpan, setSelectedSpan] = useState(''); const [selectedRing, setSelectedRing] = useState('');
    const [mapCenter, setMapCenter] = useState([26.8467, 80.9462]); const [mapZoom, setMapZoom] = useState(7);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null); const [displayPath, setDisplayPath] = useState([]); const [isRingView, setIsRingView] = useState(false); const [diggingPoints, setDiggingPoints] = useState([]);
    const [submittedSurveys, setSubmittedSurveys] = useState([]);
    const [filteredSurveys, setFilteredSurveys] = useState([]);
    const [userRoutes, setUserRoutes] = useState([]);
    const [userStatuses, setUserStatuses] = useState([]);
    const [logs, setLogs] = useState([]);
    const [showSurveyForm, setShowSurveyForm] = useState(false);
    const [editingSurvey, setEditingSurvey] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [isPickingLocation, setIsPickingLocation] = useState(false);
    const [pickedCoords, setPickedCoords] = useState(null);
    const [showSurveyTable, setShowSurveyTable] = useState(false);
    const [showUserStatus, setShowUserStatus] = useState(false);
    const [currentMedia, setCurrentMedia] = useState(null);
    const [uploadModalId, setUploadModalId] = useState(null);
    const [searchDist, setSearchDist] = useState('');
    const [searchBlock, setSearchBlock] = useState('');
    const [searchGeneric, setSearchGeneric] = useState('');
    const [searchDateFrom, setSearchDateFrom] = useState('');
    const [searchDateTo, setSearchDateTo] = useState('');
    const [filterStart, setFilterStart] = useState('');
    const [filterEnd, setFilterEnd] = useState('');
    const [regError, setRegError] = useState('');
const [regSuccess, setRegSuccess] = useState('');
    const blockOptionsModal = searchDist ? DATA_HIERARCHY.blocks[searchDist] || [] : [];
const GlobalLoader = () => (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 99999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #1a237e', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#1a237e' }}>Processing...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
     useEffect(() => {
        const reqInt = axios.interceptors.request.use((config) => { setIsGlobalLoading(true); return config; });
        const resInt = axios.interceptors.response.use(
            (response) => { setIsGlobalLoading(false); return response; },
            (error) => { setIsGlobalLoading(false); return Promise.reject(error); }
        );
        return () => { axios.interceptors.request.eject(reqInt); axios.interceptors.response.eject(resInt); };
    }, []);
    const visibleDistricts = Object.keys(DATA_HIERARCHY.blocks).sort(); const blockOptions = selectedDistrict ? DATA_HIERARCHY.blocks[selectedDistrict] || [] : []; const spanOptions = selectedBlock ? DATA_HIERARCHY.spans[selectedBlock] || [] : []; const ringOptions = selectedSpan ? DATA_HIERARCHY.rings[selectedSpan] || [] : [];

    useEffect(() => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition((pos) => { setMapCenter([pos.coords.latitude, pos.coords.longitude]); setMapZoom(12); }, (err) => console.warn("Loc denied")); } }, []);
    useEffect(() => { if (selectedDistrict && DISTRICT_COORDS[selectedDistrict]) { setMapCenter(DISTRICT_COORDS[selectedDistrict]); setMapZoom(10); } }, [selectedDistrict]);
    useEffect(() => { if (selectedBlock && selectedDistrict) { axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${selectedBlock}, ${selectedDistrict}, Uttar Pradesh, India`)}`).then(res => { if (res.data.length > 0) { setMapCenter([parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]); setMapZoom(13); } }); } }, [selectedBlock, selectedDistrict]);

    const applyFilters = useCallback((data) => {
        // refreshData();
    }, []);

    const refreshData = useCallback(async () => {
         if (!loginUserId && role !== 'admin') return;

        try {

            const response = await axios.get(`${API_BASE}/surveys/all`,
                {
                    params: {
                        page: currentPage,
                        limit: 10,
                        submitted_by: role === 'admin' ? "" : user?.username,
                        submitter_id: loginUserId,
                        district: searchDist || "",
                        block: searchBlock || "",
                        start_date: searchDateFrom || "",
                        end_date: searchDateTo || "",
                        search: searchGeneric || ""
                    }
                });
            const { surveys, pagination } = response.data;
             if (!surveys || surveys.length === 0) {
                setSubmittedSurveys([]);
                setTotalPages(1);
                setTotalRecordsCount(0);
                // setUserRoutes([]); --edit
                return;
            }

            if (Array.isArray(surveys)) {
                const mergedData = surveys.map(s => {
                    const mFiles = s.mediaFiles || [];
                    const getProxyUrl = (path) => {
                        if (!path) return null;
                        // Remove JSON artifacts from DB string
                        const cleanPath = path.replace(/[\[\]"']/g, '');
                        return `${API_BASE}/surveys/read-file?path=${encodeURIComponent(cleanPath)}&mode=open&t=${Date.now()}`;
                    };
                    const getFileName = (f) => (f.filename || f.path || f.url || '').toLowerCase();

                    // --- STRICT "BUCKET" SEPARATION ---
                    // 1. Separate into pools
                    let videoPool = mFiles.filter(f => f.type === 'video' || f.type === 'live_video' || f.type === 'gopro_video' || f.type === 'gopro' || (f.mimetype && f.mimetype.startsWith('video')));
                    let imagePool = mFiles.filter(f => f.type === 'photo' || f.type === 'site_photo' || f.type === 'selfie' || (f.mimetype && f.mimetype.startsWith('image')));

                    let goproObj = null, liveVideoObj = null, selfieObj = null, sitePhotoObj = null;

                    // 2a. Find GoPro (Strict) -> Remove from pool
                    const goproIndex = videoPool.findIndex(f => f.type === 'gopro' || f.type === 'gopro_video' || getFileName(f).includes('gopro'));
                    if (goproIndex !== -1) { goproObj = videoPool[goproIndex]; videoPool.splice(goproIndex, 1); }

                    // 2b. Find Live Video (Strict + Fallback) -> Remove from pool
                    const liveIndex = videoPool.findIndex(f => f.type === 'live_video' || getFileName(f).includes('live'));
                    if (liveIndex !== -1) { liveVideoObj = videoPool[liveIndex]; videoPool.splice(liveIndex, 1); }
                    else if (videoPool.length > 0) { liveVideoObj = videoPool.shift(); } // Fallback to remaining

                    // 3a. Find Selfie (Strict) -> Remove from pool
                    const selfieIndex = imagePool.findIndex(f => f.type === 'selfie' || getFileName(f).includes('selfie'));
                    if (selfieIndex !== -1) { selfieObj = imagePool[selfieIndex]; imagePool.splice(selfieIndex, 1); }

                    // 3b. Find Site Photo (Strict + Fallback) -> Remove from pool
                    const siteIndex = imagePool.findIndex(f => f.type === 'site_photo' || f.type === 'photo' || getFileName(f).includes('site'));
                    if (siteIndex !== -1) { sitePhotoObj = imagePool[siteIndex]; imagePool.splice(siteIndex, 1); }
                    else if (imagePool.length > 0) { sitePhotoObj = imagePool.shift(); } // Fallback to remaining

                    const getPath = (obj) => obj ? (obj.url || obj.path || obj.filename) : null;

                    return {
                        ...s,
                        id: s.id,
                        routeName: s.routeName || s.route_name,
                        locationType: s.locationType || s.location_type,
                        shotNumber: s.shotNumber || s.shot_number,
                        ringNumber: s.ringNumber || s.ring_number,
                        startLocName: s.startLocName || s.start_location,
                        endLocName: s.endLocName || s.end_location,
                        surveyorName: s.surveyor_name,
                        surveyorMobile: s.surveyor_mobile,
                        dateTime: s.survey_date,
                        submittedBy: s.submittedBy || s.submitted_by || 'Unknown',
                        lastModifiedTime: s.updated_at || s.updatedAt || s.created_at || s.survey_date,
                        generatedFileName: s.generated_filename || `SURVEY_${s.id}`,
                        latitude: parseFloat(s.latitude || 0), longitude: parseFloat(s.longitude || 0),

                        // ASSIGN STRICTLY
                        sitePhoto: getPath(sitePhotoObj) ? getProxyUrl(getPath(sitePhotoObj)) : null,
                        liveVideo: getPath(liveVideoObj) ? getProxyUrl(getPath(liveVideoObj)) : null,
                        goproVideo: getPath(goproObj) ? getProxyUrl(getPath(goproObj)) : null,
                        selfie: getPath(selfieObj) ? getProxyUrl(getPath(selfieObj)) : null,

                        mediaFiles: mFiles
                    };
                });
                setSubmittedSurveys(mergedData.sort((a, b) => new Date(b.lastModifiedTime) - new Date(a.lastModifiedTime)));
                // applyFilters(mergedData);
                if (pagination) {
                    setTotalPages(pagination.totalPages || 1);
                    setTotalRecordsCount(pagination.totalRecords || 0); // Sets full count (e.g. 570)
                }
const lines = []; 
                mergedData.forEach(s => { 
                    if (['HDD Start Point', 'HDD End Point'].includes(s.locationType)) { 
                        const lat = parseFloat(s.latitude); 
                        const lng = parseFloat(s.longitude); 
                        if (lat && lng) lines.push({ start: { lat, lng }, end: { lat: lat + 0.0001, lng: lng + 0.0001 }, name: s.routeName }); 
                    } 
                }); 
                setUserRoutes(lines);
            }            
        } catch (e) { console.error("Fetch Error", e); }
         setTotalRecordsCount(0); 
    }, [applyFilters, currentPage,  role,user?.username, searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);

    useEffect(() => {
        refreshData();
        if (role === 'admin') {
            setUserStatuses([{ username: 'admin', status: 'Online', loginTime: new Date().toISOString() }]);
            setLogs([{ displayTime: new Date().toLocaleString(), username: 'admin', action: 'LOGIN', details: 'System Access' }]);
        }
    }, [refreshData, role, currentPage, searchDist, searchBlock, searchGeneric, searchDateFrom, searchDateTo]);
const handleAdminRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    
    try {
        const res = await axios.post(`${API_BASE}/users/register`, regData);
        
        if (res.status === 201 || res.data.success) {
            setRegSuccess("User Created Successfully!");
            // Reset and close after 2 seconds
            setTimeout(() => {
                setShowAddUser(false);
                setRegSuccess('');
                setRegData({ username: '', mobile: '', password: '', role: 'user' });
            }, 2000);
        }
    } catch (err) {
        // Specifically catches 400 errors like "User already registered"
        const msg = err.response?.data?.error || err.response?.data?.message || "Registration failed.";
        setRegError(msg);
    }
};
    // --- HANDLE SUBMIT (With Explicit File Keys) ---
    const handleSurveySubmit = async (formData) => {
        if (!formData || !formData.district) { alert("District is required"); return; }

        try {
            // Note: This logic assumes 'onSubmitData' calls the API. 
            // Since this function is passed to SurveyForm, SurveyForm usually handles the UI loader.
            // Dashboard.js handles the API logic here.

            const apiData = new FormData();
            const append = (key, value) => { if (value !== null && value !== undefined && value !== '') apiData.append(key, value); };

            append('district', formData.district); append('block', formData.block); append('routeName', formData.routeName);
            append('locationType', formData.locationType); append('shotNumber', formData.shotNumber || '0'); append('ringNumber', formData.ringNumber || '0');
            append('startLocName', formData.startLocName); append('endLocName', formData.endLocName); append('fileNamePrefix', formData.generatedFileName);
            append('surveyorName', formData.surveyorName); append('surveyorMobile', formData.surveyorMobile);
            append('submittedBy', (user && user.username) ? user.username : (typeof user === 'string' ? user : 'admin'));
            append('dateTime', formData.dateTime || new Date().toISOString()); append('latitude', formData.latitude); append('longitude', formData.longitude);
            append('remarks', formData.remarks || '');
            append('submitterId', loginUserId);

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
const formInputStyle = {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#fafafa'
};

const submitBtnStyle = {
    background: '#00e676',
    color: '#000',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    marginTop: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: '0.2s'
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

    const handleSelectDistrict = (e) => {
        const district = e.target.value;
        setSelectedDistrict(district);
        setSelectedBlock('');
    };

    const handleSelectBlock = (e) => {
        const block = e.target.value;
        setSelectedBlock(block);
    };

    return (
        <div style={styles.container}>
             {isGlobalLoading && <GlobalLoader />}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <strong style={{ fontSize: '20px' }}>GIS</strong>
                    <span style={styles.badge}>{(role || 'USER').toUpperCase()}</span>
                    <select style={styles.select} value={selectedDistrict} onChange={e => handleSelectDistrict(e)}><option value="">District</option>{visibleDistricts.map(d => <option key={d}>{d}</option>)}</select>
                    <select style={styles.select} value={selectedBlock} onChange={e => handleSelectBlock(e)}><option value="">Block</option>{blockOptions.map(b => <option key={b}>{b}</option>)}</select>
                    {/* <select style={styles.select} value={selectedSpan} onChange={e => setSelectedSpan(e.target.value)}><option value="">Span</option>{spanOptions.map(s => <option key={s}>{s}</option>)}</select>
                    <select style={styles.select} value={selectedRing} onChange={e => setSelectedRing(e.target.value)}><option value="">Ring</option>{ringOptions.map(r => <option key={r}>{r}</option>)}</select> */}
                </div>
                <div style={styles.controls}>
                     {role === 'admin' && <button onClick={() => setShowAddUser(true)} style={styles.btnWhite}>+ User</button>}
                    <button onClick={() => { setEditingSurvey(null); setIsViewMode(false); setShowSurveyForm(true); }} style={styles.btnGreen}>+ New</button>
                    <button onClick={() => setShowSurveyTable(true)} style={styles.btnWhite}>Data ({submittedSurveys.length})</button>
                    {/* {role === 'admin' && <button onClick={() => setShowUserStatus(true)} style={styles.btnWhite}>Logs</button>} */}
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
                    blocks={DATA_HIERARCHY.blocks}
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
                        <select 
    style={styles.select} 
    value={searchDist} 
    onChange={e => { 
        setSearchDist(e.target.value); 
        setSearchBlock(''); // Reset block selection when district changes
    }}
>
    <option value="">All Districts</option>
    {visibleDistricts.map(d => <option key={d} value={d}>{d}</option>)}
</select>

{/* 2. Block Filter: Uses the modal-specific block list */}
<select 
    style={styles.select} 
    value={searchBlock} 
    onChange={e => setSearchBlock(e.target.value)} 
    disabled={!searchDist} // Disable if no district is selected
>
    <option value="">All Blocks</option>
    {blockOptionsModal.map(b => (
        <option key={b} value={b}>{b}</option>
    ))}
</select>
                        {/* <select style={styles.select} onChange={e => setSearchDist(e.target.value)}><option value="">All Districts</option>{visibleDistricts.map(d => <option key={d}>{d}</option>)}</select>
                        <select style={styles.select} onChange={e => setSearchBlock(e.target.value)}><option value="">All Blocks</option>{blockOptions.map(b => <option key={b}>{b}</option>)}</select> */}
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
                            
                            {submittedSurveys.map(s => {
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
                                                <button style={{ ...styles.actionBtn, background: '#e3f2fd', color: '#0d47a1', border: '1px solid #0d47a1' }} onClick={() => { setEditingSurvey(s); setIsViewMode(true); setShowSurveyTable(false); setShowSurveyForm(true); }}>View</button>
                                                {(role === 'admin' || s.submittedBy === (user?.username || user)) && <button style={{ ...styles.actionBtn, background: '#fff3e0', color: '#e65100', border: '1px solid #e65100' }} onClick={() => { setEditingSurvey(s); setIsViewMode(false); setShowSurveyTable(false); setShowSurveyForm(true); }}>Edit</button>}
                                                {role === 'admin' && <button style={{ ...styles.actionBtn, color: 'red', borderColor: 'red' }} onClick={() => handleDeleteSurvey(s.id)}>Del</button>}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                             
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '15px', alignItems: 'center', borderTop: '1px solid #eee' }}>
                        <button style={styles.btnWhite} disabled={currentPage === 1 || totalRecordsCount === 0} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt; Prev</button>
                        <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Page {currentPage} of {totalPages}</span>
                        <button style={styles.btnWhite} disabled={currentPage === totalPages|| totalRecordsCount === 0} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next &gt;</button>
                    </div>
                </ModalWrapper>
            )}

            {showUserStatus && role === 'admin' && (
                <ModalWrapper title="Admin Logs" onClose={() => setShowUserStatus(false)}>
                    {/* ... (Admin Log UI remains same) ... */}
                </ModalWrapper>
            )}

         {uploadModalId && <ModalWrapper title="Upload GoPro" onClose={() => setUploadModalId(null)}><div style={{ padding: '20px' }}><input type="file" accept="video/*" onChange={handleGoProUpload} /></div></ModalWrapper>}
         {/* --new update */}
{showAddUser && (
    <ModalWrapper 
        title="Add New User / Surveyor" 
        onClose={() => { setShowAddUser(false); setRegError(''); setRegSuccess(''); }}
    >
        <div style={{ maxWidth: '450px', margin: '0 auto', padding: '10px' }}>
            <form onSubmit={handleAdminRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* Message Dialogue */}
                {regError && (
                    <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', fontSize: '13px', textAlign: 'center', border: '1px solid #ef9a9a', fontWeight: '500' }}>
                        ⚠️ {regError}
                    </div>
                )}
                {regSuccess && (
                    <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '8px', fontSize: '13px', textAlign: 'center', border: '1px solid #a5d6a7', fontWeight: '500' }}>
                        ✅ {regSuccess}
                    </div>
                )}

                {/* Input Fields Container */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', rowGap: '15px', columnGap: '10px' }}>
                    
                    <label style={{ fontWeight: '600', color: '#555', fontSize: '14px' }}>Username</label>
                    <input 
                        type="text" 
                        style={formInputStyle} 
                        required 
                        placeholder="Enter username"
                        value={regData.username} 
                        onChange={e => setRegData({...regData, username: e.target.value})} 
                    />

                    <label style={{ fontWeight: '600', color: '#555', fontSize: '14px' }}>Mobile No.</label>
                    <input 
                        type="tel" 
                        style={formInputStyle} 
                        required 
                        placeholder="10-digit number"
                        pattern="[0-9]{10}" 
                        value={regData.mobile} 
                        onChange={e => setRegData({...regData, mobile: e.target.value})} 
                    />

                    <label style={{ fontWeight: '600', color: '#555', fontSize: '14px' }}>Password</label>
                    <input 
                        type="password" 
                        style={formInputStyle} 
                        required 
                        placeholder="••••••••"
                        value={regData.password} 
                        onChange={e => setRegData({...regData, password: e.target.value})} 
                    />

                    <label style={{ fontWeight: '600', color: '#555', fontSize: '14px' }}>Assign Role</label>
                    <select 
                        style={formInputStyle} 
                        value={regData.role} 
                        onChange={e => setRegData({...regData, role: e.target.value})}
                    >
                        <option value="user">User (Surveyor)</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>

                <button type="submit" style={submitBtnStyle}>
                    CREATE USER ACCOUNT
                </button>
            </form>
        </div>
    </ModalWrapper>
)}
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