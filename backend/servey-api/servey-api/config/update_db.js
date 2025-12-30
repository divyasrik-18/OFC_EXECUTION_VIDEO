import { pool } from './config/db.js';

const updateDatabase = async () => {
    try {
        console.log("🔌 Connecting to database...");
        const client = await pool.connect();

        console.log("Adding missing columns...");

        // 1. Add generated_filename if it doesn't exist
        await client.query(`
            ALTER TABLE surveys 
            ADD COLUMN IF NOT EXISTS generated_filename TEXT;
        `);
        console.log("✅ Column 'generated_filename' checked/added.");

        // 2. Add submitted_by if it doesn't exist
        await client.query(`
            ALTER TABLE surveys 
            ADD COLUMN IF NOT EXISTS submitted_by TEXT;
        `);
        console.log("✅ Column 'submitted_by' checked/added.");

        client.release();
        console.log("🎉 Database updated successfully!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error updating database:", err.message);
        process.exit(1);
    }
};

updateDatabase();