// src\controllers\mapelController.js
import { MapelModel } from '../models/mapelModel.js';

export const getAllMapel = async (req, res) => {
  try {
    const result = await MapelModel.getAll();
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch mata pelajaran' });
  }
};

export const getMapelById = async (req, res) => {
  try {
    const result = await MapelModel.getById(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Mapel not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch mapel' });
  }
};

export const createMapel = async (req, res) => {
  try {
    const result = await MapelModel.create(req.body);
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create mapel' });
  }
};

export const updateMapel = async (req, res) => {
  try {
    const result = await MapelModel.update(req.params.id, req.body);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Mapel not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update mapel' });
  }
};

export const deleteMapel = async (req, res) => {
  try {
    const result = await MapelModel.delete(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Mapel not found' });
    res.json({ message: 'Mapel deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete mapel' });
  }
};
