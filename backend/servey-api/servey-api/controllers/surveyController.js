import { db } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import * as synoService from '../services/synologyService.js';
import { v4 as uuidv4 } from 'uuid';

const TYPE_CODES = {
    "HDD Start Point": "HSP", "HDD End Point": "HEP", "Chamber Location": "CHM",
    "GP Location": "GPL", "Blowing Start Point": "BSP", "Blowing End Point": "BEP",
    "Coupler location": "CPL", "splicing": "SPL", "Other": "OTH"
};

const generateFilenameBase = (district, block, typeCode, shotNo) => {
    const d = (district || 'UNK').substring(0, 3).toUpperCase();
    const b = (block || 'UNK').substring(0, 3).toUpperCase();
    const s = String(shotNo || '1').padStart(2, '0');
    return `${d}_${b}_${typeCode}_SHOT${s}`;
};

const processFile = async (file, suffix, index = '', baseFilename, metadata) => {
    if (!file) return null;
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset);
    const safeDate = istDate.toISOString().replace('T', ' ').substring(0, 19);

    const ext = path.extname(file.originalname) || '.jpg';
    const d = istDate;
    const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
    const uuid = uuidv4();

    const storageName = `${baseFilename}_${dateStr}${index}_${uuid}_${ext}`;

    try {
        const nasPath = await synoService.uploadToSynology(file.path, metadata, storageName);
        if (fs.existsSync(file.path)) await fs.promises.unlink(file.path).catch(() => { });
        if (!nasPath) throw new Error("Upload failed to Synology");
        return nasPath;
    } catch (err) {
        if (fs.existsSync(file.path)) await fs.promises.unlink(file.path).catch(() => { });
        throw new Error(err?.message || "Upload failed");
    }
};


export const createSurvey = async (req, res) => {
    try {
        const {
            district, block, routeName, locationType,
            shotNumber, ringNumber, startLocName, endLocName,
            latitude, longitude, surveyorName, surveyorMobile, remarks,
            submittedBy, submitterId
        } = req.body;
        const id = uuidv4();
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(now.getTime() + istOffset);
        const safeDate = istDate.toISOString().replace('T', ' ').substring(0, 19);

        const typeCode = TYPE_CODES[locationType] || 'OTH';
        const baseFilename = generateFilenameBase(district, block, typeCode, shotNumber);
        const metadata = { district, block, locationType, shotNumber, dateTime: istDate };

        const photoPaths = [];
        const videoPaths = [];
        const goproPaths = [];
        let selfiePath = null;

        if (req.files) {
            if (req.files['photos']) {
                for (let i = 0; i < req.files['photos'].length; i++) {
                    const p = await processFile(req.files['photos'][i], 'photo', i > 0 ? `_${i}` : '', baseFilename, metadata);
                    if (p) photoPaths.push(p);
                }
            }
            if (req.files['videos']) {
                for (let i = 0; i < req.files['videos'].length; i++) {
                    const p = await processFile(req.files['videos'][i], 'video', '', baseFilename, metadata);
                    if (p) videoPaths.push(p);
                }
            }
            if (req.files['gopro']) {
                for (let i = 0; i < req.files['gopro'].length; i++) {
                    const p = await processFile(req.files['gopro'][i], 'gopro', '', baseFilename, metadata);
                    if (p) goproPaths.push(p);
                }
            }
            if (req.files['selfie']) {
                selfiePath = await processFile(req.files['selfie'][0], 'selfie', '', baseFilename, metadata);
            }
        }

        const query = `
            INSERT INTO surveys (
                id,district, block, route_name, location_type, 
                shot_number, ring_number, start_location, end_location, 
                latitude, longitude, surveyor_name, surveyor_mobile, 
                generated_filename, submitted_by, survey_date,
                photos, videos, gopro, selfie_path, remarks, submitter_id
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21,$22) 
            RETURNING *`;

        const values = [
            id,district, block, routeName, locationType,
            shotNumber, ringNumber, startLocName, endLocName,
            parseFloat(latitude || 0), parseFloat(longitude || 0),
            surveyorName, surveyorMobile, baseFilename, submittedBy,
            safeDate,
            JSON.stringify(photoPaths),
            JSON.stringify(videoPaths),
            JSON.stringify(goproPaths),
            selfiePath, remarks,
            submitterId
        ];

        const result = await db.query(query, values);
        res.json({ success: true, survey: result.rows[0] });

    } catch (error) {
        console.error("Create Error:", error);
        res.status(400).json({ error: error?.message || error });
    }
};

