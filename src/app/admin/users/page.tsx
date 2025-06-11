// frontend/src/app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAllUsers } from '@/app/lib/rbac/users';  // Import API function
import { useAuth } from '@/app/context/AuthContext';  // Menggunakan context untuk token

export default function AdminUsersPage() {
  const { token } = useAuth();  // Ambil token dari context
  const [users, setUsers] = useState([]);  // State untuk menyimpan data users
  const [loading, setLoading] = useState(true);  // Menyimpan status loading
  const [error, setError] = useState<string | null>(null);  // Menyimpan error

  // Fetch data users setelah token tersedia
  useEffect(() => {
    if (token) {
      const fetchUsers = async () => {
        try {
          const userList = await getAllUsers(token);  // Panggil API untuk ambil data users
          setUsers(userList);  // Set data users
        } catch (err) {
          setError(err.message || 'Gagal mengambil data users');  // Tangani error
        } finally {
          setLoading(false);  // Set loading selesai
        }
      };

      fetchUsers();  // Jalankan fetch ketika token ada
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;  // Tampilkan loading jika data sedang diambil
  if (error) return <div>{error}</div>;  // Tampilkan error jika ada masalah

  return (
    <div className="space-y-6">
      {/* Toolbar “Tambah” */}
      <div className="flex justify-end">
        <button
          id="btnAdd"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow active:scale-95 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah
        </button>
      </div>

      {/* Tabel Pengguna */}
      <div className="overflow-x-auto rounded-3xl shadow ring-1 ring-[#18355E]/20 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-[#18355E] text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Nama</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Permissions</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#F5F8FF]/60">
                <td className="py-3 px-4 text-gray-600">{user.id}</td>
                <td className="py-3 px-4 font-medium text-[#0F2850]">
                  {user.username}
                </td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#F5F8FF] text-[#0F2850] text-xs">
                    {user.roles?.map((role) => role.name).join(', ')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {user.permissions?.map((perm) => (
                      <span
                        key={perm.name}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F5F8FF] text-[#0F2850] text-[10px]"
                      >
                        {perm.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                  <button className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs">
                    Edit
                  </button>
                  <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
