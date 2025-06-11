//src\models\jadwalModel.js
import { query } from '../config/db.js';

export const JadwalModel = {
  getAll: () => query(`
    SELECT jk.*, mp.nama AS nama_mapel, tp.nama_lengkap AS nama_tutor
    FROM jadwal_kelas jk
    JOIN mata_pelajaran mp ON mp.id = jk.mata_pelajaran_id
    JOIN tutor_profiles tp ON tp.id = jk.tutor_id
    ORDER BY jk.hari, jk.jam_mulai
  `),

  getById: (id) => query(`
    SELECT jk.*, mp.nama AS nama_mapel, tp.nama_lengkap AS nama_tutor
    FROM jadwal_kelas jk
    JOIN mata_pelajaran mp ON mp.id = jk.mata_pelajaran_id
    JOIN tutor_profiles tp ON tp.id = jk.tutor_id
    WHERE jk.id = $1
  `, [id]),

  create: ({ mata_pelajaran_id, tutor_id, hari, jam_mulai, jam_selesai, tempat, keterangan }) =>
    query(`
      INSERT INTO jadwal_kelas (
        mata_pelajaran_id, tutor_id, hari, jam_mulai, jam_selesai, tempat, keterangan
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [mata_pelajaran_id, tutor_id, hari, jam_mulai, jam_selesai, tempat, keterangan]
    ),

  update: (id, data) =>
    query(`
      UPDATE jadwal_kelas SET
        mata_pelajaran_id = $1,
        tutor_id = $2,
        hari = $3,
        jam_mulai = $4,
        jam_selesai = $5,
        tempat = $6,
        keterangan = $7
      WHERE id = $8 RETURNING *`,
      [
        data.mata_pelajaran_id, data.tutor_id, data.hari,
        data.jam_mulai, data.jam_selesai, data.tempat, data.keterangan, id
      ]
    ),

  delete: (id) => query(`DELETE FROM jadwal_kelas WHERE id = $1 RETURNING *`, [id])
};
