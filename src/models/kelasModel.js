// src/models/kelasModel.js
import { query } from '../config/db.js';

export const KelasModel = {
  getAll: () =>
    query(`
      SELECT
        id,
        nama,
        tingkat,
        program_id,
        tahun_ajaran
      FROM kelas
      ORDER BY id
    `),

  getById: (id) =>
    query(
      `
      SELECT
        id,
        nama,
        tingkat,
        program_id,
        tahun_ajaran
      FROM kelas
      WHERE id = $1
    `,
      [id]
    ),

  create: ({ nama, tingkat, program_id, tahun_ajaran }) =>
    query(
      `
      INSERT INTO kelas (
        nama,
        tingkat,
        program_id,
        tahun_ajaran
      ) VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [nama, tingkat, program_id, tahun_ajaran]
    ),

  update: (id, { nama, tingkat, program_id, tahun_ajaran }) =>
    query(
      `
      UPDATE kelas SET
        nama         = $1,
        tingkat      = $2,
        program_id   = $3,
        tahun_ajaran = $4
      WHERE id = $5
      RETURNING *
    `,
      [nama, tingkat, program_id, tahun_ajaran, id]
    ),

  delete: (id) =>
    query(`DELETE FROM kelas WHERE id = $1 RETURNING *`, [id])
};
