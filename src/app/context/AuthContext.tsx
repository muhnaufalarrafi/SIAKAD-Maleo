// src/app/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, getMe as apiGetMe, logout as apiLogout } from '../lib/auth/api';
import { useRouter } from 'next/navigation';
import { UserWithRoles } from '../lib/rbac/users';
// --- 1. Import komponen modal ---
import { SessionExpiredModal } from '../components/SessionExpiredModal'; 

interface AuthContextType {
  user: UserWithRoles | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // --- 2. Tambahkan state untuk modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await apiGetMe();
        setUser(me);
      } catch (err: unknown) {
        if (err instanceof Error) {
          // --- 3. Modifikasi blok catch ---
          if (err.message === 'Unauthorized') {
            console.info('Session expired on another device. Showing modal.');
            setUser(null); // Tetap bersihkan user
            setIsModalOpen(true); // Tampilkan modal, bukan redirect
          } else {
            console.error('Gagal ambil data user:', err.message);
            setUser(null);
          }
        } else {
          console.error('Gagal ambil data user: An unknown error occurred.', err);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []); // Hapus [router] agar tidak re-trigger saat navigasi

  const login = async (identifier: string, password:string) => {
    await apiLogin({ identifier, password });
    const me = await apiGetMe();
    setUser(me);
  };

  const logout = async () => {
    // Pastikan modal tertutup saat logout manual
    if (isModalOpen) setIsModalOpen(false); 
    await apiLogout();
    setUser(null);
    router.push('/login');
  };
  
  // --- 4. Buat fungsi handler untuk tombol modal ---
  const handleConfirmLogout = () => {
    setIsModalOpen(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}

      {/* --- 5. Render komponen modal di sini --- */}
      <SessionExpiredModal 
        isOpen={isModalOpen} 
        onConfirm={handleConfirmLogout} 
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};