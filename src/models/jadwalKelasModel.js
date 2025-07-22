// src/models/jadwalKelasModel.js
import { query } from '../config/db.js';

export const JadwalKelasModel = {
  // Ambil semua jadwal
  getAll: () =>
    query(`
      SELECT
        id,
        mata_pelajaran_id,
        tutor_id,
        hari,
        jam_mulai,
        jam_selesai,
        tempat,
        keterangan,
        kelas_id
      FROM jadwal_kelas
      ORDER BY id
    `),

  // Ambil satu jadwal berdasarkan ID
  getById: (id) =>
    query(
      `
      SELECT
        id,
        mata_pelajaran_id,
        tutor_id,
        hari,
        jam_mulai,
        jam_selesai,
        tempat,
        keterangan,
        kelas_id
      FROM jadwal_kelas
      WHERE id = $1
    `,
      [id]
    ),

// src/models/jadwalKelasModel.js
getByTutorId: (tutor_id) =>
  query(`
    SELECT
      jk.id,
      jk.kelas_id,              -- ← tambahkan ini
      mp.nama       AS nama_mapel,
      k.nama        AS nama_kelas,
      jk.hari,
      to_char(jk.jam_mulai,   'HH24:MI') AS jam_mulai,
      to_char(jk.jam_selesai, 'HH24:MI') AS jam_selesai,
      jk.tempat,
      jk.keterangan
    FROM jadwal_kelas jk
    JOIN mata_pelajaran mp ON mp.id = jk.mata_pelajaran_id
    JOIN kelas           k  ON k.id  = jk.kelas_id
    WHERE jk.tutor_id = $1
    ORDER BY jk.hari, jk.jam_mulai
  `, [tutor_id]),

  // Buat jadwal baru
  create: ({
    mata_pelajaran_id,
    tutor_id,
    hari,
    jam_mulai,
    jam_selesai,
    tempat = null,
    keterangan = null,
    kelas_id = null
  }) =>
    query(
      `
      INSERT INTO jadwal_kelas (
        mata_pelajaran_id,
        tutor_id,
        hari,
        jam_mulai,
        jam_selesai,
        tempat,
        keterangan,
        kelas_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
      [
        mata_pelajaran_id,
        tutor_id,
        hari,
        jam_mulai,
        jam_selesai,
        tempat,
        keterangan,
        kelas_id
      ]
    ),

  // Update jadwal yang sudah ada
  update: (
    id,
    {
      mata_pelajaran_id,
      tutor_id,
      hari,
      jam_mulai,
      jam_selesai,
      tempat = null,
      keterangan = null,
      kelas_id = null
    }
  ) =>
    query(
      `
      UPDATE jadwal_kelas SET
        mata_pelajaran_id = $1,
        tutor_id          = $2,
        hari              = $3,
        jam_mulai         = $4,
        jam_selesai       = $5,
        tempat            = $6,
        keterangan        = $7,
        kelas_id          = $8
      WHERE id = $9
      RETURNING *
    `,
      [
        mata_pelajaran_id,
        tutor_id,
        hari,
        jam_mulai,
        jam_selesai,
        tempat,
        keterangan,
        kelas_id,
        id
      ]
    ),

  // Hapus jadwal berdasarkan ID
  delete: (id) =>
    query(
      `
      DELETE FROM jadwal_kelas
      WHERE id = $1
      RETURNING *
    `,
      [id]
    )
};
