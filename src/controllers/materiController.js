// src/controllers/materiController.js
import { MateriModel } from '../models/materiModel.js';

export const getAllMateri = async (req, res) => {
  try {
    const result = await MateriModel.getAll();
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch materi' });
  }
};

export const getMateriById = async (req, res) => {
  try {
    const result = await MateriModel.getById(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Materi not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch materi' });
  }
};

export const createMateri = async (req, res) => {
  try {
    const result = await MateriModel.create(req.body);
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create materi' });
  }
};

export const updateMateri = async (req, res) => {
  try {
    const result = await MateriModel.update(req.params.id, req.body);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Materi not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update materi' });
  }
};

export const deleteMateri = async (req, res) => {
  try {
    const result = await MateriModel.delete(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Materi not found' });
    res.json({ message: 'Materi deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete materi' });
  }
};
