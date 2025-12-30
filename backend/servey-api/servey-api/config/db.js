

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

// This logic allows for both local and Render environments
const poolConfig = process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL } 
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    };

// Always enable SSL if we aren't on localhost
const isLocal = process.env.DB_HOST === 'localhost' || !process.env.DB_HOST;
const pool = new Pool({
    ...poolConfig,
    ssl: isLocal ? false : { rejectUnauthorized: false }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export const db = pool;
export { pool };