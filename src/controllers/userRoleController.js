import { UserRoleModel } from '../models/userRoleModel.js';

export const getAllUserRoles = async (req, res) => {
  try {
    const result = await UserRoleModel.getAll();
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch user roles' });
  }
};

export const getUserRolesByUserId = async (req, res) => {
  try {
    const result = await UserRoleModel.getByUserId(req.params.user_id);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch roles for user' });
  }
};

export const getUserRolesByRoleId = async (req, res) => {
  try {
    const result = await UserRoleModel.getByRoleId(req.params.role_id);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users with role' });
  }
};

export const assignUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;
    const result = await UserRoleModel.assign({ user_id, role_id });
    res.status(201).json(result.rows[0] || { message: 'Role already assigned' });
  } catch {
    res.status(500).json({ error: 'Failed to assign role to user' });
  }
};

export const removeUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;
    const result = await UserRoleModel.remove({ user_id, role_id });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User-role not found' });
    }
    res.json({ message: 'Role removed from user' });
  } catch {
    res.status(500).json({ error: 'Failed to remove role from user' });
  }
};
