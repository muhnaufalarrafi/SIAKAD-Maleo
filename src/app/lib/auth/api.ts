// src/app/lib/auth/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { UserWithRoles } from '../rbac/users';

if (typeof API_BASE_URL === 'undefined') {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env.local file.');
}

export type LoginCredentials = {
  identifier: string;
  password: string;
};

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export async function login(payload: LoginCredentials): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData: unknown = await res.json().catch(() => ({}));
    const typedErrorData = errorData as ApiErrorResponse;
    throw new Error(typedErrorData.error || typedErrorData.message || 'Login gagal');
  }
}

export async function getMe(): Promise<UserWithRoles> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 401) {
    return Promise.reject(new Error('Unauthorized'));
  }

  if (!res.ok) {
    const errorData: unknown = await res.json().catch(() => ({}));
    const typedErrorData = errorData as ApiErrorResponse;
    throw new Error(typedErrorData.error || typedErrorData.message || 'Gagal mengambil data user');
  }

  const data = await res.json();
  // Menangani jika API mengembalikan { user: ... } atau langsung { ... }
  return data.user || data; 
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}