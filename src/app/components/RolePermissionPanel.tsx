// src/app/admin/role-permissions/components/RolePermissionPanel.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/app/components/button/Button';
import { RolePermissionModal } from '@/app/components/modal/RolePermissionModal';
import {
  RolePermission,
  assignRolePermission,
  removeRolePermission,
} from '@/app/lib/rbac/rolepermissions';
import { Permission } from '@/app/lib/rbac/permissions';
import { Role } from '../lib/rbac/roles';

interface Props {
  data: RolePermission[];
  roles: Role[];
  permissions: Permission[];
  onRefresh: () => void;
}

export function RolePermissionPanel({
  data,
  roles,
  permissions,
  onRefresh,
}: Props) {
  const [isOpen, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<RolePermission | null>(null);

  // Remove all permissions for a role
  const handleDelete = async (rp: RolePermission) => {
    if (!confirm('Yakin ingin menghapus semua permission untuk role ini?')) return;
    for (const permName of rp.permissions) {
      const perm = permissions.find(p => p.name === permName);
      if (perm) {
        await removeRolePermission(
          rp.role_id.toString(),
          perm.id.toString()
        );
      }
    }
    onRefresh();
  };

  return (
    <div className="mt-6 bg-white rounded-2xl shadow p-6">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#18355E]">
          Role &amp; Permissions
        </h3>
        <Button onClick={() => { setEditItem(null); setOpen(true); }}>
          Tambah Role Permission
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm table-auto">
          <colgroup>
            <col className="w-1/12" />
            <col className="w-3/12" />
            <col className="w-6/12" />
            <col className="w-2/12" />
          </colgroup>
          <thead className="bg-[#18355E] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Role ID</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Permissions</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(rp => (
              <tr key={rp.role_id} className="hover:bg-[#F5F8FF]/60">
                <td className="py-3 px-4 font-medium text-[#0F2850]">
                  {rp.role_id}
                </td>
                <td className="py-3 px-4 font-medium text-[#0F2850]">
                  {rp.role_name}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {rp.permissions.length > 0
                      ? rp.permissions.map((perm, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F5F8FF] text-[#0F2850] text-[10px]"
                          >
                            {perm}
                          </span>
                        ))
                      : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F5F8FF] text-[#0F2850] text-[10px]">
                            No Permissions
                          </span>
                        )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                      onClick={() => { setEditItem(rp); setOpen(true); }}
                    >
                      Edit
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white text-xs"
                      onClick={() => handleDelete(rp)}
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

      {/* Modal for Add / Edit */}
      <RolePermissionModal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        onSubmit={async ({ role_id, permissions: newPerms }) => {
          // Remove old perms if editing
          if (editItem) {
            for (const oldName of editItem.permissions) {
              const oldPerm = permissions.find(p => p.name === oldName);
              if (oldPerm) {
                await removeRolePermission(
                  editItem.role_id.toString(),
                  oldPerm.id.toString()
                );
              }
            }
          }
          // Assign new perms
          for (const permName of newPerms) {
            const perm = permissions.find(p => p.name === permName);
            if (perm) {
              await assignRolePermission(
                role_id.toString(),
                perm.id.toString()
              );
            }
          }
          setOpen(false);
          onRefresh();
        }}
        roles={roles}
        permissions={permissions}
        initialData={editItem ? {
          role_id: editItem.role_id,
          permissions: editItem.permissions,
        } : undefined}
      />
    </div>
  );
}
