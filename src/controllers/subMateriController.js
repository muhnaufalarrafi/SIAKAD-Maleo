// src/controllers/subMateriController.js
import { SubMateriModel } from '../models/subMateriModel.js';

export const getAllSubMateri = async (req, res) => {
  try {
    const result = await SubMateriModel.getAll();
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch sub materi' });
  }
};

export const getSubMateriById = async (req, res) => {
  try {
    const result = await SubMateriModel.getById(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Sub materi not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch sub materi' });
  }
};

export const createSubMateri = async (req, res) => {
  try {
    const result = await SubMateriModel.create(req.body);
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create sub materi' });
  }
};

export const updateSubMateri = async (req, res) => {
  try {
    const result = await SubMateriModel.update(req.params.id, req.body);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Sub materi not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update sub materi' });
  }
};

export const deleteSubMateri = async (req, res) => {
  try {
    const result = await SubMateriModel.delete(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Sub materi not found' });
    res.json({ message: 'Sub materi deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete sub materi' });
  }
};
