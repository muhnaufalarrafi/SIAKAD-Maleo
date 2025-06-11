// src\models\kelasSiswaModel.js
import { query } from '../config/db.js';

export const KelasSiswaModel = {
  getByJadwal: (jadwalId) =>
    query(`
      SELECT ks.*, sp.nama_lengkap AS nama_siswa
      FROM kelas_siswa ks
      JOIN siswa_profiles sp ON sp.id = ks.siswa_id
      WHERE ks.jadwal_kelas_id = $1
    `, [jadwalId]),

  assign: ({ jadwal_kelas_id, siswa_id }) =>
    query(`
      INSERT INTO kelas_siswa (jadwal_kelas_id, siswa_id)
      VALUES ($1, $2) RETURNING *`,
      [jadwal_kelas_id, siswa_id]
    ),

  remove: ({ jadwal_kelas_id, siswa_id }) =>
    query(`
      DELETE FROM kelas_siswa
      WHERE jadwal_kelas_id = $1 AND siswa_id = $2
      RETURNING *`,
      [jadwal_kelas_id, siswa_id]
    )
};
