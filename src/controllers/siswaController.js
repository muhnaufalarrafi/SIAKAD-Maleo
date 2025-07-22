// src/controllers/siswaController.js

import { SiswaModel } from '../models/siswaModel.js';

/**
 * GET /api/siswa
 * Ambil semua data siswa
 */
export const getAllSiswa = async (req, res) => {
  try {
    const result = await SiswaModel.getAll();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching siswa:', err);
    res.status(500).json({ error: 'Failed to fetch siswa' });
  }
};

/**
 * GET /api/siswa/:id
 * Ambil satu siswa berdasarkan ID
 */
export const getSiswaById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const result = await SiswaModel.getById(id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Siswa not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching siswa ${id}:`, err);
    res.status(500).json({ error: 'Failed to fetch siswa' });
  }
};

/**
 * GET /api/siswa/user/:user_id
 * Ambil satu siswa berdasarkan user_id
 */
export const getSiswaByUserId = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    const result = await SiswaModel.getByUserId(user_id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Siswa not found for this user_id' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching siswa by user_id ${user_id}:`, err);
    res.status(500).json({ error: 'Failed to fetch siswa by user_id' });
  }
};

/**
 * POST /api/siswa
 * Buat siswa baru
 *   - user_id opsional: bisa diambil dari body, atau dari req.user.id, atau null
 */
export const createSiswa = async (req, res) => {
  // Ambil user_id dari body, atau dari token (middleware auth), atau null
  const user_id = req.body.user_id ?? null;
  const {
    nis,
    nama_lengkap,
    jenis_kelamin,
    tanggal_lahir,
    kelas,
    status_aktif
  } = req.body;

  if (!nis || !nama_lengkap) {
    return res
      .status(400)
      .json({ error: 'nis and nama_lengkap are required' });
  }

  try {
    const result = await SiswaModel.create({
      user_id,
      nis,
      nama_lengkap,
      jenis_kelamin,
      tanggal_lahir,
      kelas,
      status_aktif
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating siswa:', err);
    res.status(500).json({ error: 'Failed to create siswa' });
  }
};

/**
 * PUT /api/siswa/:id
 * Update data siswa
 *   - user_id tidak wajib; jika tidak diberikan, tetap pakai yang lama
 */
export const updateSiswa = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const {
    user_id: newUserId,
    nis,
    nama_lengkap,
    jenis_kelamin,
    tanggal_lahir,
    kelas,
    status_aktif
  } = req.body;

  if (!nis || !nama_lengkap) {
    return res
      .status(400)
      .json({ error: 'nis and nama_lengkap are required' });
  }

  try {
    // Ambil record lama supaya user_id-nya tidak hilang
    const old = await SiswaModel.getById(id);
    if (old.rows.length === 0) {
      return res.status(404).json({ error: 'Siswa not found' });
    }
    const existingUserId = newUserId ?? old.rows[0].user_id;

    const result = await SiswaModel.update(id, {
      user_id: existingUserId,
      nis,
      nama_lengkap,
      jenis_kelamin,
      tanggal_lahir,
      kelas,
      status_aktif
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Siswa not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating siswa ${id}:`, err);
    res.status(500).json({ error: 'Failed to update siswa' });
  }
};

/**
 * DELETE /api/siswa/:id
 * Hapus siswa
 */
export const deleteSiswa = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const result = await SiswaModel.delete(id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Siswa not found' });
    }
    res.json({ message: 'Siswa deleted successfully' });
  } catch (err) {
    console.error(`Error deleting siswa ${id}:`, err);
    res.status(500).json({ error: 'Failed to delete siswa' });
  }
};
