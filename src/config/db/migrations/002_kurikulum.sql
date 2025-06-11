-- ✅ Program Pendidikan (SD, SMP, SMA, Umum)
CREATE TABLE IF NOT EXISTS program (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  jenjang VARCHAR(10) NOT NULL CHECK (jenjang IN ('SD', 'SMP', 'SMA', 'Umum')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Mata Pelajaran
CREATE TABLE IF NOT EXISTS mata_pelajaran (
  id BIGSERIAL PRIMARY KEY,
  program_id BIGINT NOT NULL REFERENCES program(id) ON DELETE CASCADE,
  code VARCHAR(10) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  tingkat_min SMALLINT NOT NULL,
  tingkat_max SMALLINT NOT NULL,
  UNIQUE (program_id, code),
  CHECK (tingkat_min <= tingkat_max)
);

-- ✅ Modul (Topik besar pembelajaran)
CREATE TABLE IF NOT EXISTS modul (
  id BIGSERIAL PRIMARY KEY,
  mata_pelajaran_id BIGINT NOT NULL REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  file_url TEXT
);
