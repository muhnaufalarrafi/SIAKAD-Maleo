// src/app/lib/rbac/programs.ts

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Optional: Tambahkan validasi jika API_BASE_URL tidak didefinisikan di .env
if (typeof API_BASE_URL === 'undefined') {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env.local file.');
}

// ====================================================================
// Definisi Interface untuk Program dan Respons Error
// ====================================================================

// Interface untuk struktur objek Program yang lengkap
export interface Program {
  id: string; // Asumsi program memiliki ID setelah dibuat/diambil
  code: string;
  nama: string;
  jenjang: string;
  created_at: string
}

// Interface untuk struktur respons error dari API
interface ApiErrorResponse {
  error?: string;   // Beberapa API menggunakan 'error'
  message?: string; // Beberapa API menggunakan 'message'
  // Tambahkan properti lain yang mungkin dikirim server saat error
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
    // Menggunakan kedua 'error' atau 'message' untuk pesan error
    throw new Error(errorData.error || errorData.message || 'API request failed');
  }
  return data as T; // Type assertion untuk mengembalikan tipe yang diharapkan
}

// ====================================================================
// Fungsi API (dengan tipe yang diperbaiki)
// ====================================================================

// 1. Ambil semua program
export async function getAllPrograms(): Promise<Program[]> { // Mengganti any[] dengan Program[]
  const res = await fetch(`${API_BASE_URL}/programs`, { // Pastikan endpoint benar (misal: /api/programs)
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Program[]>(res); // array of programs
}

// 2. Ambil program berdasarkan ID
export async function getProgramById(id: string): Promise<Program> { // Mengganti any dengan Program
  const res = await fetch(`${API_BASE_URL}/programs/${id}`, { // Pastikan endpoint benar
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Program>(res); // single program object
}

// 3. Buat program baru
export async function createProgram(data: {
  code: string;
  nama: string;
  jenjang: string;
}): Promise<Program> { // Mengganti any dengan Program
  const res = await fetch(`${API_BASE_URL}/programs`, { // Pastikan endpoint benar
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleApiResponse<Program>(res);
}

// 4. Update program berdasarkan ID
export async function updateProgram(id: string, data: {
  code?: string;
  nama?: string;
  jenjang?: string;
}): Promise<Program> { // Mengganti any dengan Program
  const res = await fetch(`${API_BASE_URL}/programs/${id}`, { // Pastikan endpoint benar
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleApiResponse<Program>(res);
}

// 5. Hapus program berdasarkan ID
export async function deleteProgram(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/programs/${id}`, { // Pastikan endpoint benar
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ message: string }>(res);
}