// // // // import { pool } from './config/db.js';

// // // // const initDatabase = async () => {
// // // //     try {
// // // //         console.log("🔌 Connecting to database...");
// // // //         const client = await pool.connect();

// // // //         console.log("🔨 Creating tables...");

// // // //         // 1. Create Users Table
// // // //         await client.query(`
// // // //             CREATE TABLE IF NOT EXISTS users (
// // // //                 id SERIAL PRIMARY KEY,
// // // //                 username VARCHAR(255) UNIQUE NOT NULL,
// // // //                 password VARCHAR(255) NOT NULL,
// // // //                 role VARCHAR(50) DEFAULT 'user'
// // // //             );
// // // //         `);
// // // //         console.log("✅ Table 'users' created!");

// // // //         // 2. Create Surveys Table
// // // //         await client.query(`
// // // //             CREATE TABLE IF NOT EXISTS surveys (
// // // //                 id SERIAL PRIMARY KEY,
// // // //                 submitted_by VARCHAR(255),
// // // //                 generated_filename TEXT,
// // // //                 data JSONB, 
// // // //                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// // // //             );
// // // //         `);
// // // //         console.log("✅ Table 'surveys' created!");

// // // //         client.release();
// // // //         console.log("🎉 All tables set up successfully!");
// // // //         process.exit(0);

// // // //     } catch (err) {
// // // //         console.error("❌ Error setting up database:", err);
// // // //         process.exit(1);
// // // //     }
// // // // };

// // // // initDatabase();

// // // import pkg from 'pg';
// // // import dotenv from 'dotenv';

// // // // Load environment variables from .env
// // // dotenv.config();

// // // const { Pool } = pkg;

// // // // Use the credentials from your .env file
// // // const pool = new Pool({
// // //     user: process.env.DB_USER,
// // //     host: process.env.DB_HOST,
// // //     database: process.env.DB_NAME,
// // //     password: process.env.DB_PASSWORD,
// // //     port: process.env.DB_PORT || 5432,
// // //     ssl: { rejectUnauthorized: false } // Required for Render
// // // });

// // // const createTableQuery = `
// // // CREATE TABLE IF NOT EXISTS surveys (
// // //     id SERIAL PRIMARY KEY,
// // //     district TEXT,
// // //     block TEXT,
// // //     route_name TEXT,
// // //     location_type TEXT,
// // //     shot_number TEXT,
// // //     ring_number TEXT,
// // //     start_location TEXT,
// // //     end_location TEXT,
// // //     latitude NUMERIC,
// // //     longitude NUMERIC,
// // //     surveyor_name TEXT,
// // //     surveyor_mobile TEXT,
// // //     generated_filename TEXT,
// // //     submitted_by TEXT,
// // //     survey_date TEXT,
// // //     photos TEXT,
// // //     videos TEXT,
// // //     selfie_path TEXT,
// // //     remarks TEXT,
// // //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// // //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// // // );
// // // `;

// // // const run = async () => {
// // //     try {
// // //         console.log("🔌 Connecting to Render Database...");
// // //         const client = await pool.connect();
// // //         console.log("🛠 Creating 'surveys' table...");
// // //         await client.query(createTableQuery);
// // //         console.log("✅ Table 'surveys' created successfully!");
// // //         client.release();
// // //     } catch (err) {
// // //         console.error("❌ Error:", err.message);
// // //     } finally {
// // //         pool.end();
// // //     }
// // // };

// // // run();



// // import pkg from 'pg';
// // import dotenv from 'dotenv';

// // // Load environment variables from .env
// // dotenv.config();

// // const { Pool } = pkg;

// // // 1. DEBUG: Print the host to see where we are actually connecting
// // console.log("🔎 DEBUG: Current DB_HOST is:", process.env.DB_HOST);

// // // 2. Logic: If host is localhost, turn OFF SSL. If Render, turn ON SSL.
// // const isLocal = process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';

// // const pool = new Pool({
// //     user: process.env.DB_USER,
// //     host: process.env.DB_HOST,
// //     database: process.env.DB_NAME,
// //     password: process.env.DB_PASSWORD,
// //     port: process.env.DB_PORT || 5432,
// //     // 3. Conditional SSL
// //     ssl: isLocal ? false : { rejectUnauthorized: false } 
// // });

// // const createTableQuery = `
// // CREATE TABLE IF NOT EXISTS surveys (
// //     id SERIAL PRIMARY KEY,
// //     district TEXT,
// //     block TEXT,
// //     route_name TEXT,
// //     location_type TEXT,
// //     shot_number TEXT,
// //     ring_number TEXT,
// //     start_location TEXT,
// //     end_location TEXT,
// //     latitude NUMERIC,
// //     longitude NUMERIC,
// //     surveyor_name TEXT,
// //     surveyor_mobile TEXT,
// //     generated_filename TEXT,
// //     submitted_by TEXT,
// //     survey_date TEXT,
// //     photos TEXT,
// //     videos TEXT,
// //     selfie_path TEXT,
// //     remarks TEXT,
// //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// // );
// // `;

