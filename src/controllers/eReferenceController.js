// src\controllers\eReferenceController.js
import { EReferenceModel } from '../models/eReferenceModel.js';

export const getAllEReference = async (req, res) => {
  try {
    const result = await EReferenceModel.getAll();
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Gagal mengambil data e-reference' });
  }
};

export const getEReferenceById = async (req, res) => {
  try {
    const result = await EReferenceModel.getById(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
};

export const createEReference = async (req, res) => {
  try {
    const result = await EReferenceModel.create(req.body);
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Gagal membuat e-reference' });
  }
};

export const updateEReference = async (req, res) => {
  try {
    const result = await EReferenceModel.update(req.params.id, req.body);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Gagal memperbarui data' });
  }
};

export const deleteEReference = async (req, res) => {
  try {
    const result = await EReferenceModel.delete(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json({ message: 'E-reference berhasil dihapus' });
  } catch {
    res.status(500).json({ error: 'Gagal menghapus data' });
  }
};
