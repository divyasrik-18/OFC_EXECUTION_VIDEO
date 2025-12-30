



import express from 'express';
// Ensure these names match EXACTLY with your controller exports
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// --- DEFINE ROUTES ---
// URL becomes: /users/register
router.post('/register', registerUser);

// URL becomes: /users/login
router.post('/login', loginUser);

export default router;