// // const run = async () => {
// //     try {
// //         console.log(`🔌 Connecting to Database (${isLocal ? "Local Mode" : "Cloud/SSL Mode"})...`);
// //         const client = await pool.connect();
// //         console.log("🛠 Creating 'surveys' table...");
// //         await client.query(createTableQuery);
// //         console.log("✅ Table 'surveys' created successfully!");
// //         client.release();
// //     } catch (err) {
// //         console.error("❌ Database Connection Error:", err.message);
// //         if (err.message.includes("SSL")) {
// //             console.error("👉 TIP: You are connecting to Localhost but SSL is on, OR connecting to Render without SSL.");
// //         }
// //     } finally {
// //         pool.end();
// //     }
// // };

// // run();


// import pkg from 'pg';
// import dotenv from 'dotenv';
// import bcrypt from 'bcrypt'; // We need this to hash the password

// // Load environment variables from .env
// dotenv.config();

// const { Pool } = pkg;

// console.log("🔎 DEBUG: Current DB_HOST is:", process.env.DB_HOST);

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT || 5432,
//     ssl: process.env.DB_HOST === 'localhost' ? false : { rejectUnauthorized: false }
// });

// const createSurveysTable = `
// CREATE TABLE IF NOT EXISTS surveys (
//     id SERIAL PRIMARY KEY,
//     district TEXT,
//     block TEXT,
//     route_name TEXT,
//     location_type TEXT,
//     shot_number TEXT,
//     ring_number TEXT,
//     start_location TEXT,
//     end_location TEXT,
//     latitude NUMERIC,
//     longitude NUMERIC,
//     surveyor_name TEXT,
//     surveyor_mobile TEXT,
//     generated_filename TEXT,
//     submitted_by TEXT,
//     survey_date TEXT,
//     photos TEXT,
//     videos TEXT,
//     selfie_path TEXT,
//     remarks TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// `;

// const createUsersTable = `
// CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     role VARCHAR(50) DEFAULT 'user',
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// `;

// const run = async () => {
//     try {
//         console.log("🔌 Connecting to Database...");
//         const client = await pool.connect();

//         // 1. Create Surveys Table
//         console.log("🛠 Creating 'surveys' table...");
//         await client.query(createSurveysTable);
//         console.log("✅ Table 'surveys' ready.");

//         // 2. Create Users Table
//         console.log("🛠 Creating 'users' table...");
//         await client.query(createUsersTable);
//         console.log("✅ Table 'users' ready.");

//         // 3. Create Default Admin User
//         const adminCheck = await client.query("SELECT * FROM users WHERE username = 'admin'");
//         if (adminCheck.rows.length === 0) {
//             console.log("👤 Creating default 'admin' user...");
//             // Hash the password 'admin'
//             const hashedPassword = await bcrypt.hash('admin', 10);
//             await client.query(
//                 "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)", 
//                 ['admin', hashedPassword, 'admin']
//             );
//             console.log("✅ Admin user created! (Username: admin, Password: admin)");
//         } else {
//             console.log("ℹ️ Admin user already exists.");
//         }

//         client.release();
//     } catch (err) {
//         console.error("❌ Error:", err.message);
//     } finally {
//         pool.end();
//     }
// };

// run();


import pkg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; 

// Load environment variables from .env
dotenv.config();

const { Pool } = pkg;

console.log("🔎 DEBUG: Current DB_HOST is:", process.env.DB_HOST);

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false } // Required for Render External URL
});

const createSurveysTable = `
CREATE TABLE IF NOT EXISTS surveys (
    id SERIAL PRIMARY KEY,
    district TEXT,
    block TEXT,
    route_name TEXT,
    location_type TEXT,
    shot_number TEXT,
    ring_number TEXT,
    start_location TEXT,
    end_location TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    surveyor_name TEXT,
    surveyor_mobile TEXT,
    generated_filename TEXT,
    submitted_by TEXT,
    survey_date TEXT,
    photos TEXT,
    videos TEXT,
    gopro TEXT,
    selfie_path TEXT,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const run = async () => {
    try {
        console.log("🔌 Connecting to Render Database...");
        const client = await pool.connect();

        // 1. Create Surveys Table
        console.log("🛠 Creating 'surveys' table...");
        await client.query(createSurveysTable);
        console.log("✅ Table 'surveys' ready.");

        // 2. Create Users Table
        console.log("🛠 Creating 'users' table...");
        await client.query(createUsersTable);
        console.log("✅ Table 'users' ready.");

        // 3. Create Default Admin User
        const adminCheck = await client.query("SELECT * FROM users WHERE username = 'admin'");
        if (adminCheck.rows.length === 0) {
            console.log("👤 Creating default 'admin' user...");
            // Hash the password 'admin'
            const hashedPassword = await bcrypt.hash('admin', 10);
            await client.query(
                "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)", 
                ['admin', hashedPassword, 'admin']
            );
            console.log("✅ Admin user created! (Username: admin, Password: admin)");
        } else {
            console.log("ℹ️ Admin user already exists.");
        }

        client.release();
    } catch (err) {
        console.error("❌ Error:", err.message);
        if(err.message.includes('MODULE_NOT_FOUND')) {
             console.error("👉 TIP: Run 'npm install bcrypt' in your terminal first.");
        }
    } finally {
        pool.end();
    }
};

run();