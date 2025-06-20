// frontend/src/app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '@/app/lib/rbac/users';
import type { UserWithRoles } from '@/app/lib/rbac/users';
import { Button } from '@/app/components/button/Button';
import { UserModal } from '@/app/components/modal/UserModal';
import { assignUserRole, removeUserRole } from '@/app/lib/rbac/userroles';
import { assignUserPermission, removeUserPermission } from '@/app/lib/rbac/userpermissions';

    // di puncak file, tambahkan:
    interface UserFormValues {
      username: string;
      email: string;
      password?: string;
      roles: number[];
      permissions: number[];
    }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<UserWithRoles | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const list = await getAllUsers();
      setUsers(list);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // 🔴 Tambah user
  const handleAdd = async (data: UserFormValues) => {
    if (!data.password) {
    alert('Password wajib diisi untuk user baru.');
    return;
  }
  const res = await createUser({
    username: data.username,
    email: data.email,
    password: data.password,
    status_aktif: true,
  });

  if (!res || !res.user || !res.user.id) {
    alert('Gagal menambahkan user. Data user tidak valid.');
    return;
  }

  const userId = res.user.id;

  for (const roleId of data.roles) {
    await assignUserRole({ user_id: userId, role_id: roleId });
  }

  for (const permissionId of data.permissions) {
    await assignUserPermission({
      user_id: userId,
      permission_id: permissionId,
      override_type: 'allow',
    });
  }

  setAddOpen(false);
  refresh();
};

  // 🔴 Edit user
const handleEdit = async (data: Omit<UserFormValues, 'password'>) => {
  // FIX 1: Tambahkan pengecekan ini!
  if (!selected) {
    console.error("User belum dipilih untuk diedit.");
    return;
  }    const userId = selected.id;

    await updateUser(userId, {
      username: data.username,
      email: data.email,
      // password: tidak dikirim
    });

    for (const role of selected.roles) {
      await removeUserRole({ user_id: userId, role_id: role.id });
    }
    for (const permission of selected.permissions) {
      await removeUserPermission({ user_id: userId, permission_id: parseInt(permission.id, 10) });
    }

    for (const roleId of data.roles) {
      await assignUserRole({ user_id: userId, role_id: roleId });
    }

    for (const permissionId of data.permissions) {
      await assignUserPermission({
        user_id: userId,
        permission_id: permissionId,
        override_type: 'allow',
      });
    }

    setEditOpen(false);
    setSelected(null);
    refresh();
  };

  // 🔴 Hapus user
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Yakin ingin menghapus user ini?');
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert('Gagal menghapus user: ' + msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setAddOpen(true)}>Tambah</Button>
      </div>

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
            {users.map((u, i) => (
              <tr key={u.id} className="hover:bg-[#F5F8FF]/60">
                <td className="py-3 px-4 text-gray-600">{i + 1}</td>
                <td className="py-3 px-4 font-medium text-[#0F2850]">{u.username}</td>
                <td className="py-3 px-4 text-gray-600">{u.email}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#F5F8FF] text-[#0F2850] text-xs">
                    {u.roles.map(r => r.name).join(', ')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {u.permissions.map(p => (
                      <span
                        key={p.name}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F5F8FF] text-[#0F2850] text-[10px]"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                    onClick={() => {
                      setSelected(u);
                      setEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                    onClick={() => handleDelete(u.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <UserModal
        key={isAddOpen ? 'new' : selected?.id}
        isOpen={isAddOpen || isEditOpen}
        onClose={() => {
          setAddOpen(false);
          setEditOpen(false);
          setSelected(null);
        }}
        onSubmit={isAddOpen ? handleAdd : handleEdit}
  initialData={
    isEditOpen && selected
      ? {
          user_id: selected.id,
          username: selected.username,
          email: selected.email,
          roles: selected.roles.map(r => ({
            // FIX: Konversi r.id ke number
            value: r.id, 
            label: r.name,
          })),
          permissions: selected.permissions.map(p => ({
            // FIX: Konversi p.id ke number
            value: parseInt(p.id, 10), 
            label: p.name,
          })),
        }
      : undefined
      }
      />
    </div>
  );
}
