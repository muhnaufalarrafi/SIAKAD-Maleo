-- dummy_data.sql
BEGIN;

-- 1) Insert satu user (tutor)
INSERT INTO users (username, email, password, status_aktif)
VALUES
  ('tutor1', 'tutor1@example.com', 'password123', true);

-- 2) Insert tutor_profiles, FK ke users.id (ambil user paling awal)
INSERT INTO tutor_profiles (
  user_id, nama_lengkap, jenis_kelamin, no_hp, email_pribadi,
  alamat, nomor_identitas, bidang_keahlian
)
VALUES (
  (SELECT id FROM users ORDER BY id LIMIT 1),
  'Dewi Utami', 'P', '08123456789',
  'dewi.utami@example.com', 'Jl. Contoh No.1',
  '321098765432', 'Matematika'
);

-- 3) Insert satu program
INSERT INTO program (code, nama, jenjang)
VALUES ('B001', 'Paket B - SMP', 'SMP');

-- 4) Insert satu mata_pelajaran FK ke program.id
INSERT INTO mata_pelajaran (program_id, code, nama, tingkat_min, tingkat_max)
VALUES (
  (SELECT id FROM program ORDER BY id LIMIT 1),
  'MTK1', 'Matematika SMP', 7, 9
);

-- 5) Insert satu jadwal_kelas FK ke mata_pelajaran.id & tutor_profiles.id
INSERT INTO jadwal_kelas (
  mata_pelajaran_id, tutor_id, hari, jam_mulai, jam_selesai,
  tempat, keterangan
)
VALUES (
  (SELECT id FROM mata_pelajaran ORDER BY id LIMIT 1),
  (SELECT id FROM tutor_profiles ORDER BY id LIMIT 1),
  'Senin', '07:00:00', '08:00:00',
  'Ruang 101', 'Jadwal dummy untuk testing'
);

COMMIT;
