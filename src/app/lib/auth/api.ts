// src/app/lib/auth/api.ts

import { UserWithRoles } from '../rbac/users';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (typeof API_BASE_URL === 'undefined') {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env.local file.');
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

/**
 * Wrapper fetch terpusat untuk semua panggilan API.
 * Secara otomatis menangani base URL, credentials, dan error umum seperti 401.
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // <-- Konfigurasi di satu tempat
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...defaultOptions, ...options });

  // --- Penanganan Error Terpusat ---
  if (!res.ok) {
    // Tangani 401 secara spesifik
    if (res.status === 401) {
      // Kode di sini akan dieksekusi untuk SETIAP request yang gagal karena otorisasi.
      // Di sinilah tempat yang tepat untuk memicu logout global di sisi frontend.
      throw new Error('Unauthorized'); 
    }
    
    // Tangani error lainnya
    const errorData: unknown = await res.json().catch(() => ({}));
    const typedErrorData = errorData as ApiErrorResponse;
    throw new Error(typedErrorData.error || typedErrorData.message || 'Terjadi kesalahan pada API');
  }
  
  // Mengembalikan data JSON jika ada, jika tidak, tidak mengembalikan apa-apa (untuk POST/DELETE)
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
}

// --- FUNGSI API MENJADI JAUH LEBIH SEDERHANA ---

export type LoginCredentials = {
  identifier: string;
  password: string;
};

export function login(payload: LoginCredentials): Promise<void> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMe(): Promise<UserWithRoles> {
  const data = await apiFetch('/auth/me');
  // Menangani jika API mengembalikan { user: ... } atau langsung { ... }
  return data.user || data;
}

export function logout(): Promise<void> {
  return apiFetch('/auth/logout', {
    method: 'POST',
  });
}