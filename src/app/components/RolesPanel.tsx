// src/app/admin/role-permissions/components/RolesPanel.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/app/components/button/Button';
import { RoleModal } from '@/app/components/modal/RoleModal';
import {
  createRole,
  updateRole,
  deleteRole,
  Role as RoleType,
} from '@/app/lib/rbac/roles';

interface Props {
  roles: RoleType[];
  onRefresh: () => void;
}

export function RolesPanel({ roles, onRefresh }: Props) {
  const [isOpen, setOpen] = useState(false);
  const [editRole, setEditRole] = useState<RoleType | null>(null);

  const handleDelete = async (role: RoleType) => {
    if (!confirm(`Yakin ingin menghapus role "${role.name}"?`)) return;
    await deleteRole(role.id.toString());
    onRefresh();
  };

  return (
    <div className="mt-6 bg-white rounded-2xl shadow p-6">
      {/* Header & “Tambah” */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#18355E]">Roles</h3>
        <Button onClick={() => { setEditRole(null); setOpen(true); }}>
          Tambah Role
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm table-auto">
          <colgroup>
            <col className="w-2/12" />
            <col className="w-5/12" />
            <col className="w-5/12" />
            <col className="w-2/12" />
          </colgroup>
          <thead className="bg-[#18355E] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Role ID</th>
              <th className="py-3 px-4 text-left">Role Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.map(role => (
              <tr key={role.id} className="hover:bg-[#F5F8FF]/60 font-medium text-[#0F2850]">
                <td className="py-3 px-4">{role.id}</td>
                <td className="py-3 px-4">{role.name}</td>
                <td className="py-3 px-4">{role.description}</td>
                <td className="py-3 px-4 text-center space-x-2">
              <div className="flex justify-center gap-2">
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                    onClick={() => { setEditRole(role); setOpen(true); }}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                    onClick={() => handleDelete(role)}
                  >
                    Hapus
                  </Button>
              </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add / Edit Role */}
      <RoleModal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        initialData={
          editRole
            ? { 
              id: Number(editRole.id), 
              name: editRole.name, 
              description: editRole.description 
            }
            : undefined
        }
        onSubmit={async ({ id, name, description }) => {
          if (id) {
            await updateRole(id.toString(), { name, description });
          } else {
            await createRole({ name, description });
          }
          setOpen(false);
          onRefresh();
        }}
      />
    </div>
  );
}
