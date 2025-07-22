// src/controllers/tutorController.js

import { TutorModel } from '../models/tutorModel.js';

/**
 * GET /api/tutors
 */
export const getAllTutors = async (req, res) => {
  try {
    const result = await TutorModel.getAll();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tutors:', err);
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
};

/**
 * GET /api/tutors/:id
 */
export const getTutorById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const result = await TutorModel.getById(id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Tutor not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching tutor ${id}:`, err);
    res.status(500).json({ error: 'Failed to fetch tutor' });
  }
};

/**
 * GET /api/tutors/user/:user_id
 */
export const getTutorByUserId = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    const result = await TutorModel.getByUserId(user_id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Tutor not found for this user_id' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching tutor by user_id ${user_id}:`, err);
    res.status(500).json({ error: 'Failed to fetch tutor by user_id' });
  }
};

/**
 * POST /api/tutors
 * createTutor: user_id optional
 */
export const createTutor = async (req, res) => {
  // ambil user_id dari body, atau token, atau null
  const user_id = req.body.user_id || req.user?.id || null;
  const {
    nama_lengkap,
    jenis_kelamin,
    no_hp,
    email_pribadi,
    alamat,
    jenis_tutor,
    nomor_identitas,
    bidang_keahlian
  } = req.body;

  // wajib isi nama_lengkap & jenis_tutor
  if (!nama_lengkap || !jenis_tutor) {
    return res.status(400).json({
      error: 'nama_lengkap and jenis_tutor are required'
    });
  }

  try {
    const result = await TutorModel.create({
      user_id,
      nama_lengkap,
      jenis_kelamin,
      no_hp,
      email_pribadi,
      alamat,
      jenis_tutor,
      nomor_identitas,
      bidang_keahlian
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating tutor:', err);
    res.status(500).json({ error: 'Failed to create tutor' });
  }
};

/**
 * PUT /api/tutors/:id
 * updateTutor: user_id tetap dijaga kecuali di‐override
 */
export const updateTutor = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const {
    user_id: newUserId,
    nama_lengkap,
    jenis_kelamin,
    no_hp,
    email_pribadi,
    alamat,
    jenis_tutor,
    nomor_identitas,
    bidang_keahlian
  } = req.body;

  if (!nama_lengkap || !jenis_tutor) {
    return res.status(400).json({
      error: 'nama_lengkap and jenis_tutor are required'
    });
  }

  try {
    // ambil record lama
    const old = await TutorModel.getById(id);
    if (old.rows.length === 0) {
      return res.status(404).json({ error: 'Tutor not found' });
    }
    // jika body mengirim user_id baru, pakai itu; kalau tidak, jaga yg lama
    const existingUserId = newUserId ?? old.rows[0].user_id;

    const result = await TutorModel.update(id, {
      user_id: existingUserId,
      nama_lengkap,
      jenis_kelamin,
      no_hp,
      email_pribadi,
      alamat,
      jenis_tutor,
      nomor_identitas,
      bidang_keahlian
    });

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Tutor not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating tutor ${id}:`, err);
    res.status(500).json({ error: 'Failed to update tutor' });
  }
};

/**
 * DELETE /api/tutors/:id
 */
export const deleteTutor = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const result = await TutorModel.delete(id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Tutor not found' });
    res.json({ message: 'Tutor deleted successfully' });
  } catch (err) {
    console.error(`Error deleting tutor ${id}:`, err);
    res.status(500).json({ error: 'Failed to delete tutor' });
  }
};
