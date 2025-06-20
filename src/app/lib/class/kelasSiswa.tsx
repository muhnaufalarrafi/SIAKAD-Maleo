// src/app/lib/class/kelasSiswa.ts

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface KelasSiswa {
  id: string;
  kelas_id: string;
  siswa_id: string;
}

export interface KelasSiswaInput {
  kelas_id: string;
  siswa_id: string;
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

export async function getAllKelasSiswa(): Promise<KelasSiswa[]> {
  const res = await fetch(`${API_BASE_URL}/kelas-siswa`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<KelasSiswa[]>(res);
}

export async function getKelasSiswaById(id: string): Promise<KelasSiswa> {
  const res = await fetch(`${API_BASE_URL}/kelas-siswa/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<KelasSiswa>(res);
}

export async function createKelasSiswa(payload: KelasSiswaInput): Promise<KelasSiswa> {
  const res = await fetch(`${API_BASE_URL}/kelas-siswa`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<KelasSiswa>(res);
}

export async function updateKelasSiswa(id: string, payload: KelasSiswaInput): Promise<KelasSiswa> {
  const res = await fetch(`${API_BASE_URL}/kelas-siswa/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<KelasSiswa>(res);
}

export async function deleteKelasSiswa(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/kelas-siswa/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ message: string }>(res);
}
