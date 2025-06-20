// src/app/lib/curriculum/materi.ts

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Materi {
  id: string;
  mata_pelajaran_id: string;
  nama: string;
  deskripsi?: string;
}

export interface MateriInput {
  mata_pelajaran_id: string;
  nama: string;
  deskripsi?: string;
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

// 1) Ambil semua materi
export async function getAllMateri(): Promise<Materi[]> {
  const res = await fetch(`${API_BASE_URL}/materi`, {
    method: 'GET',
    credentials: 'include',              // kirim cookie JWT otomatis
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Materi[]>(res);
}

// 2) Ambil satu materi berdasarkan ID
export async function getMateriById(id: string): Promise<Materi> {
  const res = await fetch(`${API_BASE_URL}/materi/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Materi>(res);
}

// 3) Buat materi baru
export async function createMateri(payload: MateriInput): Promise<Materi> {
  const res = await fetch(`${API_BASE_URL}/materi`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<Materi>(res);
}

// 4) Perbarui materi
export async function updateMateri(id: string, payload: MateriInput): Promise<Materi> {
  const res = await fetch(`${API_BASE_URL}/materi/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<Materi>(res);
}

// 5) Hapus materi
export async function deleteMateri(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/materi/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ message: string }>(res);
}
