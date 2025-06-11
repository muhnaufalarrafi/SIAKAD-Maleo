-- 🧑‍🏫 ABSENSI GURU
CREATE TABLE IF NOT EXISTS absensi_guru (
  id SERIAL PRIMARY KEY,
  jadwal_id BIGINT NOT NULL REFERENCES jadwal_kelas(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  checkin_time TIMESTAMPTZ,
  checkout_time TIMESTAMPTZ,
  checkin_lat DECIMAL(9,6),
  checkin_lng DECIMAL(9,6),
  checkout_lat DECIMAL(9,6),
  checkout_lng DECIMAL(9,6),
  jarak_meter INTEGER,
  status VARCHAR(10) CHECK (status IN ('hadir', 'izin', 'sakit', 'alfa')) DEFAULT 'hadir',
  catatan TEXT
);

-- Optional: Unik jika hanya boleh 1 absensi per jadwal + tanggal
CREATE UNIQUE INDEX IF NOT EXISTS idx_absensi_guru_unique
ON absensi_guru (jadwal_id, tanggal);

-- 🧑‍🎓 ABSENSI SISWA
CREATE TABLE IF NOT EXISTS absensi_siswa (
  id SERIAL PRIMARY KEY,
  jadwal_id BIGINT NOT NULL REFERENCES jadwal_kelas(id) ON DELETE CASCADE,
  siswa_id INT NOT NULL REFERENCES siswa_profiles(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  status VARCHAR(10) CHECK (status IN ('hadir', 'izin', 'sakit', 'alfa')) DEFAULT 'hadir',
  catatan TEXT
);

-- Optional: Unik per siswa di satu jadwal pada tanggal yang sama
CREATE UNIQUE INDEX IF NOT EXISTS idx_absensi_siswa_unique
ON absensi_siswa (jadwal_id, siswa_id, tanggal);
