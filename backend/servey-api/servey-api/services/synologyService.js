// // // import axios from 'axios';
// // // import FormData from 'form-data';
// // // import fs from 'fs';
// // // import dotenv from 'dotenv';

// // // dotenv.config();

// // // const SYNO_HOST = process.env.SYNO_HOST; 
// // // const SYNO_USER = process.env.SYNO_USER;
// // // const SYNO_PASS = process.env.SYNO_PASS;
// // // const SYNO_ROOT_PATH = '/IT_Development/GIS'; 

// // // let currentSid = null;

// // // // --- 1. LOGIN ---
// // // const loginToSynology = async () => {
// // //     try {
// // //         console.log("🔌 Connecting to Synology...");
// // //         const url = `${SYNO_HOST}/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=${SYNO_USER}&passwd=${SYNO_PASS}&session=FileStation&format=sid`;
// // //         const res = await axios.get(url);

// // //         if (res.data.success) {
// // //             currentSid = res.data.data.sid;
// // //             console.log(" Synology Login Success. SID:", currentSid);
// // //             return currentSid;
// // //         } else {
// // //             console.error(" Synology Login Failed. Response:", JSON.stringify(res.data));
// // //             return null;
// // //         }
// // //     } catch (error) {
// // //         console.error(" Synology Network Error:", error.message);
// // //         return null;
// // //     }
// // // };

// // // // --- 2. UPLOAD ---
// // // // export const uploadToSynology = async (localFilePath, metadata, finalFilename) => {
// // // //     // Check if file exists locally first
// // // //     if (!fs.existsSync(localFilePath)) {
// // // //         console.error("❌ Local file missing:", localFilePath);
// // // //         return null;
// // // //     }

// // // //     if (!currentSid) await loginToSynology();
// // // //     if (!currentSid) {
// // // //         console.error("❌ Cannot upload: No active session.");
// // // //         return null;
// // // //     }

// // // //     // A. Generate Folder Structure
// // // //     const TYPE_CODES = {
// // // //         "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
// // // //         "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
// // // //         "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// // // //     };

// // // //     const district = (metadata.district || 'UNK').substring(0, 3).toUpperCase();
// // // //     const block = (metadata.block || 'UNK').substring(0, 3).toUpperCase();
// // // //     const typeCode = TYPE_CODES[metadata.locationType] || 'OTH';
// // // //     const shot = String(metadata.shotNumber || '1');

// // // //     // Date Logic
// // // //     let d = new Date();
// // // //     if (metadata.dateTime && !isNaN(new Date(metadata.dateTime).getTime())) {
// // // //         d = new Date(metadata.dateTime);
// // // //     }
// // // //     const day = String(d.getDate()).padStart(2, '0');
// // // //     const month = String(d.getMonth() + 1).padStart(2, '0');
// // // //     const year = String(d.getFullYear());
// // // //     const dateStr = `${day}-${month}-${year}`;

// // // //     const destFolderPath = `${SYNO_ROOT_PATH}/${district}/${block}/${typeCode}/${shot}/${dateStr}`;

// // // //     console.log(`📂 Target Folder: ${destFolderPath}`);
// // // //     console.log(`📄 Uploading File as: ${finalFilename}`);

// // // //     // B. Prepare Form Data
// // // //     const form = new FormData();
// // // //     form.append('api', 'SYNO.FileStation.Upload');
// // // //     form.append('version', '2');
// // // //     form.append('method', 'upload');
// // // //     form.append('path', destFolderPath);
// // // //     form.append('create_parents', 'true'); 
// // // //     form.append('overwrite', 'true');

// // // //     // 1. Explicit Synology Filename Param
// // // //     form.append('filename', finalFilename);

// // // //     // 2. CRITICAL FIX: Force the filename on the stream option
// // // //     // This overrides the random Multer hash name (e.g. ef4c...)
// // // //     form.append('file', fs.createReadStream(localFilePath), { filename: finalFilename });

// // // //     try {
// // // //         const url = `${SYNO_HOST}/webapi/entry.cgi?_sid=${currentSid}`;

// // // //         const response = await axios.post(url, form, {
// // // //             headers: form.getHeaders(),
// // // //             maxContentLength: Infinity,
// // // //             maxBodyLength: Infinity
// // // //         });

// // // //         if (response.data.success) {
// // // //             console.log(`✅ Upload Complete: ${finalFilename}`);
// // // //             return `${destFolderPath}/${finalFilename}`; 
// // // //         } else {
// // // //             console.error("❌ Upload Failed API Response:", JSON.stringify(response.data));

