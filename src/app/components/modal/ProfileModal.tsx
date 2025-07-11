'use client';

import { useState, useEffect, FormEvent } from 'react';
import { getUserById, updateMyProfile, UserWithRoles } from '@/app/lib/rbac/users'; 

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string; // userId tetap diperlukan untuk mengambil data awal
}

export const ProfileModal = ({ isOpen, onClose, userId }: ProfileModalProps) => {
  // State untuk data dan UI
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State untuk form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ✅ DIPERBAIKI: Logika fetch data yang lebih aman
  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      getUserById(userId)
        .then(response => {
          // Langsung akses 'response.user' karena tipe datanya sudah pasti
          const userData = response.user;
          
          if (userData) {
            setUser(userData);
            setUsername(userData.username);
            setEmail(userData.email);
          } else {
            // Ini akan dijalankan jika API mengembalikan { user: null }
            throw new Error('Data pengguna tidak ditemukan dalam respons API.');
          }
        })
        .catch(err => {
          setError(err.message || 'Gagal memuat data profil.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, userId]);

  // ✅ DIPERBAIKI: Logika submit form untuk memanggil endpoint yang benar
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password && password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    setSaving(true);

    const payload: { username?: string; email?: string; password?: string } = {};
    if (user && username !== user.username) payload.username = username;
    if (user && email !== user.email) payload.email = email;
    if (password) payload.password = password;

    if (Object.keys(payload).length === 0) {
      setSuccess('Tidak ada perubahan yang perlu disimpan.');
      setSaving(false);
      return;
    }

    try {
      // Panggil fungsi API yang baru dan lebih aman untuk update profil sendiri
      // Fungsi ini tidak memerlukan 'userId' karena backend mengambilnya dari token
      await updateMyProfile(payload); 
      
      setSuccess('Profil berhasil diperbarui!');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Gagal memperbarui profil.');
      } else {
        setError('Terjadi kesalahan tidak diketahui.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profil</h2>
        
        {loading && <p>Memuat data...</p>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}

        {!loading && user && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0F2850]">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-[#0F2850] text-[#0F2850]rounded-md text-[#0F2850]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F2850]">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-[#0F2850] text-[#0F2850]rounded-md text-[#0F2850]" />
            </div>
            <hr />
            <p className="text-sm text-gray-500">Kosongkan jika tidak ingin mengubah password.</p>
            <div>
              <label className="block text-sm font-medium text-[#0F2850]">Password Baru</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-[#0F2850] text-[#0F2850]rounded-md text-[#0F2850]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F2850]">Konfirmasi Password Baru</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-[#0F2850] text-[#0F2850]rounded-md text-[#0F2850]" />
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-[#18355E] text-white rounded-md hover:bg-[#0F2850] disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
