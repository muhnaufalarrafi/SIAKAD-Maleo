// src\controllers\siswaController.js
import { SiswaModel } from '../models/siswaModel.js';

export const getAllSiswa = async (req, res) => {
  try {
    const result = await SiswaModel.getAll();
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch siswa' });
  }
};

export const getSiswaById = async (req, res) => {
  try {
    const result = await SiswaModel.getById(req.params.id);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Siswa not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch siswa' });
  }
};

export const createSiswa = async (req, res) => {
  try {
    const result = await SiswaModel.create(req.body);
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create siswa' });
  }
};

export const updateSiswa = async (req, res) => {
  try {
    const result = await SiswaModel.update(req.params.id, req.body);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Siswa not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update siswa' });
  }
};

export const deleteSiswa = async (req, res) => {
  try {
    const result = await SiswaModel.delete(req.params.id);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Siswa not found' });
    res.json({ message: 'Siswa deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete siswa' });
  }
};
