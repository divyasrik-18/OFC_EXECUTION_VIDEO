// *** FIX: Import 'db' instead of 'pool' ***
import { db } from '../config/db.js';
import bcrypt from 'bcryptjs'; // Ensure you have installed 'bcryptjs' or 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// --- REGISTER ---
export const registerUser = async (req, res) => {
    try {
        console.log("Register Request:", req.body);

        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and Password are required" });
        }

        // *** FIX: Use db.query ***
        const userExist = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // *** FIX: Use db.query ***
        const newUser = await db.query(
            "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
            [username, hashedPassword, role || 'user']
        );

        res.json({ success: true, user: newUser.rows[0] });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// --- LOGIN ---
export const loginUser = async (req, res) => {
    try {
        console.log("Login Request:", req.body);

        const { username, password } = req.body;

        // *** FIX: Use db.query ***
        const result = await db.query("SELECT id, username, role, password, created_at FROM users WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role } });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};