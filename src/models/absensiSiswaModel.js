// src\models\absensiSiswaModel.js
import { query } from '../config/db.js';

export const AbsensiSiswaModel = {
  getByJadwalAndTanggal: (jadwal_id, tanggal) =>
    query(`
      SELECT asis.*, sp.nama_lengkap AS nama_siswa
      FROM absensi_siswa asis
      JOIN siswa_profiles sp ON sp.id = asis.siswa_id
      WHERE asis.jadwal_id = $1 AND asis.tanggal = $2
    `, [jadwal_id, tanggal]),

  bulkInsert: async (dataArray) => {
    const values = dataArray.map(
      (_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`
    ).join(',');

    const flatValues = dataArray.flatMap(({ jadwal_id, siswa_id, tanggal, status, catatan }) => [
      jadwal_id, siswa_id, tanggal, status, catatan
    ]);

    return query(`
      INSERT INTO absensi_siswa (jadwal_id, siswa_id, tanggal, status, catatan)
      VALUES ${values}
      ON CONFLICT (jadwal_id, siswa_id, tanggal) DO UPDATE
      SET status = EXCLUDED.status,
          catatan = EXCLUDED.catatan
      RETURNING *
    `, flatValues);
  }
};
