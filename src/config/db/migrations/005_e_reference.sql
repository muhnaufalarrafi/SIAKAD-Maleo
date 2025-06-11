CREATE TABLE IF NOT EXISTS e_reference (
  id SERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  program_id BIGINT NOT NULL REFERENCES program(id) ON DELETE CASCADE,
  mata_pelajaran_id BIGINT NOT NULL REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
  tipe VARCHAR(10) NOT NULL CHECK (tipe IN ('file', 'video', 'link')),
  url TEXT NOT NULL,
  uploaded_by INT NOT NULL REFERENCES tutor_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
