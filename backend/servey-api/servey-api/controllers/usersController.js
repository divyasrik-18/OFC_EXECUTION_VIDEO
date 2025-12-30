import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
// FIX: Point to the correct location in the config folder
import { pool, query as dbQuery } from '../config/db.js'; 
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

/**
 * Create a new user
 */
export async function createUser(req, res) {
  try {
    const { email, name, password, mobile, role } = req.body;
    if (!email || !name || !password) return res.status(400).json({ error: 'email, name and password required' });

    const exists = await dbQuery('SELECT id FROM users WHERE lower(email)=lower($1) AND deleted = false', [email]);
    if (exists.rows.length) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const id = uuidv4();
    const now = new Date().toISOString();

    const insert = `INSERT INTO users(id, email, name, role, password_hash, mobile, created_at, updated_at)
                    VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, email, name, role, mobile, created_at`;
    const vals = [id, email, name, role || 'user', passwordHash, mobile || null, now, now];
    const r = await dbQuery(insert, vals);

    return res.status(201).json({ user: r.rows[0] });
  } catch (err) {
    console.error('createUser:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const r = await dbQuery('SELECT id, email, name, role, password_hash, blocked, deleted FROM users WHERE lower(email)=lower($1)', [email]);
    if (!r.rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = r.rows[0];
    if (user.deleted) return res.status(403).json({ error: 'Account deleted' });
    if (user.blocked) return res.status(403).json({ error: 'Account blocked' });

    const valid = await bcrypt.compare(password, user.password_hash || '');
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error('login:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Get user by id
 */
export async function getUser(req, res) {
  try {
    const id = req.params.id;
    const r = await dbQuery('SELECT id, email, name, role, mobile, created_at, updated_at, blocked, deleted FROM users WHERE id=$1', [id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    return res.json({ user: r.rows[0] });
  } catch (err) {
    console.error('getUser:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * List users
 */
export async function listUsers(req, res) {
  try {
    const { role } = req.query;
    let r;
    if (role) {
      r = await dbQuery('SELECT id, email, name, role, mobile, blocked, deleted FROM users WHERE role=$1', [role]);
    } else {
      r = await dbQuery('SELECT id, email, name, role, mobile, blocked, deleted FROM users');
    }
    return res.json({ users: r.rows });
  } catch (err) {
    console.error('listUsers:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Update user
 */
export async function updateUser(req, res) {
  try {
    const id = req.params.id;
    const { name, mobile, role } = req.body;

    if (role && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can change role' });
    }

    const now = new Date().toISOString();
    const updateText = `UPDATE users SET name = COALESCE($1, name), mobile = COALESCE($2, mobile),
                        role = COALESCE($3, role), updated_at = $4
                        WHERE id = $5 RETURNING id, email, name, role, mobile, updated_at`;
    const vals = [name || null, mobile || null, role || null, now, id];
    const r = await dbQuery(updateText, vals);
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    return res.json({ user: r.rows[0] });
  } catch (err) {
    console.error('updateUser:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Change password
 */
export async function changePassword(req, res) {
  try {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ error: 'newPassword required' });

    const r = await dbQuery('SELECT id, password_hash, role FROM users WHERE id=$1', [id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    const user = r.rows[0];

    const requester = req.user;
    if (requester.id !== id && requester.role !== 'admin') {
      return res.status(403).json({ error: 'Not allowed' });
    }

    if (requester.role !== 'admin' || requester.id === id) {
      if (!oldPassword) return res.status(400).json({ error: 'oldPassword required' });
      const valid = await bcrypt.compare(oldPassword, user.password_hash || '');
      if (!valid) return res.status(401).json({ error: 'oldPassword incorrect' });
    }

    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await dbQuery('UPDATE users SET password_hash=$1, updated_at=now() WHERE id=$2', [newHash, id]);
    return res.json({ ok: true });
  } catch (err) {
    console.error('changePassword:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Block user
 */
export async function blockUser(req, res) {
  try {
    const requester = req.user;
    if (requester.role !== 'admin') return res.status(403).json({ error: 'Admin required' });

    const id = req.params.id;
    const { blocked } = req.body;
    if (typeof blocked !== 'boolean') return res.status(400).json({ error: 'blocked boolean required' });

    const r = await dbQuery('UPDATE users SET blocked=$1, updated_at=now() WHERE id=$2 RETURNING id, email, blocked', [blocked, id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    return res.json({ user: r.rows[0] });
  } catch (err) {
    console.error('blockUser:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Delete user
 */
export async function deleteUser(req, res) {
  try {
    const requester = req.user;
    if (requester.role !== 'admin') return res.status(403).json({ error: 'Admin required' });

    const id = req.params.id;
    const r = await dbQuery('UPDATE users SET deleted = true, updated_at = now() WHERE id = $1 RETURNING id, email, deleted', [id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    return res.json({ user: r.rows[0] });
  } catch (err) {
    console.error('deleteUser:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}




