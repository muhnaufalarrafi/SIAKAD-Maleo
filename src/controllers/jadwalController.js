// src\controllers\jadwalController.js
import { JadwalModel } from '../models/jadwalModel.js';

export const getAllJadwal = async (req, res) => {
  try {
    const result = await JadwalModel.getAll();
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch jadwal kelas' });
  }
};

export const getJadwalById = async (req, res) => {
  try {
    const result = await JadwalModel.getById(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Jadwal not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch jadwal' });
  }
};

export const createJadwal = async (req, res) => {
  try {
    const result = await JadwalModel.create(req.body);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating tutor:", err);
    res.status(500).json({ error: 'Failed to create jadwal' });
  }
};

export const updateJadwal = async (req, res) => {
  try {
    const result = await JadwalModel.update(req.params.id, req.body);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Jadwal not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update jadwal' });
  }
};

export const deleteJadwal = async (req, res) => {
  try {
    const result = await JadwalModel.delete(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Jadwal not found' });
    res.json({ message: 'Jadwal deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete jadwal' });
  }
};
