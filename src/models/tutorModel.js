// src\models\tutorModel.js
import { query } from '../config/db.js';

export const TutorModel = {
  getAll: () =>
    query(`SELECT * FROM tutor_profiles`),

  getById: (id) =>
    query(`SELECT * FROM tutor_profiles WHERE id = $1`, [id]),

  getByUserId: (user_id) =>
    query(`SELECT * FROM tutor_profiles WHERE user_id = $1`, [user_id]),

  create: ({
    user_id, nama_lengkap, jenis_kelamin, no_hp,
    email_pribadi, alamat, jenis_tutor,
    nomor_identitas, bidang_keahlian
  }) =>
    query(`
      INSERT INTO tutor_profiles (
        user_id, nama_lengkap, jenis_kelamin, no_hp,
        email_pribadi, alamat, jenis_tutor,
        nomor_identitas, bidang_keahlian
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        user_id, nama_lengkap, jenis_kelamin, no_hp,
        email_pribadi, alamat, jenis_tutor,
        nomor_identitas, bidang_keahlian
      ]
    ),

  update: (id, data) =>
    query(
      `UPDATE tutor_profiles SET
        nama_lengkap = $1, jenis_kelamin = $2, no_hp = $3,
        email_pribadi = $4, alamat = $5, jenis_tutor = $6,
        nomor_identitas = $7, bidang_keahlian = $8
       WHERE id = $9 RETURNING *`,
      [
        data.nama_lengkap, data.jenis_kelamin, data.no_hp,
        data.email_pribadi, data.alamat, data.jenis_tutor,
        data.nomor_identitas, data.bidang_keahlian,
        id
      ]
    ),

  delete: (id) =>
    query(`DELETE FROM tutor_profiles WHERE id = $1 RETURNING *`, [id])
};