// // // //             // Retry on session expire
// // // //             if (response.data.error && response.data.error.code === 105) {
// // // //                 console.log("🔄 Session expired. Retrying login...");
// // // //                 currentSid = null;
// // // //                 return uploadToSynology(localFilePath, metadata, finalFilename);
// // // //             }
// // // //             return null;
// // // //         }
// // // //     } catch (error) {
// // // //         console.error("❌ Axios Upload Exception:", error.message);
// // // //         return null;
// // // //     }
// // // // };

// // // // --- 3. DOWNLOAD ---
// // // export const uploadToSynology = async (localFilePath, metadata, finalFilename) => {
// // //     // Check if file exists locally first
// // //     if (!fs.existsSync(localFilePath)) {
// // //         console.error("Local file missing:", localFilePath);
// // //         return null;
// // //     }

// // //     if (!currentSid) await loginToSynology();
// // //     if (!currentSid) {
// // //         console.error(" Cannot upload: No active session.");
// // //         return null;
// // //     }

// // //     // A. Generate Folder Structure
// // //     const TYPE_CODES = {
// // //         "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
// // //         "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
// // //         "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
// // //     };

// // //     // --- CHANGED HERE: Use Full Names (Removed .substring) ---
// // //     const district = metadata.district || 'UNK';
// // //     const block = metadata.block || 'UNK';

// // //     // Type Code stays short (Standard practice), or remove lookup to make full
// // //     const typeCode = TYPE_CODES[metadata.locationType] || 'OTH';
// // //     const shot = String(metadata.shotNumber || '1');

// // //     // Date Logic
// // //     let d = new Date();
// // //     if (metadata.dateTime && !isNaN(new Date(metadata.dateTime).getTime())) {
// // //         d = new Date(metadata.dateTime);
// // //     }
// // //     const day = String(d.getDate()).padStart(2, '0');
// // //     const month = String(d.getMonth() + 1).padStart(2, '0');
// // //     const year = String(d.getFullYear());
// // //     const dateStr = `${day}-${month}-${year}`;

// // //     // Path Example: /IT_Development/GIS/Hyderabad/Central/HSP/1/13-12-2025
// // //     const destFolderPath = `${SYNO_ROOT_PATH}/${district}/${block}/${typeCode}/${shot}/${dateStr}`;

// // //     console.log(` Target Folder: ${destFolderPath}`);
// // //     console.log(`Uploading File as: ${finalFilename}`);

// // //     // B. Prepare Form Data
// // //     const form = new FormData();
// // //     form.append('api', 'SYNO.FileStation.Upload');
// // //     form.append('version', '2');
// // //     form.append('method', 'upload');
// // //     form.append('path', destFolderPath);
// // //     form.append('create_parents', 'true'); 
// // //     form.append('overwrite', 'true');

// // //     // 1. Explicit Synology Filename Param
// // //     form.append('filename', finalFilename);

// // //     // 2. CRITICAL FIX: Force the filename on the stream option
// // //     form.append('file', fs.createReadStream(localFilePath), { filename: finalFilename });

// // //     try {
// // //         const url = `${SYNO_HOST}/webapi/entry.cgi?_sid=${currentSid}`;

// // //         const response = await axios.post(url, form, {
// // //             headers: form.getHeaders(),
// // //             maxContentLength: Infinity,
// // //             maxBodyLength: Infinity
// // //         });

// // //         if (response.data.success) {
// // //             console.log(` Upload Complete: ${finalFilename}`);
// // //             return `${destFolderPath}/${finalFilename}`; 
// // //         } else {
// // //             console.error(" Upload Failed API Response:", JSON.stringify(response.data));

// // //             // Retry on session expire
// // //             if (response.data.error && response.data.error.code === 105) {
// // //                 console.log(" Session expired. Retrying login...");
// // //                 currentSid = null;
// // //                 return uploadToSynology(localFilePath, metadata, finalFilename);
// // //             }
// // //             return null;
// // //         }
// // //     } catch (error) {
// // //         console.error(" Axios Upload Exception:", error.message);
// // //         return null;
// // //     }
// // // };
// // // export const downloadFromSynology = async (synoPath, res) => {
// // //     if (!currentSid) await loginToSynology();
// // //     if (!currentSid) return res.status(500).send("Storage Error");

// // //     try {
// // //         const url = `${SYNO_HOST}/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&path=${encodeURIComponent(synoPath)}&mode=open&_sid=${currentSid}`;

