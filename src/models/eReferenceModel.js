// src/models/eReferenceModel.js
import { query } from '../config/db.js';

export const EReferenceModel = {
getAll: () =>
  query(`
    SELECT
      er.id,
      er.judul,
      er.deskripsi,
      er.program_id,
      p.nama         AS program_nama,
      er.mata_pelajaran_id,
      mp.nama        AS mapel_nama,
      er.tipe,
      er.url,
      er.uploaded_by,
      tp.user_id     AS uploaded_by_user_id, -- ini tambahan penting
      COALESCE(tp.nama_lengkap, 'Admin') AS tutor_nama,
      er.created_at,
      er.updated_at
    FROM e_reference er
    JOIN program p              ON p.id = er.program_id
    JOIN mata_pelajaran mp      ON mp.id = er.mata_pelajaran_id
    LEFT JOIN tutor_profiles tp ON tp.id = er.uploaded_by
    ORDER BY er.created_at DESC
  `),

getById: (id) =>
  query(`
    SELECT
      er.id,
      er.judul,
      er.deskripsi,
      er.program_id,
      p.nama         AS program_nama,
      er.mata_pelajaran_id,
      mp.nama        AS mapel_nama,
      er.tipe,
      er.url,
      er.uploaded_by,
      tp.user_id     AS uploaded_by_user_id, -- tambahkan ini juga
      COALESCE(tp.nama_lengkap, 'Admin') AS tutor_nama,
      er.created_at,
      er.updated_at
    FROM e_reference er
    JOIN program p              ON p.id = er.program_id
    JOIN mata_pelajaran mp      ON mp.id = er.mata_pelajaran_id
    LEFT JOIN tutor_profiles tp ON tp.id = er.uploaded_by
    WHERE er.id = $1
  `, [id]),

  create: ({
    judul,
    deskripsi = null,
    program_id,
    mata_pelajaran_id,
    tipe,
    url,
    uploaded_by
  }) =>
    query(`
      INSERT INTO e_reference (
        judul,
        deskripsi,
        program_id,
        mata_pelajaran_id,
        tipe,
        url,
        uploaded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        judul,
        deskripsi,
        program_id,
        mata_pelajaran_id,
        tipe,
        url,
        uploaded_by,
        created_at,
        updated_at
    `, [
      judul,
      deskripsi,
      program_id,
      mata_pelajaran_id,
      tipe,
      url,
      uploaded_by
    ]),

  update: (id, {
    judul,
    deskripsi = null,
    program_id,
    mata_pelajaran_id,
    tipe,
    url,
    uploaded_by
  }) =>
    query(`
      UPDATE e_reference
      SET
        judul             = $1,
        deskripsi         = $2,
        program_id        = $3,
        mata_pelajaran_id = $4,
        tipe              = $5,
        url               = $6,
        uploaded_by       = $7,
        updated_at        = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING
        id,
        judul,
        deskripsi,
        program_id,
        mata_pelajaran_id,
        tipe,
        url,
        uploaded_by,
        created_at,
        updated_at
    `, [
      judul,
      deskripsi,
      program_id,
      mata_pelajaran_id,
      tipe,
      url,
      uploaded_by,
      id
    ]),

  delete: (id) =>
    query(`
      DELETE FROM e_reference
      WHERE id = $1
      RETURNING
        id,
        judul,
        deskripsi,
        program_id,
        mata_pelajaran_id,
        tipe,
        url,
        uploaded_by,
        created_at,
        updated_at
    `, [id])
};
