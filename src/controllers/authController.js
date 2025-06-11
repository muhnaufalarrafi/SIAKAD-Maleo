// src\controllers\authController.js
import { UserModel } from '../models/userModel.js';
import { UserRoleModel } from '../models/userRoleModel.js';
import { UserPermissionModel } from '../models/userPermissionModel.js';
import { RolePermissionModel } from '../models/rolePermissionModel.js';
import { hashPassword, comparePassword, generate6DigitId } from '../utils/helper.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'RAHASIA_SUPERAMAN';

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

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ message: 'Login successful', token });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ambil data user dasar
    const userResult = await UserModel.getById(userId);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];

    // Ambil semua role user
    const rolesResult = await UserRoleModel.getByUserId(userId);
    const roles = rolesResult.rows.map(r => ({ id: r.role_id, name: r.role_name }));

    // Ambil permissions yang dimiliki oleh user (user_permission)
    const permissionsResult = await UserPermissionModel.getByUserId(userId);
    let userPermissions = permissionsResult.rows.map(p => ({
      id: p.permission_id,
      name: p.permission_name,
      override_type: p.override_type,
    }));

    // Jika user_permission kosong, ambil permissions berdasarkan role
    if (userPermissions.length === 0) {
      // Ambil semua permissions berdasarkan role
      const rolePermissionsResult = await RolePermissionModel.getByMultipleRoleIds(
        roles.map(role => role.id)
      );
      
      userPermissions = rolePermissionsResult.rows.map(p => ({
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
        permissions: userPermissions, // Gabungkan user_permissions dan role_permissions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
};
