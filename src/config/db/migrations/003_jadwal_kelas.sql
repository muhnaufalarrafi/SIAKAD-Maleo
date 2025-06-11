-- Jadwal Kelas (satu mapel + tutor dalam waktu tertentu)
CREATE TABLE IF NOT EXISTS jadwal_kelas (
  id BIGSERIAL PRIMARY KEY,
  mata_pelajaran_id BIGINT NOT NULL REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
  tutor_id INT NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  hari VARCHAR(10) NOT NULL CHECK (hari IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')),
  jam_mulai TIME NOT NULL,
  jam_selesai TIME NOT NULL,
  tempat TEXT,
  keterangan TEXT
);

-- Relasi siswa yang mengikuti jadwal tersebut
CREATE TABLE IF NOT EXISTS kelas_siswa (
  id BIGSERIAL PRIMARY KEY,
  jadwal_kelas_id BIGINT NOT NULL REFERENCES jadwal_kelas(id) ON DELETE CASCADE,
  siswa_id INT NOT NULL REFERENCES siswa_profiles(id) ON DELETE CASCADE,
  UNIQUE (jadwal_kelas_id, siswa_id)
);
