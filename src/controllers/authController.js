// src\controllers\authController.js
import { UserModel } from '../models/userModel.js';
import { UserRoleModel } from '../models/userRoleModel.js';
import { UserPermissionModel } from '../models/userPermissionModel.js';
import { RolePermissionModel } from '../models/rolePermissionModel.js';
import { hashPassword, comparePassword, generate6DigitId } from '../utils/helper.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const id = generate6DigitId();
    const { username, email, password } = req.body;
    const hashed = await hashPassword(password);
    const result = await UserModel.create({
      id, username, email, password: hashed, status_aktif: true
    });
    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const result = await UserModel.getByIdentifier(identifier);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

        // --- MODIFIKASI DIMULAI DI SINI ---

    // 1) Naikkan versi token di database
    const newVersion = (user.token_version || 0) + 1;
    await UserModel.updateTokenVersion(user.id, newVersion); // Pastikan model Anda punya fungsi ini


    // 2) Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, version: newVersion },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const isLocalhost = req.hostname === 'localhost';

    // 2) Set sebagai HTTP-only cookie
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: !isLocalhost,           // ← secure: false di localhost
        sameSite: isLocalhost ? 'lax' : 'none', // ← lax agar tetap kirim antar port
        maxAge: 24 * 60 * 60 * 1000,    // 1 hari
      })
      .json({ message: 'Login successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// — Opsional: logout endpoint untuk clear cookie
export const logout = async (req, res) => {
    try {
    // Invalidate sesi di backend dengan menaikkan versi token
    if (req.user) {
      const newVersion = (req.user.db_version || 0) + 1; // Ambil versi dari DB yg sudah divalidasi middleware
      await UserModel.updateTokenVersion(req.user.id, newVersion);
    }
  } catch(err) {
    // abaikan error jika terjadi, yang penting cookie dihapus
    console.error("Error invalidating token on logout:", err);
  }

  const isLocalhost = req.hostname === 'localhost';

  res
    .clearCookie('token', {
        httpOnly: true,
        secure: !isLocalhost,           // ← secure: false di localhost
        sameSite: isLocalhost ? 'lax' : 'none', // ← lax agar tetap kirim antar port
        maxAge: 24 * 60 * 60 * 1000,    // 1 hari
    })
    .json({ message: 'Logout successful' });
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const userResult = await UserModel.getById(userId);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];

    const rolesResult = await UserRoleModel.getByUserId(userId);
    const roles = rolesResult.rows.map(r => ({ id: r.role_id, name: r.role_name }));

    const permissionsResult = await UserPermissionModel.getByUserId(userId);
    let userPermissions = permissionsResult.rows.map(p => ({
      id: p.permission_id,
      name: p.permission_name,
      override_type: p.override_type,
    }));

    if (userPermissions.length === 0) {
      const rolePermRes = await RolePermissionModel.getByMultipleRoleIds(
        roles.map(r => r.id)
      );
      userPermissions = rolePermRes.rows.map(p => ({
        id: p.permission_id,
        name: p.permission_name,
      }));
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status_aktif: user.status_aktif,
        roles,
        permissions: userPermissions,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
};

// --- FUNGSI BARU UNTUK UPDATE PROFIL SENDIRI ---
export const updateMyAccount = async (req, res) => {
  try {
    // Ambil ID dari user yang sudah diautentikasi (dari token)
    const { id } = req.user; 
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Tidak ada data untuk diperbarui.' });
    }

    // Hash password jika ada
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    // Panggil model yang sudah diperbaiki
    const result = await UserModel.update(id, updates);
    if (result.rows.length === 0) {
      // Ini seharusnya tidak terjadi jika token valid
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Update my account error:', err);
    res.status(500).json({ error: 'Gagal memperbarui akun.' });
  }
};

