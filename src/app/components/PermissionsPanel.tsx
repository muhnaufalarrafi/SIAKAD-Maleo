// src/app/admin/role-permissions/components/PermissionsPanel.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/app/components/button/Button';
import { PermissionModal } from '@/app/components/modal/PermissionModal';
import {
  createPermission,
  updatePermission,
  deletePermission,
  Permission,
} from '@/app/lib/rbac/permissions';

interface Props {
  permissions: Permission[];
  onRefresh: () => void;
}

export function PermissionsPanel({ permissions, onRefresh }: Props) {
  const [isOpen, setOpen] = useState(false);
  const [editPerm, setEditPerm] = useState<Permission | null>(null);

  const handleDelete = async (p: Permission) => {
    if (!confirm(`Yakin ingin menghapus permission "${p.name}"?`)) return;
    await deletePermission(p.id.toString());
    onRefresh();
  };

  return (
    <div className="mt-6 bg-white rounded-2xl shadow p-6">
      {/* Header & “Tambah” */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#18355E]">Permissions</h3>
        <Button onClick={() => { setEditPerm(null); setOpen(true); }}>
          Tambah Permission
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm table-auto">
          <colgroup>
            <col className="w-2/12" />
            <col className="w-6/12" />
            <col className="w-4/12" />
            <col className="w-2/12" />
          </colgroup>
          <thead className="bg-[#18355E] text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {permissions.map(p => (
              <tr key={p.id} className="hover:bg-[#F5F8FF]/60 font-medium text-[#0F2850]">
                <td className="py-3 px-4">{p.id}</td>
                <td className="py-3 px-4">{p.name}</td>
                <td className="py-3 px-4">{p.description}</td>
                <td className="py-3 px-4 text-center space-x-2">
                <div className="flex justify-center gap-2">
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                    onClick={() => { setEditPerm(p); setOpen(true); }}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                    onClick={() => handleDelete(p)}
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

      {/* Modal for Add / Edit Permission */}
      <PermissionModal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        initialData={
          editPerm
            ? { 
              id: Number(editPerm.id), 
              name: editPerm.name, 
              description: editPerm.description 
            }
            : undefined
        }
        onSubmit={async ({ id, name, description }) => {
          if (id != null) {
            await updatePermission(id.toString(), { name, description });
          } else {
            await createPermission({ name, description });
          }
          setOpen(false);
          onRefresh();
        }}
      />
    </div>
  );
}
