'use client';

import { useState, useEffect } from 'react';
import { getAllRoles } from '@/app/lib/rbac/roles';  // Fungsi untuk mengambil semua roles
import { getAllPermissions } from '@/app/lib/rbac/permissions';  // Fungsi untuk mengambil semua permissions
import { useAuth } from '@/app/context/AuthContext';  // Menggunakan context untuk token

export default function RoleAndPermissionPage() {
  const { token } = useAuth();  // Mengambil token dari context
  const [roles, setRoles] = useState<any[]>([]);  // State untuk menyimpan data roles
  const [permissions, setPermissions] = useState<any[]>([]);  // State untuk menyimpan data permissions
  const [loading, setLoading] = useState(true);  // Menyimpan status loading
  const [error, setError] = useState<string | null>(null);  // Menyimpan error

  useEffect(() => {
    if (token) {
      // Ambil data roles dan permissions
      const fetchData = async () => {
        try {
          const roleData = await getAllRoles(token);  // Panggil API untuk ambil data roles
          const permissionData = await getAllPermissions(token);  // Panggil API untuk ambil data permissions
          setRoles(roleData);
          setPermissions(permissionData);
        } catch (err) {
          setError('Failed to fetch roles and permissions');
        } finally {
          setLoading(false);
        }
      };

      fetchData();  // Jalankan fetch ketika token tersedia
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;  // Tampilkan loading jika data sedang diambil
  if (error) return <div>{error}</div>;  // Tampilkan error jika ada masalah

  return (
    <div className="space-y-6">
      {/* Toolbar “Tambah” */}
      <div className="flex justify-end">
        <button
          id="btnAddRole"
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
          Tambah Role
        </button>
      </div>

      {/* Tabel Role */}
      <div className="overflow-x-auto rounded-3xl shadow ring-1 ring-[#18355E]/20 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-[#18355E] text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Role Name</th>
              <th className="py-3 px-4 text-left">Permissions</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-[#F5F8FF]/60">
                <td className="py-3 px-4">{role.id}</td>
                <td className="py-3 px-4 font-medium text-[#0F2850]">{role.name}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {permissions
                      .filter((perm) => perm.role_id === role.id)
                      .map((perm) => (
                        <span
                          key={perm.id}
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

      {/* Toolbar untuk Permissions */}
      <div className="flex justify-end mt-6">
        <button
          id="btnAddPermission"
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
          Tambah Permission
        </button>
      </div>

      {/* Tabel Permissions */}
      <div className="overflow-x-auto rounded-3xl shadow ring-1 ring-[#18355E]/20 bg-white mt-6">
        <table className="min-w-full text-sm">
          <thead className="bg-[#18355E] text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Permission Name</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {permissions.map((permission) => (
              <tr key={permission.id} className="hover:bg-[#F5F8FF]/60">
                <td className="py-3 px-4">{permission.id}</td>
                <td className="py-3 px-4 font-medium text-[#0F2850]">{permission.name}</td>
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
