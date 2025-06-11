// src/models/subMateriModel.js
import { query } from '../config/db.js';

export const SubMateriModel = {
  getAll: () =>
    query(`
      SELECT sm.*,
             m.nama AS materi_nama,
             m.mata_pelajaran_id
      FROM sub_materi sm
      JOIN materi m ON m.id = sm.materi_id
      ORDER BY sm.id
    `),

  getById: (id) =>
    query(`
      SELECT sm.*,
             m.nama AS materi_nama,
             m.mata_pelajaran_id
      FROM sub_materi sm
      JOIN materi m ON m.id = sm.materi_id
      WHERE sm.id = $1
    `, [id]),

  create: ({ materi_id, nama, ketercapaian }) =>
    query(`
      INSERT INTO sub_materi (
        materi_id, nama, ketercapaian
      ) VALUES ($1, $2, $3)
      RETURNING *
    `, [materi_id, nama, ketercapaian]),

  update: (id, { materi_id, nama, ketercapaian }) =>
    query(`
      UPDATE sub_materi SET
        materi_id = $1,
        nama = $2,
        ketercapaian = $3
      WHERE id = $4
      RETURNING *
    `, [materi_id, nama, ketercapaian, id]),

  delete: (id) =>
    query(`DELETE FROM sub_materi WHERE id = $1 RETURNING *`, [id])
};
