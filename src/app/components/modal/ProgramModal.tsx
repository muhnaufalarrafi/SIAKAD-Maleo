'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from '../button/Button';

interface ProgramModalData {
  id?: string;
  code: string;
  nama: string;
  jenjang: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProgramModalData) => void;
  initialData?: ProgramModalData;
}

export const ProgramModal: FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [code, setCode] = useState('');
  const [nama, setNama] = useState('');
  const [jenjang, setJenjang] = useState('');

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code || '');
      setNama(initialData.nama || '');
      setJenjang(initialData.jenjang || '');
    } else {
      setCode('');
      setNama('');
      setJenjang('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
        <h2 className="text-xl mb-4">
          {initialData ? 'Edit Program' : 'Tambah Program'}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ id: initialData?.id, code, nama, jenjang });
          }}
        >
          {/* Kode Program */}
          <label className="block mb-4">
            <span className="font-medium text-gray-700">Kode</span>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </label>

          {/* Nama Program */}
          <label className="block mb-4">
            <span className="font-medium text-gray-700">Nama</span>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </label>

          {/* Jenjang */}
          <label className="block mb-6">
            <span className="font-medium text-gray-700">Jenjang</span>
            <input
              type="text"
              required
              value={jenjang}
              onChange={(e) => setJenjang(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </label>

          {/* Tombol Aksi */}
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
