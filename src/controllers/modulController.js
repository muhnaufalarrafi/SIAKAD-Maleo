// src\controllers\modulController.js
import { ModulModel } from '../models/modulModel.js';

export const getAllModul = async (req, res) => {
  try {
    const result = await ModulModel.getAll();
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch modul' });
  }
};

export const getModulById = async (req, res) => {
  try {
    const result = await ModulModel.getById(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Modul not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch modul' });
  }
};

export const createModul = async (req, res) => {
  try {
    const result = await ModulModel.create(req.body);
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create modul' });
  }
};

export const updateModul = async (req, res) => {
  try {
    const result = await ModulModel.update(req.params.id, req.body);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Modul not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update modul' });
  }
};

export const deleteModul = async (req, res) => {
  try {
    const result = await ModulModel.delete(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Modul not found' });
    res.json({ message: 'Modul deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete modul' });
  }
};
