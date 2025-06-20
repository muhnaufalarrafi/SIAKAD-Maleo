// src/app/lib/users/siswa.ts

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Siswa {
  id: string;
  user_id: string;      // tetap bagian dari response
  nis: string;
  nama_lengkap: string;
  jenis_kelamin?: string;
  tanggal_lahir?: string;
  kelas?: string;
  status_aktif: boolean;
}

// Payload untuk create/update **tanpa** user_id
export interface SiswaInput {
  nis: string;
  nama_lengkap: string;
  jenis_kelamin?: string;
  tanggal_lahir?: string;
  kelas?: string;
  status_aktif?: boolean;
}

// Interface untuk respons error dari API
interface ApiErrorResponse {
  error?: string;
  message?: string; // Beberapa API menggunakan 'message' untuk pesan error
}

// ====================================================================
// Utility untuk handle JSON + error (mengatasi masalah `any`)
// ====================================================================
async function handleApiResponse<T>(res: Response): Promise<T> {
  let data: unknown; // Lebih aman daripada 'any' di awal
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch { // Tanpa parameter untuk `catch` jika tidak digunakan
    data = {}; // Jika parsing gagal, set ke objek kosong
  }

  if (!res.ok) {
    // Asumsikan 'data' adalah ApiErrorResponse untuk mengakses properti error
    const errorData = data as ApiErrorResponse;
    // Menggunakan 'message' atau 'error' untuk pesan error
    throw new Error(errorData.message || errorData.error || 'API request failed');
  }
  return data as T; // Type assertion untuk mengembalikan tipe yang diharapkan
}

export async function getAllSiswa(): Promise<Siswa[]> {
  const res = await fetch(`${API_BASE_URL}/siswa`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Siswa[]>(res);
}

export async function getSiswaById(id: string): Promise<Siswa> {
  const res = await fetch(`${API_BASE_URL}/siswa/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Siswa>(res);
}

// CREATE: hanya kirim field yang diperlukan
export async function createSiswa(payload: SiswaInput): Promise<Siswa> {
  const res = await fetch(`${API_BASE_URL}/siswa`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<Siswa>(res);
}

// UPDATE: payload tanpa user_id
export async function updateSiswa(id: string, payload: SiswaInput): Promise<Siswa> {
  const res = await fetch(`${API_BASE_URL}/siswa/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<Siswa>(res);
}

export async function deleteSiswa(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/siswa/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ message: string }>(res);
}
