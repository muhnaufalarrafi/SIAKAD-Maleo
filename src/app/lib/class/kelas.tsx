// src/app/lib/class/kelas.ts
// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Kelas {
  id: string;
  nama: string;
  tingkat: number;
  program_id: string;
  tahun_ajaran: string;
}

export interface KelasInput {
  nama: string;
  tingkat: number;
  program_id: string;
  tahun_ajaran: string;
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

// 1) Ambil semua kelas
export async function getAllKelas(): Promise<Kelas[]> {
  const res = await fetch(`${API_BASE_URL}/kelas`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Kelas[]>(res);
}

// 2) Ambil kelas per ID
export async function getKelasById(id: string): Promise<Kelas> {
  const res = await fetch(`${API_BASE_URL}/kelas/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Kelas>(res);
}

// 3) Buat kelas baru
export async function createKelas(payload: KelasInput): Promise<Kelas> {
  const res = await fetch(`${API_BASE_URL}/kelas`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<Kelas>(res);
}

// 4) Update kelas
export async function updateKelas(id: string, payload: KelasInput): Promise<Kelas> {
  const res = await fetch(`${API_BASE_URL}/kelas/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<Kelas>(res);
}

// 5) Hapus kelas
export async function deleteKelas(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/kelas/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ message: string }>(res);
}
