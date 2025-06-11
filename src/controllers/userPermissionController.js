import { UserPermissionModel } from '../models/userPermissionModel.js';

export const getAllUserPermissions = async (req, res) => {
  try {
    const result = await UserPermissionModel.getAll();
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch user-permissions' });
  }
};

export const getUserPermissionsByUserId = async (req, res) => {
  try {
    const result = await UserPermissionModel.getByUserId(req.params.user_id);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch overrides for user' });
  }
};

export const getUsersByPermissionId = async (req, res) => {
  try {
    const result = await UserPermissionModel.getByPermissionId(req.params.permission_id);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users for permission' });
  }
};

export const assignUserPermission = async (req, res) => {
  try {
    const { user_id, permission_id, override_type } = req.body;
    if (!['allow', 'deny'].includes(override_type)) {
      return res.status(400).json({ error: 'override_type must be "allow" or "deny"' });
    }
    const result = await UserPermissionModel.assign({ user_id, permission_id, override_type });
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to assign override permission' });
  }
};

export const removeUserPermission = async (req, res) => {
  try {
    const { user_id, permission_id } = req.body;
    const result = await UserPermissionModel.remove({ user_id, permission_id });
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Permission override removed' });
  } catch {
    res.status(500).json({ error: 'Failed to remove permission override' });
  }
};
