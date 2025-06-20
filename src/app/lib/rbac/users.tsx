// src/app/lib/rbac/users.ts
// Mengakses variabel lingkungan dari process.env
import type { Permission } from '@/app/lib/rbac/permissions';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Optional: Tambahkan validasi jika API_BASE_URL tidak didefinisikan di .env
if (typeof API_BASE_URL === 'undefined') {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env.local file.');
}

// ====================================================================
// Definisi Interface untuk User, Role, dan Respons Error
// ====================================================================

// Interface untuk objek Role yang terkait dengan User
export interface UserRole {
  id: number;
  name: string;
  // Tambahkan properti lain jika objek Role memiliki lebih banyak detail
}

// Interface untuk objek User dengan properti roles
export interface UserWithRoles {
  id: string;
  username: string;
  email: string;
  status_aktif: boolean;
  roles: UserRole[]; // Array dari objek Role
  permissions: Permission[];
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
  } catch { // Tanpa parameter untuk `catch` jika objek error tidak digunakan
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

export async function getAllUsers(): Promise<UserWithRoles[]> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  // langsung kembalikan array
  return handleApiResponse<UserWithRoles[]>(res);
}

export async function getAllTutorUsers(): Promise<UserWithRoles[]> {
  const all = await getAllUsers();
  return all.filter(u =>
    u.roles.some((r: UserRole) => r.name.toLowerCase() === 'tutor') // Memberikan tipe eksplisit pada 'r'
  );
}

export async function getAllSiswaUsers(): Promise<UserWithRoles[]> {
  const all = await getAllUsers();
  return all.filter(u =>
    u.roles.some((r: UserRole) => r.name.toLowerCase() === 'siswa') // Memberikan tipe eksplisit pada 'r'
  );
}

// 2) Ambil user by ID
// Asumsi respons untuk getUserById adalah { user: UserWithRoles }
export async function getUserById(userId: string): Promise<{ user: UserWithRoles }> { // Mengganti any dengan UserWithRoles
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ user: UserWithRoles }>(res);
}

// 3) Buat user baru
// Asumsi respons untuk createUser adalah { user: { id: string } }
export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
  status_aktif: boolean;
}): Promise<{ user: { id: string } }> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleApiResponse<{ user: { id: string } }>(res);
}

// 4) Update user
// Asumsi respons untuk updateUser adalah { user: UserWithRoles }
export async function updateUser(
  userId: string,
  userData: {
    username?: string;
    email?: string;
    password?: string;
    status_aktif?: boolean;
  }
): Promise<{ user: UserWithRoles }> { // Mengganti any dengan UserWithRoles
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleApiResponse<{ user: UserWithRoles }>(res);
}

// 5) Hapus user
export async function deleteUser(userId: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ message: string }>(res);
}