export const getSurveys = async (req, res) => {
    try {
        const { page = 1, search, district, block, surveyor_name, start_date, end_date, submitted_by, submitter_id } = req.query;
        let limit = parseInt(req.query.limit) || 10;

        const offset = (page - 1) * limit;

        if (limit < 1) limit = 10;

        let conditions = [];
        let values = [];
        let paramIndex = 1;

        // FIX: logic now works because submitted_by is defined
        if (submitted_by && submitted_by !== "") {
            conditions.push(`s.submitted_by = $${paramIndex++}`);
            values.push(submitted_by);
        }

        if (search) {
            conditions.push(`(s.district ILIKE $${paramIndex} OR s.block ILIKE $${paramIndex} OR s.route_name ILIKE $${paramIndex} OR s.surveyor_name ILIKE $${paramIndex} OR s.generated_filename ILIKE $${paramIndex})`);
            values.push(`%${search}%`);
            paramIndex++;
        }

        if (district) {
            conditions.push(`s.district = $${paramIndex++}`);
            values.push(district);
        }
        if (block) {
            conditions.push(`block = $${paramIndex++}`);
            values.push(block);
        }
        if (surveyor_name) {
            conditions.push(`s.surveyor_name ILIKE $${paramIndex++}`);
            values.push(`%${surveyor_name}%`);
        }

        // --- FIX START ---
        if (start_date && end_date) {
            conditions.push(`s.created_at::date BETWEEN $${paramIndex++} AND $${paramIndex++}`);
            values.push(start_date, end_date);
        }

        if (!!submitter_id) {
            await db.query("SELECT role from users WHERE id = $1", [submitter_id]).then(r => {
                if (r.rows.length > 0) {
                    const role = r.rows[0].role;
                    if (role !== 'admin') {
                        conditions.push(`submitter_id::text = $${paramIndex}::text`);
                        values.push(submitter_id);
                        paramIndex++;
                    }
                }
            }).catch(err => {
                // console.error("Error fetching user role:", err.message);
            });
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Count Query
        const countQuery = `SELECT COUNT(*) FROM surveys s ${whereClause}`;
        const countResult = await db.query(countQuery, values);
        const totalRecords = parseInt(countResult.rows[0].count);

        // Data Query
        const dataValues = [...values, limit, offset];
        const dataQuery = `
                            SELECT 
                                s.*, 
                                u.username AS submitter_name
                            FROM surveys s
                            LEFT JOIN users u ON s.submitter_id::text = u.id::text
                            ${whereClause} 
                            ORDER BY s.created_at DESC 
                            LIMIT $${paramIndex++} OFFSET $${paramIndex++}
                        `;

        const result = await db.query(dataQuery, dataValues);

        const surveys = result.rows.map(s => {
            const mediaFiles = [];
            const addMedia = (source, typePrefix) => {
                if (!source) return;
                let paths = [];
                if (Array.isArray(source)) paths = source;
                else if (typeof source === 'string') {
                    try { paths = JSON.parse(source); } catch (e) { paths = [source]; }
                    if (!Array.isArray(paths)) paths = [paths];
                }
                paths.forEach(p => { if (p) mediaFiles.push({ type: typePrefix, url: p }); });
            };

            addMedia(s.photos, 'photo');
            addMedia(s.videos, 'video');
            addMedia(s.gopro, 'gopro');
            if (s.selfie_path) mediaFiles.push({ type: 'selfie', url: s.selfie_path });

            return { ...s, mediaFiles };
        });

        // FIX: Correct pagination spread syntax
        res.json({
            success: true,
            pagination: {
                total: totalRecords,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalRecords / limit)
            },
            surveys: surveys
        });

    } catch (err) {
        console.error("Get Surveys Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const readFile = async (req, res) => {
    let filePath = req.query.path;
    if (!filePath) return res.status(400).send('No path provided');

    let cleanPath = filePath.replace(/[\[\]"']/g, '');

    if (!cleanPath.startsWith('/IT_Development')) {
        try {
            const result = await db.query(
                `SELECT district, block, location_type, shot_number, survey_date FROM surveys 
                 WHERE photos @> $1 OR videos @> $1 OR gopro @> $1 OR selfie_path = $2 LIMIT 1`,
                [`["${cleanPath}"]`, cleanPath]
            );

            if (result.rows.length > 0) {
                const s = result.rows[0];
                const tCode = TYPE_CODES[s.location_type] || 'OTH';
                const d = new Date(s.survey_date);
                const dateStr = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

                cleanPath = `/IT_Development/GIS/${s.district}/${s.block}/${tCode}/${s.shot_number || '1'}/${dateStr}/${cleanPath}`;
            }
        } catch (dbErr) {
            console.error("Path reconstruction lookup failed:", dbErr.message);
        }
    }

    try {
        await synoService.downloadFromSynology(cleanPath, res);
    } catch (e) {
        console.error("Read File Error:", e.message);
        if (!res.headersSent) res.status(500).send("File access error from storage");
    }
};

export const cancelSurvey = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM surveys WHERE id = $1", [id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateSurveyDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            district, block, routeName, surveyorName, locationType, shotNumber,
            surveyorMobile, latitude, longitude, remarks, submittedBy
        } = req.body;

        // find out existing record
        const existingResult = await db.query("SELECT * FROM surveys WHERE id = $1", [id]);
        if (existingResult.rows.length === 0) {
            return res.status(404).json({ error: "Survey not found" });
        }

        const current = existingResult.rows[0];

        const now = new Date();
        // Indian Standard Time (IST) offset
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(now.getTime() + istOffset);
        const safeDate = istDate.toISOString().replace('T', ' ').substring(0, 19);

        const typeCode = TYPE_CODES[locationType] || 'OTH';
        const baseFilename = current.generated_filename || generateFilenameBase(district, block, typeCode, shotNumber);
        const metadata = { district, block, locationType, shotNumber, dateTime: istDate };

        // Helper to parse DB JSON safely
        const getExisting = (json) => {
            if (!json) return [];
            if (Array.isArray(json)) return json;
            try { return JSON.parse(json); } catch { return []; }
        };

        // 2. Initialize arrays with OLD data
        let photoPaths = getExisting(current.photos);
        let videoPaths = getExisting(current.videos);
        let goproPaths = getExisting(current.gopro);
        let selfiePath = current.selfie_path || null;

        if (req.files) {
            if (req.files['photos']) {
                photoPaths = [];
                for (let i = 0; i < req.files['photos'].length; i++) {
                    const p = await processFile(req.files['photos'][i], 'photo', i > 0 ? `_${i}` : '', baseFilename, metadata);
                    if (p) photoPaths.push(p);
                }
            }

            if (req.files['videos']) {
                videoPaths = [];
                for (let i = 0; i < req.files['videos'].length; i++) {
                    const p = await processFile(req.files['videos'][i], 'video', '', baseFilename, metadata);
                    if (p) videoPaths.push(p);
                }
            }

            if (req.files['gopro']) {
                goproPaths = [];
                for (let i = 0; i < req.files['gopro'].length; i++) {
                    const p = await processFile(req.files['gopro'][i], 'gopro', '', baseFilename, metadata);
                    if (p) goproPaths.push(p);
                }
            }

            if (req.files['selfie']) {
                selfiePath = await processFile(req.files['selfie'][0], 'selfie', '', baseFilename, metadata);
            }
        }

        // Update Query - Now includes file columns
        const query = `
            UPDATE surveys SET 
                district=$1, 
        block=$2, 
        route_name=$3, 
        surveyor_name=$4,
        location_type=$5,
        shot_number=$6,
        latitude=$7,
        longitude=$8,
        remarks=$9,
        photos=$10, 
        videos=$11, 
        gopro=$12, 
        selfie_path=$13,
        updated_at=NOW()  
            WHERE id=$14
        `;

        const values = [
            district, block, routeName, surveyorName, locationType, shotNumber,
    parseFloat(latitude || 0), parseFloat(longitude || 0), remarks,
    JSON.stringify(photoPaths), JSON.stringify(videoPaths), JSON.stringify(goproPaths),
    selfiePath, 
            id
        ];

        await db.query(query, values);

        res.json({ success: true });
    } catch (err) {
        console.log("Update Error:", err);
        res.status(500).json({ error: err.message });
    }
};