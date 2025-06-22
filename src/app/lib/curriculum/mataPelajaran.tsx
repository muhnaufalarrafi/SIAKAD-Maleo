// src/app/lib/curriculum/mataPelajaran.ts

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiErrorResponse {
  error?: string;
  // Anda bisa menambahkan properti lain di sini jika API Anda mengembalikannya (misal: 'message', 'code')
}

// Helper untuk menangani response API secara umum
async function handleApiResponse<T>(res: Response): Promise<T> {
  let data: unknown; // Gunakan 'unknown' untuk data yang belum pasti tipenya
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch { // Tanpa parameter `catch` jika objek error tidak digunakan
    data = {}; // Jika parsing gagal, set ke objek kosong
  }

  if (!res.ok) {
    // --- PERUBAHAN DI SINI ---
    const errorData = data as ApiErrorResponse; // Type assertion ke interface yang spesifik
    throw new Error(errorData.error || 'API request failed');
    // --- AKHIR PERUBAHAN ---
  }
  return data as T; // Type assertion untuk mengembalikan tipe yang diharapkan
}

export interface Mapel {
  id: string;
  program_id: number;    // ID program induk
  code: string;          // kode mata pelajaran
  nama: string;
  tingkat_min: number;   // tingkatan minimal
  tingkat_max: number;   // tingkatan maksimal
  program_nama: string;
  jenjang: string;

}

export interface MapelInput {
  program_id: number;
  code: string;
  nama: string;
  tingkat_min: number;
  tingkat_max: number;
}

// 1) Ambil semua mata pelajaran
export async function getAllMapel(): Promise<Mapel[]> {
  const res = await fetch(`${API_BASE_URL}/mapel`, {
    method: 'GET',
    credentials: 'include',                      // kirim cookie JWT otomatis
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Mapel[]>(res);
}

// 2) Ambil satu mata pelajaran berdasarkan ID
export async function getMapelById(id: string): Promise<Mapel> {
  const res = await fetch(`${API_BASE_URL}/mapel/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.status === 404) {
    throw new Error('Mapel not found');
  }
  return handleApiResponse<Mapel>(res);
}

// 3) Buat mata pelajaran baru
export async function createMapel(payload: MapelInput): Promise<Mapel> {
  const res = await fetch(`${API_BASE_URL}/mapel`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<Mapel>(res);
}

// 4) Update mata pelajaran
export async function updateMapel(id: string, payload: MapelInput): Promise<Mapel> {
  const res = await fetch(`${API_BASE_URL}/mapel/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.status === 404) {
    throw new Error('Mapel not found');
  }
  return handleApiResponse<Mapel>(res);
}

// 5) Hapus mata pelajaran
export async function deleteMapel(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/mapel/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.status === 404) {
    throw new Error('Mapel not found');
  }
  return handleApiResponse<{ message: string }>(res);
}
