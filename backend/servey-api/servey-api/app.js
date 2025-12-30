// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';
// import surveyRoutes from './routes/surveyRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import { pool } from './config/db.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4004;

// // Allow your Render Frontend to talk to this Backend
// app.use(cors({
//     origin: ["http://localhost:3000", "https://gis-kpj2.onrender.com"],
//     credentials: true
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const UPLOAD_BASE = process.env.UPLOAD_PATH || path.resolve(process.cwd(), 'uploads');
// app.use('/uploads', express.static(UPLOAD_BASE));

// app.use('/surveys', surveyRoutes);
// app.use('/users', userRoutes);

// app.get('/', (req, res) => res.json({ ok: true, message: "Backend is running!" }));

// // --- DATABASE AUTO-FIXER ---
// const initDB = async () => {
//     try {
//         console.log("🛠️ Repairing Database...");

//         // // 1. DELETE THE OLD TABLE (This fixes the column errors)
//         // await pool.query('DROP TABLE IF EXISTS surveys'); 
//           console.log("🛠️ Syncing Database...");
//         // Ensure column submitter_id exists as VARCHAR to support UUIDs and old IDs
//         // await db.query(`ALTER TABLE surveys ADD COLUMN IF NOT EXISTS submitter_id VARCHAR(255);`);
//         // await db.query(`ALTER TABLE surveys ALTER COLUMN id TYPE VARCHAR(255);`);
//         // await db.query(`ALTER TABLE users ALTER COLUMN id TYPE VARCHAR(255);`);
//         console.log("✅ Database Ready!");
//         // 2. CREATE USERS TABLE
//         await pool.query(`
//             CREATE TABLE IF NOT EXISTS users (
//                 id SERIAL PRIMARY KEY,
//                 username VARCHAR(255) UNIQUE NOT NULL,
//                 password VARCHAR(255) NOT NULL,
//                 role VARCHAR(50) DEFAULT 'user'
//             );
//         `);

//         await pool.query(`
//             CREATE TABLE IF NOT EXISTS synology (
//                 id SERIAL PRIMARY KEY,
//                 sid VARCHAR(255) UNIQUE NOT NULL,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );
//         `);

//         // 3. CREATE SURVEYS TABLE (With all correct columns)
//         await pool.query(`
//             CREATE TABLE IF NOT EXISTS surveys (
//                 id SERIAL PRIMARY KEY,
//                 district VARCHAR(255),
//                 block VARCHAR(255),
//                 route_name VARCHAR(255),
//                 location_type VARCHAR(255),
//                 shot_number VARCHAR(100),
//                 ring_number VARCHAR(100),
//                 start_location VARCHAR(255),
//                 end_location VARCHAR(255),
//                 latitude DECIMAL,
//                 longitude DECIMAL,
//                 surveyor_name VARCHAR(255),
//                 surveyor_mobile VARCHAR(50),
//                 generated_filename TEXT,
//                 submitted_by VARCHAR(255),
//                 survey_date TIMESTAMP,
//                 photos JSONB,
//                 videos JSONB,
//                 gopro JSONB,
//                 selfie_path TEXT,
//                 remarks TEXT,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );
//         `);
//         console.log("✅ Database is FIXED and READY!");
//     } catch (err) {
//         console.error("❌ Database setup failed:", err.message);
//     }
// };

// // Start Server
// initDB().then(() => {
//     app.listen(PORT, () => {
//         console.log(`🚀 Server listening on port ${PORT}`);
//     });
// });


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt'; // Added for admin creation
import surveyRoutes from './routes/surveyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { pool } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4004;

app.use(cors({
    origin: ["http://localhost:3000", "https://ofc-backend.onrender.com", "https://ofc-frontend.onrender.com"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UPLOAD_BASE = process.env.UPLOAD_PATH || path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(UPLOAD_BASE));

app.use('/surveys', surveyRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: "Backend is running!" }));

const initDB = async () => {
    try {
        console.log("🛠️ Repairing Database...");

        // 1. DROP THE OLD TABLES (UNCOMMENTED THIS - RUN ONCE TO FIX SCHEMA)
        // Note: This deletes existing data. After it works once, comment these out again.
        await pool.query('DROP TABLE IF EXISTS surveys'); 
        await pool.query('DROP TABLE IF EXISTS users');
        await pool.query('DROP TABLE IF EXISTS synology');
        
        console.log("🛠️ Creating Tables with correct Schema...");

        // 2. CREATE USERS TABLE (Using your exact names/types)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                "id" CHARACTER VARYING PRIMARY KEY,
                "username" CHARACTER VARYING UNIQUE NOT NULL,
                "password" CHARACTER VARYING NOT NULL,
                "role" CHARACTER VARYING,
                "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "mobile" CHARACTER VARYING
            );
        `);

        // 3. CREATE SURVEYS TABLE (Using your exact names/types)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS surveys (
                "id" CHARACTER VARYING PRIMARY KEY,
                "district" CHARACTER VARYING,
                "block" CHARACTER VARYING,
                "route_name" CHARACTER VARYING,
                "location_type" CHARACTER VARYING,
                "shot_number" CHARACTER VARYING,
                "ring_number" CHARACTER VARYING,
                "start_location" CHARACTER VARYING,
                "end_location" CHARACTER VARYING,
                "latitude" NUMERIC,
                "longitude" NUMERIC,
                "surveyor_name" CHARACTER VARYING,
                "surveyor_mobile" CHARACTER VARYING,
                "generated_filename" TEXT,
                "submitted_by" CHARACTER VARYING,
                "survey_date" TIMESTAMP WITHOUT TIME ZONE,
                "photos" JSONB,
                "videos" JSONB,
                "selfie_path" TEXT,
                "remarks" TEXT,
                "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITHOUT TIME ZONE,
                "gopro" JSONB,
                "submitter_id" CHARACTER VARYING
            );
        `);

        // 4. CREATE DEFAULT ADMIN USER
        const adminCheck = await pool.query("SELECT * FROM users WHERE username = 'admin'");
        if (adminCheck.rows.length === 0) {
            console.log("👤 Creating default 'admin' user...");
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.query(
                `INSERT INTO users (id, username, password, role) VALUES ($1, $2, $3, $4)`, 
                ['admin-01', 'admin', hashedPassword, 'admin']
            );
            console.log("✅ Admin user created! (Pass: admin123)");
        }

        console.log("✅ Database is FIXED and READY!");
    } catch (err) {
        console.error("❌ Database setup failed:", err.message);
    }
};

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server listening on port ${PORT}`);
    });
});