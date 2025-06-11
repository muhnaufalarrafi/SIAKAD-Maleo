// src\app\admin\role-permissions\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getRolePermissions } from '@/app/lib/rbac/rolepermissions';
import { getAllRoles } from '@/app/lib/rbac/roles';
import { getAllPermissions } from '@/app/lib/rbac/permissions';
import Tabs from '@/app/components/Tabs';

export default function RolePermissionsPage() {
  const { token } = useAuth();
  const [rolePermissions, setRolePermissions] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rolePermission' | 'role' | 'permission'>(
    'rolePermission'
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);

      try {
        const [roleData, permissionData, rolePermissionData] = await Promise.all([
          getAllRoles(token),
          getAllPermissions(token),
          getRolePermissions(token),
        ]);

        setRoles(roleData);
        setPermissions(permissionData);
        setRolePermissions(rolePermissionData);
      } catch (err) {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      {/* Tabs */}
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Panel Role & Permissions */}
      {activeTab === 'rolePermission' && (
        <div className="mt-6 bg-white rounded-2xl shadow p-6">
          {/* Header dan Tombol Tambah */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#18355E]">Role &amp; Permissions</h3>
            <button
              id="btnAddRolePermission"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow active:scale-95 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Role Permission
            </button>
          </div>

          {/* Tabel Role & Permissions */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#18355E] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Role ID</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Permissions</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rolePermissions.map((role) => (
                  <tr key={role.role_id} className="hover:bg-[#F5F8FF]/60">
                    <td className="py-3 px-4 font-medium text-[#0F2850]">{role.role_id}</td>
                    <td className="py-3 px-4 font-medium text-[#0F2850]">{role.role_name}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.length > 0 ? (
                          role.permissions.map((permission: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F5F8FF] text-[#0F2850] text-[10px]"
                            >
                              {permission}
                            </span>
                          ))
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F5F8FF] text-[#0F2850] text-[10px]">
                            No Permissions
                          </span>
                        )}
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
      )}

      {/* Panel Roles */}
      {activeTab === 'role' && (
        <div className="mt-6 bg-white rounded-2xl shadow p-6">
          {/* Header dan Tombol Tambah */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#18355E]">Roles</h3>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Role
            </button>
          </div>

          {/* Tabel Roles */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#18355E] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Role ID</th>
                  <th className="py-3 px-4 text-left">Role Name</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-[#F5F8FF]/60">
                    <td className="py-3 px-4 font-medium text-[#0F2850]">{role.id}</td>
                    <td className="py-3 px-4 font-medium text-[#0F2850]">{role.name}</td>
                    <td className="py-3 px-4 text-center space-x-2">
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
      )}

      {/* Panel Permissions */}
      {activeTab === 'permission' && (
        <div className="mt-6 bg-white rounded-2xl shadow p-6">
          {/* Header dan Tombol Tambah */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#18355E]">Permissions</h3>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Permission
            </button>
          </div>

          {/* Tabel Permissions */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#18355E] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Permission ID</th>
                  <th className="py-3 px-4 text-left">Permission Name</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-[#F5F8FF]/60">
                    <td className="py-3 px-4 font-medium text-[#0F2850]">{permission.id}</td>
                    <td className="py-3 px-4 font-medium text-[#0F2850]">{permission.name}</td>
                    <td className="py-3 px-4 text-center space-x-2">
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
      )}
    </div>
  );
}
