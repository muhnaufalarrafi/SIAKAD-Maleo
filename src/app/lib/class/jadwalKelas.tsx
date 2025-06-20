// src/app/lib/class/jadwalKelas.ts
// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface JadwalKelas {
  id: string;
  mata_pelajaran_id: string;
  tutor_id: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  tempat?: string;
  keterangan?: string;
  kelas_id?: string;
  nama_mapel?: string;
  nama_kelas?: string; 
}

export interface JadwalKelasInput {
  mata_pelajaran_id: string;
  tutor_id: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  tempat?: string;
  keterangan?: string;
  kelas_id?: string;
}

// Interface untuk struktur respons error yang mungkin dikirim oleh API
// Digunakan untuk type-safety di handleApiResponse dan checkinGuru
interface BackendErrorResponse {
  error?: string;
  jarak_meter?: number; // Backend mengirim ini untuk error tertentu
  // Tambahkan properti lain yang mungkin dikirim server saat error
}

// Utility untuk handle JSON + error
// Mengatasi: "Unexpected any. Specify a different type." pada `(err as any).error`
// Mengatasi: "'parseError' is defined but never used." pada `catch (parseError)`
async function handleApiResponse<T>(res: Response): Promise<T> {
  let data: unknown; // Lebih aman daripada 'any' di awal
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch { // Tanpa parameter untuk `catch` jika tidak digunakan
    data = {}; // Jika parsing gagal, set ke objek kosong
  }

  if (!res.ok) {
    // Asumsikan 'data' adalah BackendErrorResponse untuk mengakses properti 'error'
    const errorData = data as BackendErrorResponse;
    throw new Error(errorData.error || 'API request failed');
  }
  return data as T; // Type assertion untuk mengembalikan tipe yang diharapkan
}

// 1) Fetch semua jadwal
export async function getAllJadwal(): Promise<JadwalKelas[]> {
  const res = await fetch(`${API_BASE_URL}/jadwal-kelas`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<JadwalKelas[]>(res);
}

// 2) Fetch satu jadwal berdasarkan ID
export async function getJadwalById(id: string): Promise<JadwalKelas> {
  const res = await fetch(`${API_BASE_URL}/jadwal-kelas/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<JadwalKelas>(res);
}

// 6) Ambil semua jadwal berdasarkan tutor_id dan kelompokkan berdasarkan hari
export async function getJadwalByTutorId(
  tutor_id: string
): Promise<Record<string, JadwalKelas[]>> {
  const res = await fetch(`${API_BASE_URL}/jadwal-kelas/by-tutor/${tutor_id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Record<string, JadwalKelas[]>>(res);
}


// 3) Buat jadwal baru
export async function createJadwal(
  payload: JadwalKelasInput
): Promise<JadwalKelas> {
  const res = await fetch(`${API_BASE_URL}/jadwal-kelas`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<JadwalKelas>(res);
}

// 4) Update jadwal yang sudah ada
export async function updateJadwal(
  id: string,
  payload: JadwalKelasInput
): Promise<JadwalKelas> {
  const res = await fetch(`${API_BASE_URL}/jadwal-kelas/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<JadwalKelas>(res);
}

// 5) Hapus jadwal
export async function deleteJadwal(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/jadwal-kelas/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ message: string }>(res);
}
