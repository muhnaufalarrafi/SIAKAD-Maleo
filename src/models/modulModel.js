// src/models/modulModel.js
import { query } from '../config/db.js';

export const ModulModel = {
  getAll: () =>
    query(`
      SELECT
        m.*,
        mp.nama   AS mapel_nama,
        er.judul  AS reference_judul,
        er.url    AS reference_url
      FROM modul m
      JOIN mata_pelajaran mp
        ON mp.id = m.mata_pelajaran_id
      LEFT JOIN e_reference er
        ON er.id = m.e_reference_id
      ORDER BY m.id
    `),

  getById: (id) =>
    query(`
      SELECT
        m.*,
        mp.nama   AS mapel_nama,
        er.judul  AS reference_judul,
        er.url    AS reference_url
      FROM modul m
      JOIN mata_pelajaran mp
        ON mp.id = m.mata_pelajaran_id
      LEFT JOIN e_reference er
        ON er.id = m.e_reference_id
      WHERE m.id = $1
    `, [id]),

  create: ({ mata_pelajaran_id, nama, deskripsi, e_reference_id }) =>
    query(`
      INSERT INTO modul (
        mata_pelajaran_id,
        nama,
        deskripsi,
        e_reference_id
      ) VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [mata_pelajaran_id, nama, deskripsi, e_reference_id]),

  update: (id, { mata_pelajaran_id, nama, deskripsi, e_reference_id }) =>
    query(`
      UPDATE modul SET
        mata_pelajaran_id = $1,
        nama               = $2,
        deskripsi          = $3,
        e_reference_id     = $4
      WHERE id = $5
      RETURNING *
    `, [mata_pelajaran_id, nama, deskripsi, e_reference_id, id]),

  delete: (id) =>
    query(`DELETE FROM modul WHERE id = $1 RETURNING *`, [id])
};
