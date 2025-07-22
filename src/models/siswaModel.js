// src/models/siswaModel.js
import { query } from '../config/db.js';

export const SiswaModel = {
  getAll: () =>
    query(`
      SELECT
        id,
        user_id,
        nis,
        nama_lengkap,
        jenis_kelamin,
        tanggal_lahir,
        kelas,
        status_aktif
      FROM siswa_profiles
      ORDER BY id
    `),

  getById: (id) =>
    query(
      `SELECT
         id,
         user_id,
         nis,
         nama_lengkap,
         jenis_kelamin,
         tanggal_lahir,
         kelas,
         status_aktif
       FROM siswa_profiles
       WHERE id = $1`,
      [id]
    ),

  getByUserId: (user_id) =>
    query(
      `SELECT
         id,
         user_id,
         nis,
         nama_lengkap,
         jenis_kelamin,
         tanggal_lahir,
         kelas,
         status_aktif
       FROM siswa_profiles
       WHERE user_id = $1`,
      [user_id]
    ),

  create: ({
    user_id,
    nis,
    nama_lengkap,
    jenis_kelamin,
    tanggal_lahir,
    kelas,
    status_aktif
  }) =>
    query(
      `INSERT INTO siswa_profiles (
         user_id,
         nis,
         nama_lengkap,
         jenis_kelamin,
         tanggal_lahir,
         kelas,
         status_aktif
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, nis, nama_lengkap, jenis_kelamin, tanggal_lahir, kelas, status_aktif]
    ),

  update: (id, {
    user_id,
    nis,
    nama_lengkap,
    jenis_kelamin,
    tanggal_lahir,
    kelas,
    status_aktif
  }) =>
    query(
      `UPDATE siswa_profiles SET
         user_id       = $1,
         nis           = $2,
         nama_lengkap  = $3,
         jenis_kelamin = $4,
         tanggal_lahir = $5,
         kelas         = $6,
         status_aktif  = $7
       WHERE id = $8
       RETURNING *`,
      [user_id, nis, nama_lengkap, jenis_kelamin, tanggal_lahir, kelas, status_aktif, id]
    ),

  delete: (id) =>
    query(`DELETE FROM siswa_profiles WHERE id = $1 RETURNING *`, [id])
};
