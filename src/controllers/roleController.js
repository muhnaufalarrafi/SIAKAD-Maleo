//src\controllers\roleController.js
import { RoleModel } from '../models/roleModel.js';

export const getAllRoles = async (req, res) => {
  try {
    const result = await RoleModel.getAll();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve roles' });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const result = await RoleModel.getById(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Role not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve role' });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await RoleModel.create({ name, description });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create role' });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await RoleModel.update(req.params.id, { name, description });
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Role not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role' });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const result = await RoleModel.delete(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Role not found' });
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete role' });
  }
};
