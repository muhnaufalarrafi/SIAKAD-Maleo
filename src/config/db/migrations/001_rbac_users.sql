-- 🔐 USERS
CREATE TABLE IF NOT EXISTS users (
  id CHAR(6) PRIMARY KEY, 
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  status_aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 🔐 ROLES
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT
);

-- 🔐 PERMISSIONS
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

-- 🔐 USER_ROLES
CREATE TABLE IF NOT EXISTS user_roles (
  user_id CHAR(6) REFERENCES users(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- 🔐 ROLE_PERMISSIONS
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 🔐 USER_PERMISSIONS
CREATE TABLE IF NOT EXISTS user_permissions (
  user_id CHAR(6) REFERENCES users(id) ON DELETE CASCADE,
  permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
  override_type VARCHAR(10) CHECK (override_type IN ('allow', 'deny')),
  PRIMARY KEY (user_id, permission_id)
);

-- 👥 TUTOR_PROFILES
CREATE TABLE IF NOT EXISTS tutor_profiles (
  id SERIAL PRIMARY KEY,
  user_id CHAR(6) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  nama_lengkap VARCHAR(100) NOT NULL,
  jenis_kelamin CHAR(1) CHECK (jenis_kelamin IN ('L', 'P')),
  no_hp VARCHAR(20),
  email_pribadi VARCHAR(100),
  alamat TEXT,
  jenis_tutor VARCHAR(20) CHECK (jenis_tutor IN ('guru', 'relawan')),
  nomor_identitas VARCHAR(50),
  bidang_keahlian TEXT
);

-- 👥 SISWA_PROFILES
CREATE TABLE IF NOT EXISTS siswa_profiles (
  id SERIAL PRIMARY KEY,
  user_id CHAR(6) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  nis VARCHAR(30) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  jenis_kelamin CHAR(1) CHECK (jenis_kelamin IN ('L', 'P')),
  tanggal_lahir DATE,
  kelas VARCHAR(20),
  status_aktif BOOLEAN DEFAULT TRUE
);