// // //         const response = await axios({
// // //             method: 'GET',
// // //             url: url,
// // //             responseType: 'stream'
// // //         });

// // //         response.data.pipe(res);
// // //     } catch (error) {
// // //         console.error(" Download Error:", error.message);
// // //         if (!res.headersSent) res.status(404).send("File not found");
// // //     }
// // // };



// // import axios from 'axios';
// // import FormData from 'form-data';
// // import fs from 'fs';
// // import dotenv from 'dotenv';

// // dotenv.config();

// // const SYNO_HOST = process.env.SYNO_HOST; 
// // const SYNO_USER = process.env.SYNO_USER;
// // const SYNO_PASS = process.env.SYNO_PASS;
// // const SYNO_ROOT_PATH = '/IT_Development/GIS'; 

// // let currentSid = null;

// // // Helper to handle Axios requests with Timeout
// // const axiosInstance = axios.create({
// //     timeout: 4000 // 4 Seconds Timeout - Prevents Server Hanging
// // });

// // const loginToSynology = async () => {
// //     try {
// //         console.log("🔌 Connecting to Synology...");
// //         const url = `${SYNO_HOST}/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=${SYNO_USER}&passwd=${SYNO_PASS}&session=FileStation&format=sid`;

// //         const res = await axiosInstance.get(url);

// //         if (res.data.success) {
// //             currentSid = res.data.data.sid;
// //             console.log("✅ Synology Login Success");
// //             return currentSid;
// //         } else {
// //             console.error("❌ Synology Login Failed:", JSON.stringify(res.data));
// //             return null;
// //         }
// //     } catch (error) {
// //         console.error("⚠️ Synology Network Error (Login):", error.message);
// //         return null;
// //     }
// // };

// // export const uploadToSynology = async (localFilePath, metadata, finalFilename) => {
// //     if (!fs.existsSync(localFilePath)) return null;

// //     if (!currentSid) await loginToSynology();
// //     if (!currentSid) return null; // Fail fast if no login

// //     const district = metadata.district || 'UNK';
// //     const block = metadata.block || 'UNK';
// //     const TYPE_CODES = { "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM", "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP", "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH" };
// //     const typeCode = TYPE_CODES[metadata.locationType] || 'OTH';
// //     const shot = String(metadata.shotNumber || '1');

// //     let d = new Date();
// //     if (metadata.dateTime) d = new Date(metadata.dateTime);
// //     const dateStr = `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;

// //     const destFolderPath = `${SYNO_ROOT_PATH}/${district}/${block}/${typeCode}/${shot}/${dateStr}`;

// //     const form = new FormData();
// //     form.append('api', 'SYNO.FileStation.Upload');
// //     form.append('version', '2');
// //     form.append('method', 'upload');
// //     form.append('path', destFolderPath);
// //     form.append('create_parents', 'true'); 
// //     form.append('overwrite', 'true');
// //     form.append('filename', finalFilename);
// //     form.append('file', fs.createReadStream(localFilePath), { filename: finalFilename });

// //     try {
// //         const url = `${SYNO_HOST}/webapi/entry.cgi?_sid=${currentSid}`;

// //         const response = await axiosInstance.post(url, form, {
// //             headers: form.getHeaders(),
// //             maxContentLength: Infinity,
// //             maxBodyLength: Infinity
// //         });

// //         if (response.data.success) {
// //             console.log(`✅ Upload Success: ${finalFilename}`);
// //             return `${destFolderPath}/${finalFilename}`; 
// //         } else {
// //             // If session expired, try once more
// //             if (response.data.error && response.data.error.code === 105) {
// //                 console.log("🔄 Session expired. Retrying...");
// //                 currentSid = null;
// //                 // Recursive call (one retry)
// //                 return await uploadToSynology(localFilePath, metadata, finalFilename); 
// //             }
// //             console.error("❌ Upload API Error:", JSON.stringify(response.data));
// //             return null;
// //         }
// //     } catch (error) {
// //         console.error("⚠️ Synology Upload Timeout/Error:", error.message);
// //         return null;
// //     }
// // };

// // export const downloadFromSynology = async (synoPath, res) => {
// //     // Basic download logic - usually not the cause of upload crashes
// //     if (!currentSid) await loginToSynology();
// //     if (!currentSid) return res.status(500).send("Storage Error");
// //     try {
// //         const url = `${SYNO_HOST}/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&path=${encodeURIComponent(synoPath)}&mode=open&_sid=${currentSid}`;
// //         const response = await axiosInstance({ method: 'GET', url: url, responseType: 'stream' });
// //         response.data.pipe(res);
// //     } catch (error) {
// //         console.error("Download Error:", error.message);
// //         if (!res.headersSent) res.status(404).send("File not found");
// //     }
// // };


