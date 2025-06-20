// src/app/components/modal/PermissionModal.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from '../button/Button';

interface PermissionModalData {
  id?: number;
  name: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PermissionModalData) => void;
  initialData?: PermissionModalData;
}

export const PermissionModal: FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
        <h2 className="text-xl mb-4">
          {initialData ? 'Edit Permission' : 'Tambah Permission'}
        </h2>

        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({
              id: initialData?.id,
              name: name.trim(),
              description: description.trim(),
            });
          }}
        >
          {/* Name */}
          <label className="block mb-4">
            <span className="font-medium text-gray-700">Name</span>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#18355E]"
            />
          </label>

          {/* Description */}
          <label className="block mb-6">
            <span className="font-medium text-gray-700">Description</span>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#18355E]"
              rows={3}
            />
          </label>

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
