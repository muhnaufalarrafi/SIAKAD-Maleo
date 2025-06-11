// src\models\absensiGuruModel.js
import { query } from '../config/db.js';

export const AbsensiGuruModel = {
  getAll: () =>
    query(`
      SELECT ag.*, tp.nama_lengkap AS nama_tutor
      FROM absensi_guru ag
      JOIN tutor_profiles tp ON tp.id = ag.tutor_id
      ORDER BY ag.tanggal DESC
    `),

  getById: (id) =>
    query(`
      SELECT * FROM absensi_guru WHERE id = $1
    `, [id]),

  getByTutorAndTanggal: (tutor_id, tanggal) =>
    query(`
      SELECT * FROM absensi_guru
      WHERE tutor_id = $1 AND tanggal = $2
    `, [tutor_id, tanggal]),

  create: (data) =>
    query(`
      INSERT INTO absensi_guru (
        tutor_id, tanggal, checkin_time, checkin_lat, checkin_lng,
        status, catatan, jarak_meter
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        data.tutor_id,
        data.tanggal,
        data.checkin_time,
        data.checkin_lat,
        data.checkin_lng,
        data.status,
        data.catatan,
        data.jarak_meter
      ]
    ),

  updateCheckout: (id, { checkout_time, checkout_lat, checkout_lng }) =>
    query(`
      UPDATE absensi_guru
      SET checkout_time = $1, checkout_lat = $2, checkout_lng = $3
      WHERE id = $4
      RETURNING *`,
      [checkout_time, checkout_lat, checkout_lng, id]
    )
};
