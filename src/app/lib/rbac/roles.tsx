// src/app/lib/rbac/roles.ts

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Optional: Tambahkan validasi jika API_BASE_URL tidak didefinisikan di .env
if (typeof API_BASE_URL === 'undefined') {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env.local file.');
}

// ====================================================================
// Definisi Interface untuk Role dan Respons Error
// ====================================================================

export interface Role {
  id: number; // Asumsi ID ada setelah role dibuat/diambil (jika backend menggunakan string ID)
  name: string;
  description: string;
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

// ====================================================================
// Fungsi API (dengan tipe yang diperbaiki)
// ====================================================================

// 1) Ambil semua roles
export async function getAllRoles(): Promise<Role[]> { // Mengganti any[] dengan Role[]
  const res = await fetch(`${API_BASE_URL}/roles`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Role[]>(res); // langsung array
}

// 2) Ambil role berdasarkan ID
// Asumsi respons untuk getRoleById adalah { role: Role }
export async function getRoleById(roleId: string): Promise<{ role: Role }> { // Mengganti any dengan Role
  const res = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ role: Role }>(res);
}

// 3) Buat role baru
// Asumsi respons untuk createRole adalah { role: Role }
export async function createRole(data: { name: string; description: string }): Promise<{ role: Role }> { // Mengganti any dengan Role
  const res = await fetch(`${API_BASE_URL}/roles`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleApiResponse<{ role: Role }>(res);
}

// 4) Update role
// Asumsi respons untuk updateRole adalah { role: Role }
export async function updateRole(roleId: string, data: { name: string; description: string }): Promise<{ role: Role }> { // Mengganti any dengan Role
  const res = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleApiResponse<{ role: Role }>(res);
}

// 5) Hapus role
export async function deleteRole(roleId: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ message: string }>(res);
}