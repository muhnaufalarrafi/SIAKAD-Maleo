// src\app\lib\rbac\users.tsx
const API_BASE_URL = 'http://localhost:3000/api'; // Ganti dengan URL API backend kamu

// Fungsi untuk menangani response API secara umum
async function handleApiResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: 'Gagal mengambil data, tidak ada informasi error.'
    }));
    throw new Error(error.message || 'API request failed');
  }
  return res.json();
}

// Fungsi untuk mengambil semua user
export async function getAllUsers(token: string) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleApiResponse(res); // Gunakan fungsi penanganan response
}

// Fungsi untuk mengambil user berdasarkan ID
export async function getUserById(token: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleApiResponse(res);
}

// Fungsi untuk membuat user baru
export async function createUser(token: string, userData: { username: string, email: string, password: string, status_aktif: boolean }) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  return handleApiResponse(res);
}

// Fungsi untuk memperbarui user berdasarkan ID
export async function updateUser(token: string, userId: string, userData: { username?: string, email?: string, password?: string, status_aktif?: boolean }) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  return handleApiResponse(res);
}

// Fungsi untuk menghapus user berdasarkan ID
export async function deleteUser(token: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleApiResponse(res);
}
