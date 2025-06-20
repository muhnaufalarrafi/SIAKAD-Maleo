// src/app/lib/curriculum/submateri.ts

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface SubMateri {
  id: string;
  materi_id: string;
  nama: string;
  ketercapaian?: string;
}

export interface SubMateriInput {
  materi_id: string;
  nama: string;
  ketercapaian?: string;
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

// 1) Ambil semua sub-materi
export async function getAllSubMateri(): Promise<SubMateri[]> {
  const res = await fetch(`${API_BASE_URL}/sub-materi`, {
    method: 'GET',
    credentials: 'include',  
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<SubMateri[]>(res);
}

// 2) Ambil sub-materi berdasarkan ID
export async function getSubMateriById(id: string): Promise<SubMateri> {
  const res = await fetch(`${API_BASE_URL}/sub-materi/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<SubMateri>(res);
}

// 3) Buat sub-materi baru
export async function createSubMateri(payload: SubMateriInput): Promise<SubMateri> {
  const res = await fetch(`${API_BASE_URL}/sub-materi`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<SubMateri>(res);
}

// 4) Perbarui sub-materi
export async function updateSubMateri(id: string, payload: SubMateriInput): Promise<SubMateri> {
  const res = await fetch(`${API_BASE_URL}/sub-materi/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<SubMateri>(res);
}

// 5) Hapus sub-materi
export async function deleteSubMateri(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/sub-materi/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ message: string }>(res);
}
