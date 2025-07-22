// src/models/kelasSiswaModel.js
import { query } from '../config/db.js';

export const KelasSiswaModel = {
  getAll: () =>
    query(`
      SELECT
        id,
        kelas_id,
        siswa_id
      FROM kelas_siswa
      ORDER BY id
    `),

  getById: (id) =>
    query(
      `
      SELECT
        id,
        kelas_id,
        siswa_id
      FROM kelas_siswa
      WHERE id = $1
    `,
      [id]
    ),

  assign: ({ kelas_id, siswa_id }) =>
    query(
      `
      INSERT INTO kelas_siswa (
        kelas_id,
        siswa_id
      ) VALUES ($1, $2)
      RETURNING *
    `,
      [kelas_id, siswa_id]
    ),

  update: (id, { kelas_id, siswa_id }) =>
    query(
      `
      UPDATE kelas_siswa SET
        kelas_id = $1,
        siswa_id = $2
      WHERE id = $3
      RETURNING *
    `,
      [kelas_id, siswa_id, id]
    ),

  delete: (id) =>
    query(`DELETE FROM kelas_siswa WHERE id = $1 RETURNING *`, [id])
};
