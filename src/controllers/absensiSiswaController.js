// src/controllers/absensiSiswaController.js
import { AbsensiSiswaModel } from '../models/absensiSiswaModel.js';
import { TutorModel }           from '../models/tutorModel.js';

export const getAllAbsensiSiswa = async (req, res) => {
  try {
    const result = await AbsensiSiswaModel.getAll();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all absensi siswa:', err);
    res.status(500).json({ error: 'Gagal memuat data absensi siswa.' });
  }
};

export const getAbsensiSiswaById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const result = await AbsensiSiswaModel.getById(id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Absensi siswa tidak ditemukan.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching absensi siswa ${id}:`, err);
    res.status(500).json({ error: 'Gagal memuat data absensi siswa.' });
  }
};

export const getAbsensiSiswaByJadwalTanggal = async (req, res) => {
  const { jadwal_id, tanggal } = req.query;
  if (!jadwal_id || !tanggal) {
    return res
      .status(400)
      .json({ error: 'Parameter jadwal_id dan tanggal wajib diisi.' });
  }

  try {
    const result = await AbsensiSiswaModel.getByJadwalAndTanggal(
      parseInt(jadwal_id, 10),
      tanggal
    );
    res.json(result.rows);
  } catch (err) {
    console.error(
      `Error fetching absensi siswa jadwal=${jadwal_id} tanggal=${tanggal}:`,
      err
    );
    res.status(500).json({ error: 'Gagal memuat data absensi siswa.' });
  }
};

export const createAbsensiSiswa = async (req, res) => {
  try {
    const payload = req.body;
    // Validasi minimal kolom yang wajib
    const required = ['jadwal_id', 'siswa_id', 'tanggal', 'status'];
    for (const field of required) {
      if (payload[field] == null) {
        return res
          .status(400)
          .json({ error: `Field '${field}' wajib diisi.` });
      }
    }
    const result = await AbsensiSiswaModel.create(payload);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[Create AbsensiSiswa] Error:', err);
    res.status(500).json({ error: 'Gagal menyimpan absensi siswa.' });
  }
};

export const updateAbsensiSiswa = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const payload = req.body;
    const result = await AbsensiSiswaModel.update(id, payload);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Absensi siswa tidak ditemukan.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`[Update AbsensiSiswa ${id}] Error:`, err);
    res.status(500).json({ error: 'Gagal memperbarui absensi siswa.' });
  }
};

export const bulkUpsertAbsensiSiswa = async (req, res) => {
  try {
    // 1) Cari profile tutor berdasarkan user_id (req.user.id)
    const tutorRes = await TutorModel.getByUserId(req.user.id);
    if (!tutorRes.rows.length) {
      return res.status(404).json({ error: 'Profile tutor tidak ditemukan.' });
    }
    const tutorProfileId = tutorRes.rows[0].id;

    // 2) Ambil array payload dari body
    const dataArray = req.body;
    if (!Array.isArray(dataArray) || !dataArray.length) {
      return res.status(400).json({ error: 'Body harus berupa array tidak kosong.' });
    }

    // 3) Override setiap item agar pakai tutorProfileId yang valid
    const withTutor = dataArray.map(item => ({
      ...item,
      tutor_id: tutorProfileId
    }));

    // 4) Jalankan bulkInsert
    const result = await AbsensiSiswaModel.bulkUpsert(withTutor);
    return res.status(200).json(result.rows);

  } catch (err) {
    console.error('[Bulk Upsert AbsensiSiswa] Error:', err);
    return res.status(500).json({ error: 'Gagal sinkronisasi absensi siswa.' });
  }
};

export const deleteAbsensiSiswa = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const result = await AbsensiSiswaModel.delete(id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Absensi siswa tidak ditemukan.' });
    res.json({ message: 'Absensi siswa berhasil dihapus.' });
  } catch (err) {
    console.error(`[Delete AbsensiSiswa ${id}] Error:`, err);
    res.status(500).json({ error: 'Gagal menghapus absensi siswa.' });
  }
};

export const getTeachingHistoryByTutor = async (req, res) => {
  try {
    // Ambil tutor_id dari parameter URL atau dari user yang login
    const tutorId = req.params.tutor_id; 

    const history = await AbsensiSiswaModel.getByTutorId(tutorId);
    
    res.json(history.rows);

  } catch (err) {
    console.error('Error fetching teaching history:', err);
    res.status(500).json({ error: 'Gagal memuat riwayat mengajar.' });
  }
};

