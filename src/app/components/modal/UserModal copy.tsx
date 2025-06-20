// src/app/components/modal/UserModal.tsx
'use client';
import { FC, useState, useEffect } from 'react';
import { Button } from '../button/Button';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { username: string; email: string; roles: string[]; permissions: string[] }) => void;
  initialData?: { username: string; email: string; roles: string[]; permissions: string[] };
}

export const UserModal: FC<UserModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [username, setUsername] = useState(initialData?.username || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [roles, setRoles] = useState(initialData?.roles.join(',') || '');
  const [perms, setPerms] = useState(initialData?.permissions.join(',') || '');

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username);
      setEmail(initialData.email);
      setRoles(initialData.roles.join(','));
      setPerms(initialData.permissions.join(','));
    }
  }, [initialData]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 text-black bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl  mb-4">{initialData ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({
              username,
              email,
              roles: roles.split(',').map(s => s.trim()),
              permissions: perms.split(',').map(s => s.trim()),
            });
          }}
        >
          <label className="block mb-2">
            Nama
            <input
              type="text"
              className="mt-1 w-full border px-3 py-2 rounded"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </label>
          <label className="block mb-2">
            Email
            <input
              type="email"
              className="mt-1 w-full border px-3 py-2 rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block mb-2">
            Roles (comma-separated)
            <input
              type="text"
              className="mt-1 w-full border px-3 py-2 rounded"
              value={roles}
              onChange={e => setRoles(e.target.value)}
            />
          </label>
          <label className="block mb-4">
            Permissions (comma-separated)
            <input
              type="text"
              className="mt-1 w-full border px-3 py-2 rounded"
              value={perms}
              onChange={e => setPerms(e.target.value)}
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black">
              Batal
            </Button>
            <Button type="submit">{initialData ? 'Update' : 'Simpan'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
