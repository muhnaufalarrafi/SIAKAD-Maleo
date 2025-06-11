// src\app\lib\auth\api.ts

const API_BASE_URL = 'http://localhost:3000/api'; // ganti sesuai alamat backend kamu

type LoginPayload = {
  identifier: string;
  password: string;
};

type User = {
  id: string;
  email: string;
  // tambahkan field lain sesuai response backend
};

export async function login(payload: LoginPayload): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login gagal');
  }

  const data = await res.json();
  // biasanya backend mengembalikan token JWT
  return data; // { token: '...' }
}

// Fungsi untuk mendapatkan data user
export async function getMe(token: string) {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil data user');
  }

  const data = await res.json();
  return data.user;
}
