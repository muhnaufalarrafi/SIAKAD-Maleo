// src\models\programModel.js
import { query } from '../config/db.js';

export const ProgramModel = {
  getAll: () => query(`SELECT * FROM program ORDER BY id`),

  getById: (id) => query(`SELECT * FROM program WHERE id = $1`, [id]),

  create: ({ code, nama, jenjang }) =>
    query(
      `INSERT INTO program (code, nama, jenjang)
       VALUES ($1, $2, $3) RETURNING *`,
      [code, nama, jenjang]
    ),

  update: (id, { code, nama, jenjang }) =>
    query(
      `UPDATE program
       SET code = $1, nama = $2, jenjang = $3
       WHERE id = $4
       RETURNING *`,
      [code, nama, jenjang, id]
    ),

  delete: (id) =>
    query(`DELETE FROM program WHERE id = $1 RETURNING *`, [id])
};
