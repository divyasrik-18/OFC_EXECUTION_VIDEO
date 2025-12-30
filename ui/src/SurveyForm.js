import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import GeoCamera from './GeoCamera';
import LocationMap from './LocationMap';

const LOCATION_TYPES = [
    "HDD Start Point", "HDD End Point", "Chamber Location", "GP Location",
    "Blowing Start Point", "Blowing End Point", "Coupler location", "splicing", "Other"
];

const VIDEO_REQUIRED_TYPES = ["HDD Start Point", "HDD End Point", "Blowing Start Point", "Blowing End Point"];

const TYPE_CODES = {
    "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
    "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
    "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
};

// --- HELPER: Format Date ---
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
};

// --- HELPER: Generate Filename ---
const generateBSNLName = (district, block, type, shotNo) => {
    if (!district || !block || !type) return "BSNL_FILE";
    const distCode = district.substring(0, 3).toUpperCase();
    const blockCode = block.substring(0, 3).toUpperCase();
    const typeCode = TYPE_CODES[type] || "OTH";
    const d = new Date();
    const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
    return `${distCode}_${blockCode}_${typeCode}_SHOTNO${shotNo}_${dateStr}`;
};

const SurveyForm = ({ onClose, pickedCoords, districts = [], blocks = [], onSubmitData, user, initialData, viewOnly }) => {

    // --- INITIALIZATION ---
    const defaultName = user?.username || (typeof user === 'string' ? user : '') || '';
    const defaultMobile = user?.mobile || '';

    const [formData, setFormData] = useState(initialData || {
        id: null,
        district: '', block: '', routeName: '', dateTime: '',
        startLocName: '', endLocName: '', ringNumber: '',
        latitude: '', longitude: '', locationType: '', shotNumber: '',
        surveyorName: defaultName,
        surveyorMobile: defaultMobile,
        liveVideo: null, goproVideo: null, sitePhoto: null, selfie: null,
        // Blobs for uploading
        liveVideoBlob: null, sitePhotoBlob: null, selfieBlob: null, goproBlob: null
    });

    const [showGeoCamera, setShowGeoCamera] = useState(false);
    const [cameraMode, setCameraMode] = useState(null);
    const [gpsLoading, setGpsLoading] = useState(false);

    // --- NEW STATES FOR LOADER & SUCCESS MODAL ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Modes
    const isNewEntry = !viewOnly && !initialData;
    const isEditExisting = !viewOnly && !!initialData;

    // --- STYLES ---
    const styles = {
        overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
        container: { background: '#f4f6f8', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        header: { padding: '15px 20px', background: '#1a237e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
        body: { flex: 1, overflowY: 'auto', padding: '20px' },
        row: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' },
        col: { flex: 1, minWidth: '200px' },
        label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#333' },
        input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize: '14px', boxSizing: 'border-box' },
        disabledInput: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#e9ecef', fontSize: '14px', boxSizing: 'border-box', color: '#888', cursor: 'not-allowed' },
        readOnlyInput: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#e9ecef', fontSize: '14px', boxSizing: 'border-box', color: '#333', cursor: 'default' },
        select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', fontSize: '14px', boxSizing: 'border-box' },
        locSection: { background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', marginBottom: '15px' },
        previewCard: { marginTop: '10px', background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
        mediaWrapper: { position: 'relative', width: '100%', background: '#000', borderRadius: '4px', overflow: 'hidden', marginBottom: '5px' },
        mediaContent: { width: '100%', maxHeight: '350px', objectFit: 'contain', display: 'block', background: '#000' },
        fsBtnOverlay: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', zIndex: 20 },
        mapContainer: { height: '250px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd', marginTop: '15px' },
        downloadRow: { display: 'flex', gap: '10px', marginTop: '5px' },
        downBtn: { flex: 1, padding: '10px', fontSize: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' },
        btn: { padding: '10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', width: '100%', textAlign: 'center', fontWeight: 'bold', display: 'block', boxSizing: 'border-box', border: 'none', color: 'white' },
        gpsStatus: { padding: '10px', textAlign: 'center', background: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' },
        submitBtn: { width: '100%', padding: '15px', background: isSubmitting ? '#bdbdbd' : '#e65100', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '10px' },
        mediaBtn: { padding: '12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', width: '100%', textAlign: 'center', fontWeight: 'bold', display: 'block', boxSizing: 'border-box' },
        emptyBox: { padding: '30px', textAlign: 'center', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '4px', color: '#888', fontStyle: 'italic' },

        // --- LOADER STYLES ---
        loaderOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
        spinner: { width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #e65100', borderRadius: '50%', animation: 'spin 1s linear infinite' },

        // --- SUCCESS MODAL STYLES ---
        successModal: { background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', textAlign: 'center', minWidth: '300px' },
        successIcon: { fontSize: '50px', color: '#4caf50', marginBottom: '15px' },
        successTitle: { fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '10px' },
        successBtn: { background: '#4caf50', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '5px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' }
    };

    // --- GPS LOGIC ---
    const fetchHighAccuracyGPS = () => {
        if (!navigator.geolocation) return;
        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: pos.coords.latitude.toFixed(6),
                    longitude: pos.coords.longitude.toFixed(6),
                    dateTime: new Date().toLocaleString()
                }));
                setGpsLoading(false);
            },
            (err) => {
                console.warn("GPS Error:", err);
                setGpsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        if (pickedCoords && isNewEntry) {
            setFormData(prev => ({
                ...prev,
                latitude: pickedCoords.lat.toFixed(6),
                longitude: pickedCoords.lng.toFixed(6),
                dateTime: new Date().toLocaleString()
            }));
        }
    }, [pickedCoords, isNewEntry]);

    useEffect(() => {
        if (isNewEntry && !pickedCoords && !formData.latitude) {
            fetchHighAccuracyGPS();
        }
    }, [isNewEntry]);

    const handleChange = (e) => {
        if (viewOnly) return;
        if (e.target.name === 'district') {
            setFormData(prev => ({ ...prev, district: e.target.value, block: '', routeName: '' }));
        } else {
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    // --- UPDATED GEOCAMERA CAPTURE LOGIC ---
    const handleCameraCapture = (url, blob, capturedCoords) => {
        // Safe check to prevent .toFixed(6) error on undefined
        const safeLat = capturedCoords?.lat || formData.latitude || 0;
        const safeLng = capturedCoords?.lng || capturedCoords?.lon || formData.longitude || 0;

        const updates = {
            latitude: Number(safeLat).toFixed(6),
            longitude: Number(safeLng).toFixed(6),
            dateTime: new Date().toLocaleString()
        };

        // Strict mapping based on camera mode
        if (cameraMode === 'video') {
            updates.liveVideo = url;
            updates.liveVideoBlob = blob;
        }
        else if (cameraMode === 'photo') {
            updates.sitePhoto = url;
            updates.sitePhotoBlob = blob;
        }
        else if (cameraMode === 'selfie') {
            updates.selfie = url;
            updates.selfieBlob = blob;
        }

        setFormData(prev => ({ ...prev, ...updates }));
        setShowGeoCamera(false);
    };

    const downloadMedia = (type, isZip) => {
        let blob, url;
        if (type === 'video') { blob = formData.liveVideoBlob; url = formData.liveVideo; }
        else if (type === 'gopro') { blob = formData.goproBlob; url = formData.goproVideo; }
        else if (type === 'selfie') { blob = formData.selfieBlob; url = formData.selfie; }
        else { blob = formData.sitePhotoBlob; url = formData.sitePhoto; }

        if (!blob && !url) { alert("No file to download"); return; }
        const isVideo = (type === 'video' || type === 'gopro');
        const ext = isVideo ? 'mp4' : 'jpg';
        const finalName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);
        const fileNameWithExt = `${finalName}_${type.toUpperCase()}.${ext}`;

        if (isZip) {
            const zip = new JSZip();
            if (blob) zip.file(fileNameWithExt, blob);
            else { saveAs(url, fileNameWithExt); return; }
            zip.file("details.txt", `Date: ${new Date().toLocaleString()}`);
            zip.generateAsync({ type: "blob" }).then(content => saveAs(content, `${finalName}.zip`));
        } else {
            if (blob) saveAs(blob, fileNameWithExt); else saveAs(url, fileNameWithExt);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData(prev => ({ ...prev, goproVideo: URL.createObjectURL(e.target.files[0]), goproBlob: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (viewOnly || isSubmitting) return;

        if (isNewEntry) {
            if (VIDEO_REQUIRED_TYPES.includes(formData.locationType) && !formData.liveVideo) { alert("Live Video Required"); return; }
            if (!formData.sitePhoto) { alert("Live Photo Required"); return; }
        }

        if (!formData.selfie) { alert("Team Selfie is Required"); return; }

        setIsSubmitting(true);

        try {
            const finalFileName = generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber);

            await onSubmitData({
                ...formData,
                generatedFileName: finalFileName,
                id: initialData ? initialData.id : null,
                sitePhotoBlob: formData.sitePhotoBlob,
                liveVideoBlob: formData.liveVideoBlob,
                goproBlob: formData.goproBlob,
                selfieBlob: formData.selfieBlob
            });

            setShowSuccessModal(true);

        } catch (error) {
            alert("Submission Failed: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const finishSubmission = () => {
        setShowSuccessModal(false);
        onClose();
    };

    const requestFullscreen = (id) => {
        const elem = document.getElementById(id);
        if (elem && elem.requestFullscreen) elem.requestFullscreen();
    };

    const renderMediaCard = (type, src) => {
        const isVideo = (type === 'video' || type === 'gopro');
        const elementId = `media_${type}`;
        const canDelete = !viewOnly;
        const showPreviewMap = type === 'photo' || type === 'video';

        return (
            <div style={styles.previewCard}>
                <div style={styles.mediaWrapper}>
                    {isVideo ?
                        <video id={elementId} src={src} controls playsInline style={styles.mediaContent} /> :
                        <img id={elementId} src={src} alt={type} style={styles.mediaContent} />
                    }
                    <button type="button" onClick={() => requestFullscreen(elementId)} style={styles.fsBtnOverlay}>Fullscreen</button>
                </div>

                {showPreviewMap && (
                    <div style={{ marginTop: '10px', marginBottom: '5px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', marginBottom: '3px' }}>Captured Location:</div>
                        <div style={{ height: '150px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
                            <LocationMap
                                lat={parseFloat(formData.latitude || 0)}
                                lng={parseFloat(formData.longitude || 0)}
                            />
                        </div>
                    </div>
                )}
                <div style={styles.downloadRow}>
                    <button type="button" onClick={() => downloadMedia(type, false)} style={{ ...styles.downBtn, background: '#43a047' }}>Download {isVideo ? 'MP4' : 'JPG'}</button>
                    <button type="button" onClick={() => downloadMedia(type, true)} style={{ ...styles.downBtn, background: '#1976d2' }}>Download ZIP</button>
                    {canDelete && (
                        <button
                            type="button"
                            onClick={() => setFormData(prev => {
                                const newState = { ...prev };
                                if (type === 'video') { newState.liveVideo = null; newState.liveVideoBlob = null; }
                                if (type === 'photo') { newState.sitePhoto = null; newState.sitePhotoBlob = null; }
                                if (type === 'gopro') { newState.goproVideo = null; newState.goproBlob = null; }
                                if (type === 'selfie') { newState.selfie = null; newState.selfieBlob = null; }
                                return newState;
                            })}
                            style={{ ...styles.downBtn, background: '#d32f2f' }}
                        >
                            {isEditExisting ? "Retake / Delete" : "Delete"}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const flatBlocks = formData.district ? blocks[formData.district] : [];
    const isStep1Valid = !!formData.district;
    const isStep2Valid = isStep1Valid && !!formData.block;
    const isStep3Valid = isStep2Valid && !!formData.routeName;

    const getInputStyle = (isEnabled) => {
        if (viewOnly) return styles.readOnlyInput;
        return isEnabled ? styles.input : styles.disabledInput;
    };

    return (
        <div style={styles.overlay}>
            <style>
                {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
            </style>

            {isSubmitting && (
                <div style={styles.loaderOverlay}>
                    <div style={styles.spinner}></div>
                    <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Uploading Data & Media...</div>
                </div>
            )}

            {showSuccessModal && (
                <div style={styles.overlay}>
                    <div style={styles.successModal}>
                        <div style={styles.successIcon}>✓</div>
                        <div style={styles.successTitle}>Success!</div>
                        <button onClick={finishSubmission} style={styles.successBtn}>OK, CLOSE</button>
                    </div>
                </div>
            )}

            {/* UPDATED GEOCAMERA CALL: Added Metadata for the overlay display */}
            {showGeoCamera && (
                <GeoCamera
                    mode={cameraMode}
                    onCapture={handleCameraCapture}
                    onClose={() => setShowGeoCamera(false)}
                    metaData={{
                        district: formData.district,
                        block: formData.block,
                        route: formData.routeName
                    }}
                />
            )}

            <div style={styles.container}>
                <div style={styles.header}>
                    <h3 style={{ margin: 0 }}>{viewOnly ? "View Details" : (isEditExisting ? "Edit Survey" : "New Survey")}</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>×</button>
                </div>

                <form style={styles.body} onSubmit={handleSubmit}>

                    <div style={styles.row}>
                        <div style={styles.col}>
                            <label style={styles.label}>1. District</label>
                            {isEditExisting || viewOnly ? (
                                <input value={formData.district || ''} style={styles.readOnlyInput} readOnly />
                            ) : (
                                <select name="district" value={formData.district || ''} style={getInputStyle(true)} onChange={handleChange} required>
                                    <option value="">Select District</option>{districts.map(d => <option key={d}>{d}</option>)}
                                </select>
                            )}
                        </div>
                        <div style={styles.col}>
                            <label style={styles.label}>2. Block</label>
                            {isEditExisting || viewOnly ? (
                                <input value={formData.block || ''} style={styles.readOnlyInput} readOnly />
                            ) : (
                                <select name="block" value={formData.block || ''} style={getInputStyle(isStep1Valid)} onChange={handleChange} disabled={!isStep1Valid} required>
                                    <option value="">Select Block</option>{flatBlocks.map((b, i) => <option key={`${b}-${i}`} value={b}>{b}</option>)}
                                </select>
                            )}
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.col}><label style={styles.label}>3. Route Name</label><input name="routeName" value={formData.routeName || ''} style={getInputStyle(isStep2Valid)} onChange={handleChange} readOnly={viewOnly} disabled={!isStep2Valid && !viewOnly} required /></div>
                        <div style={styles.col}><label style={styles.label}>4. Date (Auto)</label><input value={formatDate(formData.dateTime)} readOnly style={styles.readOnlyInput} /></div>
                    </div>

                    <div style={styles.locSection}>
                        <label style={styles.label}>5. Location Type</label>
                        {isEditExisting || viewOnly ? (
                            <input value={formData.locationType || ''} style={styles.readOnlyInput} readOnly />
                        ) : (
                            <select name="locationType" value={formData.locationType || ''} style={getInputStyle(isStep3Valid)} onChange={handleChange} disabled={!isStep3Valid} required><option value="">Select Type</option>{LOCATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
                        )}
                        {formData.locationType && <div style={{ textAlign: 'center', padding: '10px', background: '#e3f2fd', borderRadius: '4px', marginTop: '10px', border: '1px dashed #2196f3' }}><small style={{ fontWeight: 'bold', color: '#1565c0' }}>File Name Generated:</small><br /><code style={{ fontSize: '14px', color: '#333' }}>{generateBSNLName(formData.district, formData.block, formData.locationType, formData.shotNumber || 'X')}</code></div>}
                    </div>

                    <div style={styles.row}>
                        <div style={styles.col}><label style={styles.label}>6. Start Loc</label><input name="startLocName" value={formData.startLocName || ''} style={getInputStyle(true)} onChange={handleChange} readOnly={viewOnly} required /></div>
                        <div style={styles.col}><label style={styles.label}>7. End Loc</label><input name="endLocName" value={formData.endLocName || ''} style={getInputStyle(true)} onChange={handleChange} readOnly={viewOnly} required /></div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.col}><label style={styles.label}>8. Ring No</label><input name="ringNumber" value={formData.ringNumber || ''} style={getInputStyle(true)} onChange={handleChange} readOnly={viewOnly} required /></div>
                        <div style={styles.col}><label style={styles.label}>9. Shot No</label><input name="shotNumber" value={formData.shotNumber || ''} style={getInputStyle(true)} onChange={handleChange} readOnly={viewOnly} required /></div>
                    </div>

                    <div style={styles.locSection}>
                        <label style={styles.label}>10. Location Point</label>
                        {gpsLoading && <div style={styles.gpsStatus}>Fetching high-accuracy GPS...</div>}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input value={formData.latitude || ''} readOnly style={styles.readOnlyInput} placeholder="Lat" />
                            <input value={formData.longitude || ''} readOnly style={styles.readOnlyInput} placeholder="Lng" />
                        </div>
                        <div style={styles.mapContainer}><LocationMap lat={parseFloat(formData.latitude || 0)} lng={parseFloat(formData.longitude || 0)} /></div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.col}><label style={styles.label}>11. Surveyor Name</label><input name="surveyorName" value={formData.surveyorName || ''} style={styles.readOnlyInput} readOnly disabled /></div>
                        <div style={styles.col}><label style={styles.label}>12. Mobile</label><input name="surveyorMobile" value={formData.surveyorMobile || ''} style={styles.readOnlyInput} readOnly disabled /></div>
                    </div>

                    <div style={styles.locSection}>
                        <h4 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '5px' }}>13. Media Evidence</h4>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={styles.label}>Site Photo</label>
                            {formData.sitePhoto ? renderMediaCard('photo', formData.sitePhoto) : (!viewOnly ? <button type="button" style={{ ...styles.mediaBtn, background: '#d32f2f', color: 'white' }} onClick={() => { setCameraMode('photo'); setShowGeoCamera(true); }}>Capture Photo</button> : <div style={styles.emptyBox}>No Site Photo Available</div>)}
                        </div>

                        {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={styles.label}>Live Video</label>
                                {formData.liveVideo ? renderMediaCard('video', formData.liveVideo) : (!viewOnly ? <button type="button" style={{ ...styles.mediaBtn, background: '#d32f2f', color: 'white' }} onClick={() => { setCameraMode('video'); setShowGeoCamera(true); }}>Record Video</button> : <div style={styles.emptyBox}>No Live Video Available</div>)}
                            </div>
                        )}

                        {VIDEO_REQUIRED_TYPES.includes(formData.locationType) && (
                            <div style={{ marginTop: '15px' }}>
                                <label style={styles.label}>GoPro Upload</label>
                                {formData.goproVideo ? renderMediaCard('gopro', formData.goproVideo) : (!viewOnly ? <label style={{ ...styles.mediaBtn, background: '#0288d1', color: 'white' }}>Upload GoPro File <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFileChange} /></label> : <div style={styles.emptyBox}>No GoPro Video Available</div>)}
                            </div>
                        )}

                        <div style={{ marginTop: '15px' }}>
                            <label style={styles.label}>Team Selfie <span style={{ color: 'red' }}>* (Required)</span></label>
                            {formData.selfie ? renderMediaCard('selfie', formData.selfie) : (!viewOnly ? <button type="button" style={{ ...styles.btn, background: '#0288d1' }} onClick={() => { setCameraMode('selfie'); setShowGeoCamera(true); }}>Take Team Selfie</button> : <div style={styles.emptyBox}>No Selfie Available</div>)}
                        </div>
                    </div>

                    {!viewOnly && <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
                        {isEditExisting ? "UPDATE SURVEY" : "SUBMIT SURVEY"}
                    </button>}

                    <button type="button" onClick={onClose} style={{ ...styles.btn, background: '#555', marginTop: '10px' }}>CLOSE</button>
                </form>
            </div>
        </div>
    );
};

export default SurveyForm;




