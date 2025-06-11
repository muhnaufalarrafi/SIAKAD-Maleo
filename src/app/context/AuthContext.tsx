// src\app\context\AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../lib/auth/api'; // Import getMe untuk mengambil data user dari API

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
  token: string | null;
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const userData = await getMe(token);
          setUser(userData); // Set data user ke state
        } catch (error) {
          console.error(error);
          setUser(null); // Jika error, set user ke null
        }
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk menggunakan context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
