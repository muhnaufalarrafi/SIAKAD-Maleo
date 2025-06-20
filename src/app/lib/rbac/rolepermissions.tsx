// src/app/lib/rbac/rolepermissions.ts

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Optional: Tambahkan validasi jika API_BASE_URL tidak didefinisikan di .env
if (typeof API_BASE_URL === 'undefined') {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env.local file.');
}

// ====================================================================
// Definisi Interface untuk RolePermission, Role, dan Respons Error
// ====================================================================

export interface RolePermission {
  role_id: number;
  role_name: string;
  permissions: string[]; // Ini adalah array nama permission (string), bukan objek Permission penuh
}

// Interface untuk objek Role yang dikembalikan oleh getRolesByPermissionId
// Asumsi Role memiliki id dan name berdasarkan konteks (mirip dengan User.roles)
export interface Role {
  id: number;
  name: string;
  // Tambahkan properti lain jika objek Role memiliki lebih banyak detail
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

/**
 * 1) GET /api/role-permissions
 * returns RolePermission[]
 */
export async function getRolePermissions(): Promise<RolePermission[]> {
  const res = await fetch(`${API_BASE_URL}/role-permissions`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<RolePermission[]>(res);
}

/**
 * 2) GET /api/role-permissions/role/:role_id
 * returns { permissions: string[] }
 */
export async function getPermissionsByRoleId(roleId: string): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/role-permissions/role/${roleId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  // handleApiResponse<{ permissions: string[] }> sudah benar
  const json = await handleApiResponse<{ permissions: string[] }>(res);
  return json.permissions;
}

/**
 * 3) GET /api/role-permissions/permission/:permission_id
 * returns { roles: Role[] }
 */
export async function getRolesByPermissionId(permissionId: string): Promise<Role[]> { // Mengganti any[] dengan Role[]
  const res = await fetch(`${API_BASE_URL}/role-permissions/permission/${permissionId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  // handleApiResponse<{ roles: Role[] }> sudah benar, kita hanya mengubah 'any' di sini
  const json = await handleApiResponse<{ roles: Role[] }>(res);
  return json.roles;
}

/**
 * 4) POST /api/role-permissions
 * body { role_id, permission_id }
 */
export async function assignRolePermission(
  roleId: string,
  permissionId: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/role-permissions`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role_id: roleId, permission_id: permissionId }),
  });
  return handleApiResponse<{ message: string }>(res);
}

/**
 * 5) DELETE /api/role-permissions
 * body { role_id, permission_id }
 */
export async function removeRolePermission(
  roleId: string,
  permissionId: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/role-permissions`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role_id: roleId, permission_id: permissionId }),
  });
  return handleApiResponse<{ message: string }>(res);
}