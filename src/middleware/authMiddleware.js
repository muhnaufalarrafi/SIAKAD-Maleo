// src\middleware\authMiddleware.js
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js'; // <-- TAMBAHKAN IMPORT INI

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export const authenticate = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not found' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
        // 1. Ambil data user dari database
    const userResult = await UserModel.getById(decoded.id);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized: User no longer exists' });
    }
    const userFromDb = userResult.rows[0];

    // 2. Bandingkan versi token dari JWT dengan yang ada di DB
    if (userFromDb.token_version !== decoded.version) {
      return res.status(401).json({ 
        error: 'Unauthorized: Session has expired due to a new login from another device.' 
      });
    }

    // Jika valid, lanjutkan dan simpan data user di request

    req.user = decoded;
    req.user.db_version = userFromDb.token_version;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
