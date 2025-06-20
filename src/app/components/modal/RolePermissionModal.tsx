// src/app/components/modal/RolePermissionModal.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from '../button/Button';
import type { Permission } from '@/app/lib/rbac/permissions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { role_id: number; permissions: string[] }) => void;
  roles: { id: number; name: string }[];
  permissions: Permission[];
  initialData?: { role_id: number; permissions: string[] };
}

export const RolePermissionModal: FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  roles,
  permissions,
  initialData,
}) => {
  const [roleId, setRoleId] = useState<number>(
    initialData?.role_id ?? roles[0]?.id ?? 0
  );
  const [selectedPerms, setSelectedPerms] = useState<string[]>(
    initialData?.permissions ?? []
  );

  useEffect(() => {
    if (initialData) {
      setRoleId(initialData.role_id);
      setSelectedPerms(initialData.permissions);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const togglePerm = (perm: string) => {
    setSelectedPerms(prev =>
      prev.includes(perm)
        ? prev.filter(p => p !== perm)
        : [...prev, perm]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
        <h2 className="text-xl mb-4">
          {initialData ? 'Edit Role Permissions' : 'Tambah Role Permissions'}
        </h2>

        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({ role_id: roleId, permissions: selectedPerms });
          }}
        >
          {/* Role selector */}
          <label className="block mb-4">
            Role
            <select
              value={roleId}
              onChange={e => setRoleId(Number(e.target.value))}
              className="mt-1 w-full border px-3 py-2 rounded"
            >
              {roles.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          {/* Checkbox list */}
          <fieldset className="mb-4">
            <legend className="mb-2 font-medium">Permissions</legend>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-auto border p-2 rounded">
              {permissions.map(p => (
                <label key={p.name} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedPerms.includes(p.name)}
                    onChange={() => togglePerm(p.name)}
                  />
                  <span className="text-sm">{p.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Selected chips */}
          <div className="mb-6 flex flex-wrap gap-2">
            {selectedPerms.map(p => (
              <div
                key={p}
                className="flex items-center bg-[#F5F8FF] text-[#0F2850] px-2 py-1 rounded-full text-sm"
              >
                <span>{p}</span>
                <button
                  type="button"
                  onClick={() => togglePerm(p)}
                  className="ml-1 font-bold"
                  aria-label={`Remove ${p}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-black"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