// import axios from 'axios';
// import FormData from 'form-data';
// import fs from 'fs';
// import dotenv from 'dotenv';

// dotenv.config();

// const SYNO_HOST = process.env.SYNO_HOST; 
// const SYNO_USER = process.env.SYNO_USER;
// const SYNO_PASS = process.env.SYNO_PASS;
// const SYNO_ROOT_PATH = '/IT_Development/GIS'; 

// let currentSid = null;

// // Helper: Axios with short timeout to prevent hanging
// const axiosInstance = axios.create({
//     timeout: 15000 // 3 Seconds Timeout
// });

// const loginToSynology = async () => {
//     // 1. Safety Check: If Env vars are missing, don't even try connecting
//     if (!SYNO_HOST || !SYNO_USER || !SYNO_PASS) {
//         console.warn("⚠️ Synology ENV variables missing. Skipping Storage.");
//         return null;
//     }

//     try {
//         console.log("🔌 Connecting to Synology...");
//         const url = `${SYNO_HOST}/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=${SYNO_USER}&passwd=${SYNO_PASS}&session=FileStation&format=sid`;

//         const res = await axiosInstance.get(url);

//         if (res.data.success) {
//             currentSid = res.data.data.sid;
//             console.log("✅ Synology Login Success");
//             return currentSid;
//         } else {
//             console.error("❌ Synology Login Failed:", JSON.stringify(res.data));
//             return null;
//         }
//     } catch (error) {
//         // Log but don't crash
//         console.error("⚠️ Synology Connection Error (Login):", error.message);
//         return null;
//     }
// };

// export const uploadToSynology = async (localFilePath, metadata, finalFilename) => {
//     // 1. Check if file exists locally
//     if (!localFilePath || !fs.existsSync(localFilePath)) {
//         console.error("❌ Local file not found:", localFilePath);
//         throw new Error("Synology upload failed: Local file missing.");
//     }

//     // 2. Attempt Login
//     const currentSid = await loginToSynology();

//     if (!currentSid) {
//         console.error("❌ Cannot upload: No active session.");
//         throw new Error("Synology upload failed: No active session.");
//     }

//     const district = metadata.district || 'UNK';
//     const block = metadata.block || 'UNK';
//     const TYPE_CODES = { "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM", "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP", "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH" };
//     const typeCode = TYPE_CODES[metadata.locationType] || 'OTH';
//     const shot = String(metadata.shotNumber || '1');

//     let d = new Date();
//     if (metadata.dateTime) d = new Date(metadata.dateTime);
//     const dateStr = `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;

//     const destFolderPath = `${SYNO_ROOT_PATH}/${district}/${block}/${typeCode}/${shot}/${dateStr}`;

//     const form = new FormData();
//     form.append('api', 'SYNO.FileStation.Upload');
//     form.append('version', '2');
//     form.append('method', 'upload');
//     form.append('path', destFolderPath);
//     form.append('create_parents', 'true'); 
//     form.append('overwrite', 'true');
//     form.append('filename', finalFilename);
//     form.append('file', fs.createReadStream(localFilePath), { filename: finalFilename });

//     try {
//         const url = `${SYNO_HOST}/webapi/entry.cgi?_sid=${currentSid}`;

//         const response = await axiosInstance.post(url, form, {
//             headers: form.getHeaders(),
//             maxContentLength: Infinity,
//             maxBodyLength: Infinity
//         });

//         if (response.data.success) {
//             console.log(`✅ Upload Success: ${finalFilename}`);
//             return `${destFolderPath}/${finalFilename}`; 
//         } else {
//             // Retry once on session expire
//             if (response.data.error && response.data.error.code === 105) {
//                 console.log("🔄 Session expired. Retrying...");
//                 currentSid = null;
//                 throw new Error("Upload failed."); // For safety, just throw new Error("Upload failed.") on retry fail to prevent infinite loops
//             }
//             console.error("❌ Synology API Error:", JSON.stringify(response.data));
//             throw new Error("Upload failed.");
//         }
//     } catch (error) {
//         console.error("⚠️ Synology Upload Network Error:", error.message);
//         throw new Error("Upload failed.");
//     }
// };

