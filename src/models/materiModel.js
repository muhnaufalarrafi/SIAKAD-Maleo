// src/models/materiModel.js
import { query } from '../config/db.js';

export const MateriModel = {
  getAll: () =>
    query(`
      SELECT m.*,
             mp.nama AS mata_pelajaran_nama,
             mp.code AS mata_pelajaran_code,
             mp.program_id
      FROM materi m
      JOIN mata_pelajaran mp ON mp.id = m.mata_pelajaran_id
      ORDER BY m.id
    `),

  getById: (id) =>
    query(`
      SELECT m.*,
             mp.nama AS mata_pelajaran_nama,
             mp.code AS mata_pelajaran_code,
             mp.program_id
      FROM materi m
      JOIN mata_pelajaran mp ON mp.id = m.mata_pelajaran_id
      WHERE m.id = $1
    `, [id]),

  create: ({ mata_pelajaran_id, nama, deskripsi }) =>
    query(`
      INSERT INTO materi (
        mata_pelajaran_id, nama, deskripsi
      ) VALUES ($1, $2, $3)
      RETURNING *
    `, [mata_pelajaran_id, nama, deskripsi]),

  update: (id, { mata_pelajaran_id, nama, deskripsi }) =>
    query(`
      UPDATE materi SET
        mata_pelajaran_id = $1,
        nama = $2,
        deskripsi = $3
      WHERE id = $4
      RETURNING *
    `, [mata_pelajaran_id, nama, deskripsi, id]),

  delete: (id) =>
    query(`DELETE FROM materi WHERE id = $1 RETURNING *`, [id])
};
