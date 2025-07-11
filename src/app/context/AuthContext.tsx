// src/app/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, getMe as apiGetMe, logout as apiLogout } from '../lib/auth/api';
import { useRouter } from 'next/navigation';
import { UserWithRoles } from '../lib/rbac/users'; 

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

  useEffect(() => {
    (async () => {
        try {
          const me = await apiGetMe();
          setUser(me);
        } catch (err: unknown) {
          if (err instanceof Error) {
            if (err.message === 'Unauthorized') {
              console.info('No active session found, redirecting to login...');
              setUser(null);
              router.push('/login');
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
  }, [router]);

  const login = async (identifier: string, password: string) => {
    await apiLogin({ identifier, password });
    const me = await apiGetMe();
    setUser(me);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};