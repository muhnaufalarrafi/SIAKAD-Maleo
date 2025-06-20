// src/app/components/modal/MateriModal.tsx
'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Button } from '../button/Button';
import type { MateriInput, Materi } from '@/app/lib/curriculum/materi';
import { getAllMapel } from '@/app/lib/curriculum/mataPelajaran';

interface MapelOption {
  value: string;
  label: string;
}

interface MateriModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Materi;
  onSubmit: (data: MateriInput, id?: string) => void;
}

export const MateriModal = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: MateriModalProps) => {
  const [mapelOptions, setMapelOptions] = useState<MapelOption[]>([]);
  const [selectedMapel, setSelectedMapel] = useState<MapelOption | null>(null);
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  useEffect(() => {
    const fetchMapel = async () => {
      try {
        const result = await getAllMapel();
        const options = result.map((m) => ({
          value: m.id,
          label: m.nama
        }));
        setMapelOptions(options);

        if (initialData) {
          const found = options.find(opt => opt.value === initialData.mata_pelajaran_id);
          setSelectedMapel(found || null);
        }
      } catch (err) {
        console.error('Gagal mengambil data mata pelajaran:', err);
      }
    };

    if (isOpen) {
      fetchMapel();
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama);
      setDeskripsi(initialData.deskripsi ?? '');
    } else {
      setNama('');
      setDeskripsi('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMapel || !nama.trim()) return;

    const payload: MateriInput = {
      mata_pelajaran_id: selectedMapel.value,
      nama: nama.trim(),
      deskripsi: deskripsi.trim() || undefined,
    };

    onSubmit(payload, initialData?.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
        <h2 className="text-xl mb-4 font-semibold text-[#18355E]">
          {initialData ? 'Edit Materi' : 'Tambah Materi'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Mata Pelajaran</label>
            <Select
              options={mapelOptions}
              value={selectedMapel}
              onChange={(opt) => setSelectedMapel(opt)}
              placeholder="Pilih Mata Pelajaran"
              className="text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Nama Materi</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Deskripsi (Opsional)</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black"
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
