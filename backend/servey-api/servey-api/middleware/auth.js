// middleware/auth.js (ESM)
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Use the secret from .env, or fallback to a default if missing
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';
const jwtOpts = { algorithms: ['HS256'] };

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET, jwtOpts);
    req.user = payload; // contains { id, email, role, iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Allow only admin or the user themself
export function requireAdminOrSelf(req, res, next) {
  const requester = req.user;
  const targetId = req.params.id;
  if (!requester) return res.status(401).json({ error: 'Not authenticated' });
  if (requester.role === 'admin' || requester.id === targetId) return next();
  return res.status(403).json({ error: 'Forbidden' });
}

// helper middleware for admin-only (used optionally inside controller)
export function requireAdmin(req, res, next) {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin required' });
}
