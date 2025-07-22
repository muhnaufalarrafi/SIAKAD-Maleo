// src/models/absensiSiswaModel.js
import { query } from '../config/db.js';

export const AbsensiSiswaModel = {
  // 1) Ambil semua (tidak ada perubahan)
  getAll: () =>
    query(`
      SELECT asis.*,
             sp.nama_lengkap   AS nama_siswa,
             tk.hari           AS hari,
             tk.jam_mulai      AS jam_mulai,
             tk.jam_selesai    AS jam_selesai
      FROM absensi_siswa AS asis
      LEFT JOIN siswa_profiles AS sp ON sp.id = asis.siswa_id
      LEFT JOIN jadwal_kelas   AS tk ON tk.id = asis.jadwal_id
      ORDER BY asis.tanggal DESC, asis.id
    `),

  // 2) Ambil berdasarkan PK id (tidak ada perubahan)
  getById: (id) =>
    query(
      `
      SELECT *
      FROM absensi_siswa
      WHERE id = $1
    `,
      [id]
    ),

  // 3) Ambil berdasarkan jadwal & tanggal (tidak ada perubahan)
  getByJadwalAndTanggal: (jadwal_id, tanggal) =>
    query(
      `
      SELECT asis.*,
             sp.nama_lengkap AS nama_siswa
      FROM absensi_siswa AS asis
      JOIN siswa_profiles     AS sp ON sp.id = asis.siswa_id
      WHERE asis.jadwal_id = $1
        AND asis.tanggal   = $2
    `,
      [jadwal_id, tanggal]
    ),

  // 4) Buat satu record (disesuaikan)
  create: ({
    jadwal_id,
    siswa_id,
    tanggal,
    status,
    catatan = null,
    tutor_id = null,
    kelas_id = null,
    sub_materi = null, // DIUBAH
    jenis_tugas = null,
    isi_tugas = null,
    tanggal_pengumpulan = null,
    ketercapaian = null
  }) =>
    query(
      `
      INSERT INTO absensi_siswa (
        jadwal_id,
        siswa_id,
        tanggal,
        status,
        catatan,
        tutor_id,
        kelas_id,
        sub_materi, -- DIUBAH
        jenis_tugas,
        isi_tugas,
        tanggal_pengumpulan,
        ketercapaian
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `,
      [
        jadwal_id,
        siswa_id,
        tanggal,
        status,
        catatan,
        tutor_id,
        kelas_id,
        sub_materi, // DIUBAH
        jenis_tugas,
        isi_tugas,
        tanggal_pengumpulan,
        ketercapaian
      ]
    ),

  // 5) Update satu record (disesuaikan)
  update: (
    id,
    {
      status,
      catatan,
      tutor_id,
      kelas_id,
      sub_materi, // DIUBAH
      jenis_tugas,
      isi_tugas,
      tanggal_pengumpulan,
      ketercapaian
    }
  ) =>
    query(
      `
      UPDATE absensi_siswa SET
        status              = $1,
        catatan             = $2,
        tutor_id            = $3,
        kelas_id            = $4,
        sub_materi          = $5, -- DIUBAH
        jenis_tugas         = $6,
        isi_tugas           = $7,
        tanggal_pengumpulan = $8,
        ketercapaian        = $9
      WHERE id = $10
      RETURNING *
    `,
      [
        status,
        catatan,
        tutor_id,
        kelas_id,
        sub_materi, // DIUBAH
        jenis_tugas,
        isi_tugas,
        tanggal_pengumpulan,
        ketercapaian,
        id
      ]
    ),

  // 6) Bulk upsert (disesuaikan)
  bulkUpsert: async (dataArray) => {
    const cols = [
      'jadwal_id',
      'siswa_id',
      'tanggal',
      'status',
      'catatan',
      'tutor_id',
      'kelas_id',
      'sub_materi', // DIUBAH
      'jenis_tugas',
      'isi_tugas',
      'tanggal_pengumpulan',
      'ketercapaian'
    ];

    const placeholders = dataArray
      .map((_, i) => `(${cols.map((__, j) => `$${i * cols.length + j + 1}`).join(',')})`)
      .join(',');

    const flat = dataArray.flatMap(d => [
      d.jadwal_id,
      d.siswa_id,
      d.tanggal,
      d.status,
      d.catatan || null,
      d.tutor_id || null,
      d.kelas_id || null,
      d.sub_materi || null, // DIUBAH
      d.jenis_tugas || null,
      d.isi_tugas || null,
      d.tanggal_pengumpulan || null,
      d.ketercapaian || null
    ]);

    return query(
      `
      INSERT INTO absensi_siswa (${cols.join(',')})
      VALUES ${placeholders}
      ON CONFLICT (jadwal_id, siswa_id, tanggal) DO UPDATE
        SET status              = EXCLUDED.status,
            catatan             = EXCLUDED.catatan,
            tutor_id            = EXCLUDED.tutor_id,
            kelas_id            = EXCLUDED.kelas_id,
            sub_materi          = EXCLUDED.sub_materi, -- DIUBAH
            jenis_tugas         = EXCLUDED.jenis_tugas,
            isi_tugas           = EXCLUDED.isi_tugas,
            tanggal_pengumpulan = EXCLUDED.tanggal_pengumpulan,
            ketercapaian        = EXCLUDED.ketercapaian
      RETURNING *
    `,
      flat
    );
  },

  // 7) Hapus (tidak ada perubahan)
  delete: (id) =>
    query(
      `
      DELETE FROM absensi_siswa
      WHERE id = $1
      RETURNING *
    `,
      [id]
    ),
  // 8) Ambil rekam jejak materi yang diajarkan oleh tutor (disesuaikan dengan skema)
  getByTutorId: (tutorId) =>
    query(
      `
      SELECT
        -- Informasi yang bisa diambil dari JOIN
        mp.nama AS mata_pelajaran,
        asis.tanggal,
        jk.jam_mulai,
        jk.jam_selesai,
        
        -- Informasi ini diambil langsung dari kolom 'absensi_siswa'
        -- karena tidak ada foreign key ke tabel materi/modul.
        asis.sub_materi, -- Ini akan berfungsi sebagai 'nama materi/sub materi'
        asis.jenis_tugas,
        
        -- Menghitung jumlah siswa yang hadir pada sesi tersebut
        COUNT(CASE WHEN asis.status = 'hadir' THEN 1 END) AS total_hadir
      FROM
        absensi_siswa AS asis
      LEFT JOIN
        jadwal_kelas AS jk ON asis.jadwal_id = jk.id
      LEFT JOIN
        mata_pelajaran AS mp ON jk.mata_pelajaran_id = mp.id
      WHERE
        asis.tutor_id = $1
      GROUP BY
        mp.nama,
        asis.tanggal,
        jk.jam_mulai,
        jk.jam_selesai,
        asis.sub_materi,
        asis.jenis_tugas
      ORDER BY
        asis.tanggal DESC, jk.jam_mulai ASC
    `,
      [tutorId]
    ),
};