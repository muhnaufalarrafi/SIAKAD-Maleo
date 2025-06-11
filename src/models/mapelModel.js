// src\models\mapelModel.js
import { query } from '../config/db.js';

export const MapelModel = {
  getAll: () =>
    query(`
      SELECT m.*, p.nama AS program_nama, p.jenjang
      FROM mata_pelajaran m
      JOIN program p ON p.id = m.program_id
      ORDER BY m.id
    `),

  getById: (id) =>
    query(`
      SELECT m.*, p.nama AS program_nama
      FROM mata_pelajaran m
      JOIN program p ON p.id = m.program_id
      WHERE m.id = $1
    `, [id]),

  create: ({ program_id, code, nama, tingkat_min, tingkat_max }) =>
    query(`
      INSERT INTO mata_pelajaran (
        program_id, code, nama, tingkat_min, tingkat_max
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [program_id, code, nama, tingkat_min, tingkat_max]
    ),

  update: (id, { program_id, code, nama, tingkat_min, tingkat_max }) =>
    query(`
      UPDATE mata_pelajaran SET
        program_id = $1,
        code = $2,
        nama = $3,
        tingkat_min = $4,
        tingkat_max = $5
      WHERE id = $6 RETURNING *`,
      [program_id, code, nama, tingkat_min, tingkat_max, id]
    ),

  delete: (id) =>
    query(`DELETE FROM mata_pelajaran WHERE id = $1 RETURNING *`, [id])
};
