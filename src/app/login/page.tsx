'use client';

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FormEvent, useState } from 'react'
import { login } from '../lib/auth/api' // import fungsi login

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { token } = await login({ identifier: email, password })
      // Simpan token di localStorage (atau cookie sesuai kebutuhan)
      localStorage.setItem('token', token)

      // Ambil data user untuk mendapatkan role
      const userResponse = await fetch('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const userData = await userResponse.json()

      // Cek role user dan arahkan ke dashboard yang sesuai
      const userRole = userData.user.roles[0]?.name; // Asumsi hanya ada satu role, sesuaikan jika ada lebih dari satu

      if (userRole === 'admin' || 'superadmin') {
        router.push('/admin/dashboard');  // Redirect ke dashboard admin
      } else if (userRole === 'tutor') {
        router.push('/tutor/dashboard');  // Redirect ke dashboard tutor
      } else {
        setError('Role tidak dikenal');
      }
    } catch (err: any) {
      setError(err.message || 'Login gagal, coba lagi')
    } finally {
      setLoading(false)
    }
  }

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
              <span className="text-sm font-medium text-gray-600">Email</span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6C443] text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
  )
}
