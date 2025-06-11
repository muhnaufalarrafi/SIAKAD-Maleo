// src\controllers\absensiGuruController.js
import { AbsensiGuruModel } from '../models/absensiGuruModel.js';

export const getAllAbsensiGuru = async (req, res) => {
  try {
    const result = await AbsensiGuruModel.getAll();
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch absensi guru' });
  }
};

export const getAbsensiGuruById = async (req, res) => {
  try {
    const result = await AbsensiGuruModel.getById(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Data not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch absensi guru' });
  }
};

export const checkinGuru = async (req, res) => {
  try {
    const { tutor_id, tanggal } = req.body;

    if (!tutor_id || !tanggal) {
      return res.status(400).json({ error: 'tutor_id dan tanggal wajib diisi' });
    }

    // ⛔ Cek dulu apakah sudah check-in hari ini
    const existing = await AbsensiGuruModel.getByTutorAndTanggal(tutor_id, tanggal);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Sudah melakukan check-in hari ini' });
    }

    console.log('Final req.body:', req.body);

    // Insert absensi
    const result = await AbsensiGuruModel.create(req.body);
    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('[Check-in Error]', err);

    if (err.code === '23505') {
      return res.status(409).json({ error: 'Sudah melakukan check-in hari ini' });
    }

    res.status(500).json({ error: 'Check-in gagal' });
  }
};

export const checkoutGuru = async (req, res) => {
  try {
    const result = await AbsensiGuruModel.updateCheckout(req.params.id, req.body);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Data not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Check-out gagal' });
  }
};
