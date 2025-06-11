// src\controllers\kelasSiswaController.js
import { KelasSiswaModel } from '../models/kelasSiswaModel.js';

export const getSiswaByJadwal = async (req, res) => {
  try {
    const result = await KelasSiswaModel.getByJadwal(req.params.jadwalId);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch siswa for this jadwal' });
  }
};

export const assignSiswaToJadwal = async (req, res) => {
  try {
    const result = await KelasSiswaModel.assign(req.body);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // UNIQUE violation
      return res.status(409).json({ error: 'Siswa sudah tergabung dalam jadwal ini' });
    }
    res.status(500).json({ error: 'Failed to assign siswa to jadwal' });
  }
};

export const removeSiswaFromJadwal = async (req, res) => {
  try {
    const result = await KelasSiswaModel.remove(req.body);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json({ message: 'Siswa removed from jadwal successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to remove siswa from jadwal' });
  }
};
