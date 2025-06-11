// src\models\eReferenceModel.js
import { query } from '../config/db.js';

export const EReferenceModel = {
  getAll: () =>
    query(`
      SELECT er.*, p.nama AS program_nama, mp.nama AS mapel_nama, tp.nama_lengkap AS tutor_nama
      FROM e_reference er
      JOIN program p ON p.id = er.program_id
      JOIN mata_pelajaran mp ON mp.id = er.mata_pelajaran_id
      JOIN tutor_profiles tp ON tp.id = er.uploaded_by
      ORDER BY er.created_at DESC
    `),

  getById: (id) =>
    query(`
      SELECT * FROM e_reference WHERE id = $1
    `, [id]),

  create: ({
    judul, deskripsi, program_id, mata_pelajaran_id, tipe, url, uploaded_by
  }) =>
    query(`
      INSERT INTO e_reference (
        judul, deskripsi, program_id, mata_pelajaran_id, tipe, url, uploaded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [judul, deskripsi, program_id, mata_pelajaran_id, tipe, url, uploaded_by]
    ),

  update: (id, data) =>
    query(`
      UPDATE e_reference SET
        judul = $1,
        deskripsi = $2,
        program_id = $3,
        mata_pelajaran_id = $4,
        tipe = $5,
        url = $6,
        uploaded_by = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *`,
      [
        data.judul,
        data.deskripsi,
        data.program_id,
        data.mata_pelajaran_id,
        data.tipe,
        data.url,
        data.uploaded_by,
        id
      ]
    ),

  delete: (id) =>
    query(`DELETE FROM e_reference WHERE id = $1 RETURNING *`, [id])
};
