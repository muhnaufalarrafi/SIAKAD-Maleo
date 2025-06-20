// src\app\context\AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe as apiGetMe, logout as apiLogout } from '../lib/auth/api';
import { useRouter } from 'next/navigation';


interface Role {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  name: string;
}

interface User {
  id: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Untuk menunggu getMe selesai
  const router = useRouter(); // router adalah dependensi yang digunakan di useEffect

  useEffect(() => {
    (async () => {
        try {
          const me = await apiGetMe();
          setUser(me);
        // --- PERUBAHAN DI SINI (BARIS 46) ---
        } catch (err: unknown) { // Ganti 'any' dengan 'unknown'
          // Lakukan type narrowing untuk mengakses properti `message`
          if (err instanceof Error) {
            // PERBAIKI: Pastikan perbandingan string case-sensitive ('Unauthorized')
            if (err.message === 'Unauthorized') {
              console.info('No active session found, redirecting to login...'); // Pesan info lebih baik daripada error
              await apiLogout(); // Clear cookie
              setUser(null);     // Clear context
              router.push('/login'); // Redirect otomatis
            } else {
              console.error('Gagal ambil user:', err.message); // Log pesan error yang spesifik
            }
          } else {
            console.error('Gagal ambil user: An unknown error occurred.', err); // Log error yang tidak dikenal
          }
        // --- AKHIR PERUBAHAN ---
        } finally {
          setLoading(false);
        }
    })();
  // --- PERUBAHAN DI SINI (BARIS 59) ---
  }, [router]); // Tambahkan 'router' sebagai dependensi karena digunakan di dalam efek
  // --- AKHIR PERUBAHAN ---

  const login = async (identifier: string, password: string) => {
    await apiLogin({ identifier, password });

    // Tunggu cookie tersimpan (di nonaktifkan)
    // await new Promise((resolve) => setTimeout(resolve, 500)); // Ini sudah dikomentari/dihapus, bagus.

    const me = await apiGetMe();
    setUser(me);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};