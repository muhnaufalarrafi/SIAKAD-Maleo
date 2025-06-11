// src\app\lib\rbac\roles.tsx
const API_BASE_URL = 'http://localhost:3000/api'; // Ganti dengan URL API backend kamu

// Fungsi untuk mengambil semua roles
export async function getAllRoles(token: string) {
  const res = await fetch(`${API_BASE_URL}/roles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,  // Sertakan token untuk autentikasi
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil data roles');
  }

  const data = await res.json();
  return data;
}

// Fungsi untuk mengambil role berdasarkan ID
export async function getRoleById(token: string, roleId: string) {
  const res = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,  // Sertakan token untuk autentikasi
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil data role');
  }

  const data = await res.json();
  return data;
}

// Fungsi untuk membuat role baru
export async function createRole(token: string, roleData: { name: string; description: string }) {
  const res = await fetch(`${API_BASE_URL}/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,  // Sertakan token untuk autentikasi
    },
    body: JSON.stringify(roleData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal membuat role');
  }

  const data = await res.json();
  return data;
}

// Fungsi untuk memperbarui role berdasarkan ID
export async function updateRole(token: string, roleId: string, roleData: { name: string; description: string }) {
  const res = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,  // Sertakan token untuk autentikasi
    },
    body: JSON.stringify(roleData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal memperbarui role');
  }

  const data = await res.json();
  return data;
}

// Fungsi untuk menghapus role berdasarkan ID
export async function deleteRole(token: string, roleId: string) {
  const res = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,  // Sertakan token untuk autentikasi
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal menghapus role');
  }

  const data = await res.json();
  return data;
}
