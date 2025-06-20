// src/app/lib/rbac/permissions.ts

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Optional: Tambahkan validasi jika API_BASE_URL tidak didefinisikan di .env
if (typeof API_BASE_URL === 'undefined') {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env.local file.');
}

// ====================================================================
// Definisi Interface untuk Permission dan Respons Error
// ====================================================================

export interface Permission {
  id: string; // Asumsi ID ada setelah permission dibuat/diambil
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

// 1) Ambil semua permissions
export async function getAllPermissions(): Promise<Permission[]> { // Mengganti any[] dengan Permission[]
  const res = await fetch(`${API_BASE_URL}/permissions`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Permission[]>(res);
}

// 2) Ambil permission berdasarkan ID
// Asumsi respons untuk getPermissionById adalah { permission: Permission }
export async function getPermissionById(permissionId: string): Promise<{ permission: Permission }> { // Mengganti any dengan Permission
  const res = await fetch(`${API_BASE_URL}/permissions/${permissionId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ permission: Permission }>(res);
}

// 3) Buat permission baru
// Asumsi respons untuk createPermission adalah { permission: Permission }
export async function createPermission(data: { name: string; description: string }): Promise<{ permission: Permission }> { // Mengganti any dengan Permission
  const res = await fetch(`${API_BASE_URL}/permissions`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleApiResponse<{ permission: Permission }>(res);
}

// 4) Update permission
// Asumsi respons untuk updatePermission adalah { permission: Permission }
export async function updatePermission(permissionId: string, data: { name: string; description: string }): Promise<{ permission: Permission }> { // Mengganti any dengan Permission
  const res = await fetch(`${API_BASE_URL}/permissions/${permissionId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleApiResponse<{ permission: Permission }>(res);
}

// 5) Hapus permission
export async function deletePermission(permissionId: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/permissions/${permissionId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ message: string }>(res);
}