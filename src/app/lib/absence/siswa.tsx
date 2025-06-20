// src/app/lib/absence/siswa.tsx
const API_BASE_URL = 'http://localhost:3000/api';

export type AbsensiStatus = 'hadir' | 'izin' | 'sakit' | 'alfa';
export type JenisTugas = 'Mandiri' | 'Kelompok' | 'Gabungan';

export interface AbsensiSiswa {
  id: string;
  jadwal_id: string;
  siswa_id: string;
  tanggal: string;                 // YYYY-MM-DD
  status: AbsensiStatus;
  catatan?: string;
  tutor_id?: string;
  kelas_id?: string;
  sub_materi_id?: string;
  jenis_tugas?: JenisTugas;
  isi_tugas?: string;
  tanggal_pengumpulan?: string;    // YYYY-MM-DD
  ketercapaian?: string;
  // joins
  nama_siswa?: string;
  jam_mulai?: string;
  jam_selesai?: string;
}

export interface AbsensiSiswaInput {
  jadwal_id: string;
  siswa_id: string;
  tanggal: string;
  status: AbsensiStatus;
  catatan?: string;
  tutor_id?: string;
  kelas_id?: string;
  sub_materi_id?: string;
  jenis_tugas?: JenisTugas;
  isi_tugas?: string;
  tanggal_pengumpulan?: string;
  ketercapaian?: string;
}

// Tambahkan interface untuk respons error API jika server Anda mengirimkannya
interface ApiErrorResponse {
  error?: string; // Asumsi error message ada di properti 'error'
}

async function handleApiResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: T | ApiErrorResponse;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (parseError) { // <--- Biarkan 'parseError' di sini
    console.error("Failed to parse API response as JSON:", parseError); // <--- Gunakan variabelnya
    data = {};
  }

  if (!res.ok) {
    const errorResponse = data as ApiErrorResponse;
    throw new Error(errorResponse.error || 'API request failed');
  }
  
  return data as T;
}

/**
 * Ambil semua absensi siswa
 */
export async function getAllAbsensiSiswa(): Promise<AbsensiSiswa[]> {
  const res = await fetch(`${API_BASE_URL}/absensi-siswa`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  return handleApiResponse<AbsensiSiswa[]>(res);
}

/**
 * Ambil satu record berdasarkan ID
 */
export async function getAbsensiSiswaById(id: string): Promise<AbsensiSiswa> {
  const res = await fetch(`${API_BASE_URL}/absensi-siswa/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  return handleApiResponse<AbsensiSiswa>(res);
}

/**
 * Ambil list absensi untuk satu jadwal dan tanggal
 */
export async function getAbsensiSiswaByJadwalTanggal(
  jadwal_id: string,
  tanggal: string
): Promise<AbsensiSiswa[]> {
  const params = new URLSearchParams({ jadwal_id, tanggal });
  const res = await fetch(`${API_BASE_URL}/absensi-siswa?${params}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  return handleApiResponse<AbsensiSiswa[]>(res);
}

/**
 * Buat satu record absensi siswa
 */
export async function createAbsensiSiswa(
  payload: AbsensiSiswaInput
): Promise<AbsensiSiswa> {
  const res = await fetch(`${API_BASE_URL}/absensi-siswa`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleApiResponse<AbsensiSiswa>(res);
}

/**
 * Update satu record absensi siswa
 */
export async function updateAbsensiSiswa(
  id: string,
  payload: Partial<AbsensiSiswaInput>
): Promise<AbsensiSiswa> {
  const res = await fetch(`${API_BASE_URL}/absensi-siswa/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleApiResponse<AbsensiSiswa>(res);
}

/**
 * Bulk insert/update absensi siswa
 */
export async function bulkUpsertAbsensiSiswa(
  dataArray: AbsensiSiswaInput[]
): Promise<AbsensiSiswa[]> {
  const res = await fetch(`${API_BASE_URL}/absensi-siswa/bulk`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataArray)
  });
  return handleApiResponse<AbsensiSiswa[]>(res);
}

/**
 * Hapus record absensi siswa
 */
export async function deleteAbsensiSiswa(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/absensi-siswa/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  return handleApiResponse<{ message: string }>(res);
}
