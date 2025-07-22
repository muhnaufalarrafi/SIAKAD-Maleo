// src/controllers/kelasSiswaController.js
import { KelasSiswaModel } from '../models/kelasSiswaModel.js';

export const getAllKelasSiswa = async (req, res) => {
  try {
    const result = await KelasSiswaModel.getAll();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching kelas_siswa:', err);
    res.status(500).json({ error: 'Failed to fetch kelas_siswa' });
  }
};

export const getKelasSiswaById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const result = await KelasSiswaModel.getById(id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Assignment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching assignment ${id}:`, err);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
};

// rename create -> assign
export const assignSiswaToKelas = async (req, res) => {
  const { kelas_id, siswa_id } = req.body;
  if (!kelas_id || !siswa_id) {
    return res.status(400).json({ error: 'kelas_id and siswa_id are required' });
  }

  try {
    const result = await KelasSiswaModel.assign({ kelas_id, siswa_id });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error assigning siswa to kelas:', err);
    res.status(500).json({ error: 'Failed to assign siswa to kelas' });
  }
};

export const updateKelasSiswa = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const { kelas_id, siswa_id } = req.body;
  if (!kelas_id || !siswa_id) {
    return res.status(400).json({ error: 'kelas_id and siswa_id are required' });
  }

  try {
    const result = await KelasSiswaModel.update(id, { kelas_id, siswa_id });
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Assignment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating assignment ${id}:`, err);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
};

export const deleteKelasSiswa = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const result = await KelasSiswaModel.delete(id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Assignment not found' });
    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error(`Error deleting assignment ${id}:`, err);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
};
