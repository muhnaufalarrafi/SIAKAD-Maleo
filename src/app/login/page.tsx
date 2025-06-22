// src/app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { login, getMe } from '../lib/auth/api';
import { Eye, EyeOff } from 'lucide-react'; // <-- TAMBAHKAN: Import ikon

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <-- TAMBAHKAN: State untuk visibilitas password
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Login gagal, coba lagi');
      } else {
        setError('Login gagal, coba lagi');
        console.error("An unexpected error occurred:", err);
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
              <span className="text-sm font-medium text-gray-600">Email atau Username</span>
              <input
                type="text"
                required
                placeholder="email@example.com atau username"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6C443] text-black"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
              />
            </label>

            {/* --- BLOK PASSWORD YANG DIUBAH --- */}
            <label className="block">
              <span className="text-sm font-medium text-gray-600">Password</span>
              {/* <-- TAMBAHKAN: Wrapper div dengan posisi relative --> */}
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'} // <-- UBAH: Tipe input dinamis
                  required
                  placeholder="••••••••"
                  // <-- UBAH: Tambahkan padding kanan agar teks tidak tertutup ikon -->
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6C443] text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                {/* <-- TAMBAHKAN: Tombol untuk toggle visibilitas password --> */}
                <button
                  type="button" // Penting: 'button' agar tidak submit form
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>
            {/* --- AKHIR BLOK PASSWORD --- */}


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