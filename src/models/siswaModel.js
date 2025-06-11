// src\models\siswaModel.js
import { query } from '../config/db.js';

export const SiswaModel = {
  getAll: () => query(`SELECT * FROM siswa_profiles`),

  getById: (id) => query(`SELECT * FROM siswa_profiles WHERE id = $1`, [id]),

  getByUserId: (user_id) => query(`SELECT * FROM siswa_profiles WHERE user_id = $1`, [user_id]),

  create: ({
    user_id, nis, nama_lengkap, jenis_kelamin,
    tanggal_lahir, kelas, status_aktif
  }) =>
    query(`
      INSERT INTO siswa_profiles (
        user_id, nis, nama_lengkap, jenis_kelamin,
        tanggal_lahir, kelas, status_aktif
      ) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [user_id, nis, nama_lengkap, jenis_kelamin, tanggal_lahir, kelas, status_aktif]
    ),

  update: (id, data) =>
    query(`
      UPDATE siswa_profiles SET
        nis = $1, nama_lengkap = $2, jenis_kelamin = $3,
        tanggal_lahir = $4, kelas = $5, status_aktif = $6
      WHERE id = $7 RETURNING *`,
      [
        data.nis, data.nama_lengkap, data.jenis_kelamin,
        data.tanggal_lahir, data.kelas, data.status_aktif,
        id
      ]
    ),

  delete: (id) =>
    query(`DELETE FROM siswa_profiles WHERE id = $1 RETURNING *`, [id])
};
