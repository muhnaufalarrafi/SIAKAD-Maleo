// src\controllers\absensiSiswaController.js
import { AbsensiSiswaModel } from '../models/absensiSiswaModel.js';

export const getAbsensiSiswaByJadwalTanggal = async (req, res) => {
  const { jadwal_id, tanggal } = req.query;
  try {
    const result = await AbsensiSiswaModel.getByJadwalAndTanggal(jadwal_id, tanggal);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Gagal mengambil data absensi siswa' });
  }
};

export const inputAbsensiSiswa = async (req, res) => {
  try {
    const dataArray = req.body; // array of siswa absensi
    if (!Array.isArray(dataArray) || dataArray.length === 0)
      return res.status(400).json({ error: 'Input harus berupa array' });

    const result = await AbsensiSiswaModel.bulkInsert(dataArray);
    res.status(201).json(result.rows);
  } catch {
    res.status(500).json({ error: 'Gagal menyimpan absensi siswa' });
  }
};
