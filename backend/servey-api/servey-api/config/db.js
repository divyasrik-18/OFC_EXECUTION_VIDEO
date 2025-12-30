

// // import pkg from 'pg';
// // import dotenv from 'dotenv';

// // dotenv.config();

// // const { Pool } = pkg;

// // // Create the connection pool
// // const pool = new Pool({
// //     user: process.env.DB_USER || 'postgres',
// //     host: process.env.DB_HOST || 'localhost',
// //     database: process.env.DB_NAME || 'SURVEY',
// //     password: process.env.DB_PASSWORD || 'admin',
// //     port: process.env.DB_PORT || 5432,
// // });

// // pool.on('connect', () => {
// //     // console.log('Connected to PostgreSQL database');
// // });

// // pool.on('error', (err) => {
// //     console.error('Unexpected error on idle client', err);
// //     process.exit(-1);
// // });

// // // *** CRITICAL: Export as 'db' to match your controllers ***
// // export const db = pool;
// // export {pool}



// import pkg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const { Pool } = pkg;

// // Create the connection pool
// const pool = new Pool({
//     user: process.env.DB_USER || 'postgres',
//     host: process.env.DB_HOST || 'localhost',
//     database: process.env.DB_NAME || 'SURVEY',
//     password: process.env.DB_PASSWORD || 'admin',
//     port: process.env.DB_PORT || 5432,
//     // SSL is REQUIRED for Render
//     ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' 
//     ? { rejectUnauthorized: false } 
//     : false,
// });

// pool.on('connect', () => {
//     // console.log('Connected to PostgreSQL database');
// });

// pool.on('error', (err) => {
//     console.error('Unexpected error on idle client', err);
//     process.exit(-1);
// });

// // *** Export BOTH so app.js and controllers work ***
// export const db = pool;
// export { pool };


import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// This logic checks if you have a DATABASE_URL (Render) 
// or if it should use individual local variables (Localhost)
const isProduction = process.env.DATABASE_URL;

const pool = isProduction 
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for Render
        }
    })
    : new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'SURVEY',
        password: process.env.DB_PASSWORD || 'admin',
        port: process.env.DB_PORT || 5432,
    });

pool.on('connect', () => {
    console.log(isProduction ? '🚀 Connected to Render Database' : '🏠 Connected to Local Database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const db = pool;
export { pool };