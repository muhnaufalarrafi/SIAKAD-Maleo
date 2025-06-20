// src/app/lib/auth/api.ts

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Optional: Tambahkan validasi jika API_BASE_URL tidak didefinisikan di .env
if (typeof API_BASE_URL === 'undefined') {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env.local file.');
}

type LoginPayload = {
  identifier: string;
  password: string;
};

type User = {
  id: string;
  email: string;
  roles: { id: number; name: string }[];
  permissions: { id: number; name: string }[];
};

// Interface untuk struktur respons error dari API
// Asumsi API Anda mengembalikan objek dengan properti 'error'
interface ApiErrorResponse {
  error?: string;
  message?: string; // Beberapa API juga menggunakan 'message' untuk pesan error
}

export async function login(payload: LoginPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',       // ← kirim & terima HTTP-only cookie
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // --- PERUBAHAN DI SINI (BARIS 28) ---
    // Menggunakan 'unknown' untuk hasil catch, dan kemudian type assertion
    const errorData: unknown = await res.json().catch(() => ({}));
    const typedErrorData = errorData as ApiErrorResponse; // Type assertion ke interface spesifik
    throw new Error(typedErrorData.error || typedErrorData.message || 'Login gagal');
    // --- AKHIR PERUBAHAN ---
  }
  // cookie sudah ter‐set, tidak perlu return token
}

export async function getMe(): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 401) {
    // Tidak perlu throw error, cukup kembalikan null
    return Promise.reject(new Error('Unauthorized')); // Pesan ini sudah string literal, tidak perlu perbaikan any
  }

  if (!res.ok) {
    // --- PERUBAHAN DI SINI (BARIS 46) ---
    // Menggunakan 'unknown' untuk hasil catch, dan kemudian type assertion
    const errorData: unknown = await res.json().catch(() => ({}));
    const typedErrorData = errorData as ApiErrorResponse; // Type assertion ke interface spesifik
    throw new Error(typedErrorData.error || typedErrorData.message || 'Gagal mengambil data user');
    // --- AKHIR PERUBAHAN ---
  }

  const { user } = await res.json();
  return user;
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',       // ← cookie di‐clear di server
  });
}