// export const downloadFromSynology = async (synoPath, res) => {
//     if (!currentSid) await loginToSynology();
//     if (!currentSid) return res.status(500).send("Storage Unavailable");

//     try {
//         const url = `${SYNO_HOST}/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&path=${encodeURIComponent(synoPath)}&mode=open&_sid=${currentSid}`;
//         const response = await axiosInstance({ method: 'GET', url: url, responseType: 'stream' });
//         response.data.pipe(res);
//     } catch (error) {
//         console.error("Download Error:", error.message);
//         if (!res.headersSent) res.status(404).send("File not found");
//     }
// };

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';
import { pool } from '../config/db.js';

dotenv.config();

const SYNO_HOST = process.env.SYNO_HOST?.replace(/\/$/, "");
const SYNO_USER = process.env.SYNO_USER;
const SYNO_PASS = process.env.SYNO_PASS;
const SYNO_ROOT_PATH = '/IT_Development/GIS';

let currentSid = null;
const axiosInstance = axios.create({ timeout: 15000 });

// Robust Login
const loginToSynology = async () => {
    try {
        const result = await pool.query("SELECT * FROM synology ORDER BY id DESC LIMIT 1");

        if (result.rows.length > 0) {
            const savedSid = result.rows[0].sid;
            // Validate saved SID
            try {
                const validateRes = await axiosInstance.get(`${SYNO_HOST}/webapi/entry.cgi`, {
                    params: {
                        api: 'SYNO.FileStation.List',
                        version: 2,
                        method: 'list_share',
                        _sid: savedSid
                    }
                });

                if (validateRes.data.success) {
                    console.log("✅ Using saved Synology SID from DB.");
                    return savedSid;
                } else {
                    console.log("❌ Saved SID invalid, re-logging in.");
                }
            } catch (e) {
                // Invalid SID
                console.log("❌ Saved SID invalid, re-logging in.");
            }
        }

        const res = await axiosInstance.get(`${SYNO_HOST}/webapi/auth.cgi`, {
            params: {
                api: 'SYNO.API.Auth',
                version: 3,
                method: 'login',
                account: SYNO_USER,
                passwd: SYNO_PASS,
                session: 'FileStation',
                format: 'sid'
            }
        });

        if (res.data.success) {
            currentSid = res.data.data.sid;

            // Adding latest sid to DB
            try {
                await pool.query('DELETE FROM synology');
                await pool.query(
                    'INSERT INTO synology (sid) VALUES ($1)',
                    [currentSid]
                );
            } catch (e) {
                console.error("Failed to save SID to DB:", e.message);
                return null;
            }

            console.log("LOGIN SUCCESS. New SID saved to DB.");
            return currentSid;
        }
        return null;
    } catch (error) { return null; }
};

// Returns FULL PATH to save in DB
export const uploadToSynology = async (localPath, meta, fileName) => {
    const sid = await loginToSynology();
    if (!sid || !fs.existsSync(localPath)) return null;

    const typeCodes = { "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM", "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP", "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH" };
    const tCode = typeCodes[meta.locationType] || 'OTH';
    const d = new Date();
    const dateStr = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

    const destPath = `${SYNO_ROOT_PATH}/${meta.district}/${meta.block}/${tCode}/${meta.shotNumber || '1'}/${dateStr}`;

    const form = new FormData();
    form.append('api', 'SYNO.FileStation.Upload');
    form.append('version', '2');
    form.append('method', 'upload');
    form.append('path', destPath);
    form.append('create_parents', 'true');
    form.append('overwrite', 'true');
    form.append('file', fs.createReadStream(localPath), { filename: fileName });

    try {
        const response = await axiosInstance.post(`${SYNO_HOST}/webapi/entry.cgi?_sid=${sid}`, form, { headers: form.getHeaders() });
        if (response.data.success) return `${destPath}/${fileName}`; // Returns absolute path
        return null;
    } catch (e) { return null; }
};

// EXPORTED function to download
export const downloadFromSynology = async (synoPath, res) => {
    const sid = await loginToSynology();
    if (!sid) throw new Error("Synology Login failed");

    const response = await axiosInstance({
        method: 'GET',
        url: `${SYNO_HOST}/webapi/entry.cgi`,
        params: {
            api: 'SYNO.FileStation.Download',
            version: 2,
            method: 'download',
            path: synoPath,
            mode: 'open',
            _sid: sid
        },
        responseType: 'stream'
    });
    response.data.pipe(res);
};