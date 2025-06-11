// src\app\lib\rbac\permissions.tsx
const API_BASE_URL = 'http://localhost:3000/api'; // Ganti dengan URL API backend kamu

// Fungsi untuk mengambil semua permissions
export async function getAllPermissions(token: string) {
  const res = await fetch(`${API_BASE_URL}/permissions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Sertakan token untuk autentikasi
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil data permissions');
  }

  const data = await res.json();
  return data;
}

// Fungsi untuk mengambil permission berdasarkan ID
export async function getPermissionById(token: string, permissionId: string) {
  const res = await fetch(`${API_BASE_URL}/permissions/${permissionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Sertakan token untuk autentikasi
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil data permission');
  }

  const data = await res.json();
  return data;
}

// Fungsi untuk membuat permission baru
export async function createPermission(token: string, permissionData: { name: string; description: string }) {
  const res = await fetch(`${API_BASE_URL}/permissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Sertakan token untuk autentikasi
    },
    body: JSON.stringify(permissionData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal membuat permission');
  }

  const data = await res.json();
  return data;
}

// Fungsi untuk memperbarui permission berdasarkan ID
export async function updatePermission(token: string, permissionId: string, permissionData: { name: string; description: string }) {
  const res = await fetch(`${API_BASE_URL}/permissions/${permissionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Sertakan token untuk autentikasi
    },
    body: JSON.stringify(permissionData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal memperbarui permission');
  }

  const data = await res.json();
  return data;
}

// Fungsi untuk menghapus permission berdasarkan ID
export async function deletePermission(token: string, permissionId: string) {
  const res = await fetch(`${API_BASE_URL}/permissions/${permissionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Sertakan token untuk autentikasi
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal menghapus permission');
  }

  const data = await res.json();
  return data;
}
