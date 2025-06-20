// src\app\login\page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { login, getMe } from '../lib/auth/api';

export default function LoginPage() {
  const router = useRouter();
  // Ganti `email` menjadi `identifier` karena bisa berupa email atau username
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ identifier: identifier, password });

      const userData = await getMe();

      const userRole = userData.roles[0]?.name;
        if (userRole === 'tutor') {
            router.push('/page/tutor');
        } else {
            router.push('/page/dashboard');
        }
    } catch (err: unknown) { // <-- UBAH DARI `any` MENJADI `unknown`
      // Lakukan type narrowing untuk mengakses properti `message`
      if (err instanceof Error) {
        setError(err.message || 'Login gagal, coba lagi');
      } else {
        // Jika error bukan instance dari Error, mungkin string atau objek lain
        setError('Login gagal, coba lagi');
        console.error("An unexpected error occurred:", err); // Log error yang tidak dikenal
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F8FF]">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Ilustrasi */}
        <div className="md:w-1/2 bg-[#18355E] hidden md:flex items-end justify-center relative">
          <Image
            src="https://yayasanmaleo.com/wp-content/uploads/2016/05/slide_bg.png"
            alt="Ilustrasi"
            width={2000}
            height={2000}
            className="object-cover opacity-90"
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-10 md:p-14 space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-[#18355E]">Selamat Datang</h1>
            <p className="text-sm text-gray-500">Masuk ke akun SIAKAD Yayasan Maleo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <label className="block">
              {/* Ubah label dan placeholder untuk lebih umum */}
              <span className="text-sm font-medium text-gray-600">Email atau Username</span>
              <input
                type="text" // Ubah type dari "email" menjadi "text"
                required
                placeholder="email@example.com atau username" // Sesuaikan placeholder
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6C443] text-black"
                value={identifier} // Gunakan state `identifier`
                onChange={(e) => setIdentifier(e.target.value)} // Update state `identifier`
                disabled={loading}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-600">Password</span>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6C443] text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#18355E] hover:bg-[#0F2850] text-white font-semibold tracking-wide transition"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400">© Yayasan Maleo 2025</p>
        </div>
      </div>
    </div>
  );
}