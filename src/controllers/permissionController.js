// src\controllers\permissionController.js
import { PermissionModel } from '../models/permissionModel.js';

export const getAllPermissions = async (req, res) => {
  try {
    const result = await PermissionModel.getAll();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve permissions' });
  }
};

export const getPermissionById = async (req, res) => {
  try {
    const result = await PermissionModel.getById(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Permission not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve permission' });
  }
};

export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await PermissionModel.create({ name, description });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create permission' });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await PermissionModel.update(req.params.id, { name, description });
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Permission not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update permission' });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const result = await PermissionModel.delete(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Permission not found' });
    res.json({ message: 'Permission deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete permission' });
  }
};
