// src/app/components/modal/UserModal.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import Select from 'react-select';
import { Button } from '../button/Button';
import { getAllRoles } from '@/app/lib/rbac/roles';
import { getAllPermissions } from '@/app/lib/rbac/permissions';

interface RoleOption {
  value: number;
  label: string;
}

interface PermissionOption {
  value: number;
  label: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    username: string;
    email: string;
    password?: string;
    roles: number[];
    permissions: number[];
  }) => Promise<{ user_id: string } | void>;
  initialData?: {
    user_id: string;
    username: string;
    email: string;
    roles: RoleOption[];
    permissions: PermissionOption[];
  };
}

export const UserModal: FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [permissionOptions, setPermissionOptions] = useState<PermissionOption[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<RoleOption[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initialData;

  useEffect(() => {
    const fetchOptions = async () => {
      try {
      const rolesRes = await getAllRoles();
      const permissionsRes = await getAllPermissions();

      setRoleOptions(
        rolesRes.map((r) => ({
          value: Number(r.id),    // konversi ke number
          label: r.name,
        }))
      );
      setPermissionOptions(
        permissionsRes.map((p) => ({
          value: Number(p.id),    // konversi ke number
          label: p.name,
        }))
      );
      } catch (err) {
        console.error('Gagal fetch roles/permissions:', err);
      }
    };

    if (isOpen) fetchOptions();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setUsername(initialData.username || '');
        setEmail(initialData.email || '');
        setSelectedRoles(initialData.roles || []);
        setSelectedPermissions(initialData.permissions || []);
      } else {
        setUsername('');
        setEmail('');
        setPassword('');
        setSelectedRoles([]);
        setSelectedPermissions([]);
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEdit && password.trim().length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    const roleIds = selectedRoles.map((r) => r.value);
    const permissionIds = selectedPermissions.map((p) => p.value);

    await onSubmit({
      username,
      email,
      ...(isEdit ? {} : { password }),
      roles: roleIds,
      permissions: permissionIds,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg text-[#0F2850]">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block mb-1 font-medium">Nama</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password (hanya saat create) */}
          {!isEdit && (
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          )}

          {/* Roles */}
          <div>
            <label className="block mb-1 font-medium">Roles</label>
            <Select
              isMulti
              options={roleOptions}
              value={selectedRoles}
              onChange={(val) => setSelectedRoles(val as RoleOption[])}
              placeholder="Pilih roles..."
              className="text-black"
            />
          </div>

          {/* Permissions */}
          <div>
            <label className="block mb-1 font-medium">Permissions</label>
            <Select
              isMulti
              options={permissionOptions}
              value={selectedPermissions}
              onChange={(val) => setSelectedPermissions(val as PermissionOption[])}
              placeholder="Pilih permissions..."
              className="text-black"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Tombol */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black"
            >
              Batal
            </Button>
            <Button type="submit">
              {isEdit ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
