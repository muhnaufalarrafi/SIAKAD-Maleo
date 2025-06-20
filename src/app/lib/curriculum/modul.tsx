// src/app/lib/curriculum/modul.ts

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Modul {
  id: string;
  mata_pelajaran_id: string;
  nama: string;
  deskripsi?: string;
  e_reference_id?: string;
  mapel_nama: string;
  reference_judul?: string;
  reference_url?: string;
}

export interface ModulInput {
  mata_pelajaran_id: string;
  nama: string;
  deskripsi?: string;
  e_reference_id?: string;
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

// 1) Ambil semua modul
export async function getAllModul(): Promise<Modul[]> {
  const res = await fetch(`${API_BASE_URL}/modul`, {
    method: 'GET',
    credentials: 'include',                // kirim cookie JWT otomatis
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Modul[]>(res);
}

// 2) Ambil modul berdasarkan ID
export async function getModulById(id: string): Promise<Modul> {
  const res = await fetch(`${API_BASE_URL}/modul/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Modul>(res);
}

// 3) Buat modul baru
export async function createModul(payload: ModulInput): Promise<Modul> {
  const res = await fetch(`${API_BASE_URL}/modul`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<Modul>(res);
}

// 4) Update modul
export async function updateModul(id: string, payload: ModulInput): Promise<Modul> {
  const res = await fetch(`${API_BASE_URL}/modul/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<Modul>(res);
}

// 5) Hapus modul
export async function deleteModul(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/modul/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ message: string }>(res);
}
