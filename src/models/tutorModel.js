// src/models/tutorModel.js
import { query } from '../config/db.js';

export const TutorModel = {
  getAll: () =>
    query(`
      SELECT
        id,
        user_id,
        nama_lengkap,
        jenis_kelamin,
        no_hp,
        email_pribadi,
        alamat,
        jenis_tutor,
        nomor_identitas,
        bidang_keahlian
      FROM tutor_profiles
      ORDER BY id
    `),

  getById: (id) =>
    query(
      `SELECT
         id,
         user_id,
         nama_lengkap,
         jenis_kelamin,
         no_hp,
         email_pribadi,
         alamat,
         jenis_tutor,
         nomor_identitas,
         bidang_keahlian
       FROM tutor_profiles
       WHERE id = $1`,
      [id]
    ),

  getByUserId: (user_id) =>
    query(
      `SELECT
         id,
         user_id,
         nama_lengkap,
         jenis_kelamin,
         no_hp,
         email_pribadi,
         alamat,
         jenis_tutor,
         nomor_identitas,
         bidang_keahlian
       FROM tutor_profiles
       WHERE user_id = $1`,
      [user_id]
    ),

  create: ({
    user_id,
    nama_lengkap,
    jenis_kelamin,
    no_hp,
    email_pribadi,
    alamat,
    jenis_tutor,
    nomor_identitas,
    bidang_keahlian
  }) =>
    query(
      `INSERT INTO tutor_profiles (
         user_id,
         nama_lengkap,
         jenis_kelamin,
         no_hp,
         email_pribadi,
         alamat,
         jenis_tutor,
         nomor_identitas,
         bidang_keahlian
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        user_id,
        nama_lengkap,
        jenis_kelamin,
        no_hp,
        email_pribadi,
        alamat,
        jenis_tutor,
        nomor_identitas,
        bidang_keahlian
      ]
    ),

  update: (id, {
    user_id,
    nama_lengkap,
    jenis_kelamin,
    no_hp,
    email_pribadi,
    alamat,
    jenis_tutor,
    nomor_identitas,
    bidang_keahlian
  }) =>
    query(
      `UPDATE tutor_profiles SET
         user_id        = $1,
         nama_lengkap   = $2,
         jenis_kelamin  = $3,
         no_hp          = $4,
         email_pribadi  = $5,
         alamat         = $6,
         jenis_tutor    = $7,
         nomor_identitas= $8,
         bidang_keahlian= $9
       WHERE id = $10
       RETURNING *`,
      [
        user_id,
        nama_lengkap,
        jenis_kelamin,
        no_hp,
        email_pribadi,
        alamat,
        jenis_tutor,
        nomor_identitas,
        bidang_keahlian,
        id
      ]
    ),

  delete: (id) =>
    query(`DELETE FROM tutor_profiles WHERE id = $1 RETURNING *`, [id])
};
