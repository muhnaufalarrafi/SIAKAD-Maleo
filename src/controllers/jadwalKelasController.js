// src/controllers/jadwalKelasController.js
import { JadwalKelasModel } from '../models/jadwalKelasModel.js';
import { TutorModel } from '../models/tutorModel.js';

export const getAllJadwal = async (req, res) => {
  try {
    const result = await JadwalKelasModel.getAll();
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data jadwal' });
  }
};

export const getJadwalById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await JadwalKelasModel.getById(id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data jadwal' });
  }
};

export const getJadwalByTutorId = async (req, res) => {
  const user_id = parseInt(req.params.tutor_id, 10); // sebenarnya ini user_id
  try {
    const tutor = await TutorModel.getByUserId(user_id);
    if (!tutor.rows.length) {
      return res.status(403).json({ error: 'Akun ini bukan tutor.' });
    }

    const tutorProfileId = tutor.rows[0].id;

    const result = await JadwalKelasModel.getByTutorId(tutorProfileId);
    const grouped = result.rows.reduce((acc, item) => {
      if (!acc[item.hari]) acc[item.hari] = [];
      acc[item.hari].push(item);
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil jadwal berdasarkan tutor' });
  }
};


export const createJadwal = async (req, res) => {
  try {
    const payload = req.body;
    const result = await JadwalKelasModel.create(payload);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal membuat jadwal' });
  }
};

export const updateJadwal = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await JadwalKelasModel.update(id, req.body);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui jadwal' });
  }
};

export const deleteJadwal = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await JadwalKelasModel.delete(id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json({ message: 'Jadwal berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus jadwal' });
  }
};
