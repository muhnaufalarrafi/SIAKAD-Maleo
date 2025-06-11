// src\controllers\userController.js
import { UserModel } from '../models/userModel.js';
import { UserRoleModel } from '../models/userRoleModel.js';
import { UserPermissionModel } from '../models/userPermissionModel.js';
import { hashPassword, generate6DigitId } from '../utils/helper.js';

export const getAllUsers = async (req, res) => {
  try {
    // Ambil semua data pengguna
    const result = await UserModel.getAll();

    // Untuk setiap user, kita ambil role dan permission terkait
    const usersWithDetails = await Promise.all(result.rows.map(async (user) => {
      try {
        // Ambil semua role user
        const rolesResult = await UserRoleModel.getByUserId(user.id);
        const roles = rolesResult.rows.map(r => ({ id: r.role_id, name: r.role_name }));

        // Ambil permissions yang dimiliki oleh user
        const permissionsResult = await UserPermissionModel.getByUserId(user.id);
        const userPermissions = permissionsResult.rows.map(p => ({
          id: p.permission_id,
          name: p.permission_name,
          override_type: p.override_type,
        }));

        // Gabungkan data user dengan roles dan permissions
        return {
          ...user,
          roles,
          permissions: userPermissions,
        };
      } catch (err) {
        console.error('Error fetching roles or permissions for user:', user.id, err);
        return null;  // Jika terjadi error, return null
      }
    }));

    // Filter out users yang null (jika ada error saat fetch roles atau permissions)
    const validUsers = usersWithDetails.filter(user => user !== null);

    // Kirimkan hasil data users beserta roles dan permissions
    res.json(validUsers);
  } catch (err) {
    console.error('Error in getAllUsers:', err);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const result = await UserModel.getById(req.params.id);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

export const createUser = async (req, res) => {
  try {
    const id = generate6DigitId();
    const { username, email, password, status_aktif } = req.body;
    const hashedPassword = await hashPassword(password);

    const result = await UserModel.create({
      id,
      username,
      email,
      password: hashedPassword,
      status_aktif
    });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, status_aktif, password } = req.body;
    let updatedData = { username, email, status_aktif };

    // jika password dikirim, hash dan tambahkan
    if (password) {
      const hashed = await hashPassword(password);
      updatedData.password = hashed;
    }

    const result = await UserModel.update(req.params.id, updatedData);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await UserModel.delete(req.params.id);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
