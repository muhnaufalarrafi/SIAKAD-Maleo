// src/controllers/kelasController.js
import { KelasModel } from '../models/kelasModel.js';

export const getAllKelas = async (req, res) => {
  try {
    const result = await KelasModel.getAll();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching kelas:', err);
    res.status(500).json({ error: 'Failed to fetch kelas' });
  }
};

export const getKelasById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const result = await KelasModel.getById(id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Kelas not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching kelas ${id}:`, err);
    res.status(500).json({ error: 'Failed to fetch kelas' });
  }
};

export const createKelas = async (req, res) => {
  const { nama, tingkat, program_id, tahun_ajaran } = req.body;
  if (!nama || tingkat == null || !program_id || !tahun_ajaran) {
    return res.status(400).json({
      error: 'nama, tingkat, program_id, and tahun_ajaran are required'
    });
  }

  try {
    const result = await KelasModel.create({ nama, tingkat, program_id, tahun_ajaran });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating kelas:', err);
    res.status(500).json({ error: 'Failed to create kelas' });
  }
};

export const updateKelas = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const { nama, tingkat, program_id, tahun_ajaran } = req.body;
  if (!nama || tingkat == null || !program_id || !tahun_ajaran) {
    return res.status(400).json({
      error: 'nama, tingkat, program_id, and tahun_ajaran are required'
    });
  }

  try {
    const result = await KelasModel.update(id, { nama, tingkat, program_id, tahun_ajaran });
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Kelas not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating kelas ${id}:`, err);
    res.status(500).json({ error: 'Failed to update kelas' });
  }
};

export const deleteKelas = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const result = await KelasModel.delete(id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Kelas not found' });
    res.json({ message: 'Kelas deleted successfully' });
  } catch (err) {
    console.error(`Error deleting kelas ${id}:`, err);
    res.status(500).json({ error: 'Failed to delete kelas' });
  }
};
