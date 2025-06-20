'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Button } from '../button/Button';
import type { SubMateri, SubMateriInput } from '@/app/lib/curriculum/submateri';
import { getAllMateri } from '@/app/lib/curriculum/materi';

interface MateriOption {
  value: string;
  label: string;
}

interface SubMateriModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SubMateri;
  onSubmit: (data: SubMateriInput, id?: string) => void;
}

export const SubMateriModal = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: SubMateriModalProps) => {
  const [materiOptions, setMateriOptions] = useState<MateriOption[]>([]);
  const [selectedMateri, setSelectedMateri] = useState<MateriOption | null>(null);
  const [nama, setNama] = useState('');
  const [ketercapaian, setKetercapaian] = useState('');

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const materiList = await getAllMateri();
        const options = materiList.map((m) => ({
          value: m.id,
          label: m.nama,
        }));
        setMateriOptions(options);

        if (initialData) {
          const found = options.find((opt) => opt.value === initialData.materi_id);
          setSelectedMateri(found || null);
        }
      } catch (err) {
        console.error('Gagal memuat data materi:', err);
      }
    };

    if (isOpen) {
      fetchMateri();
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama);
      setKetercapaian(initialData.ketercapaian || '');
    } else {
      setNama('');
      setKetercapaian('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMateri || !nama.trim()) return;

    const payload: SubMateriInput = {
      materi_id: selectedMateri.value,
      nama: nama.trim(),
      ketercapaian: ketercapaian.trim() || undefined,
    };

    onSubmit(payload, initialData?.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
        <h2 className="text-xl mb-4 font-semibold text-[#18355E]">
          {initialData ? 'Edit Sub Materi' : 'Tambah Sub Materi'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Materi</label>
            <Select
              options={materiOptions}
              value={selectedMateri}
              onChange={(opt) => setSelectedMateri(opt)}
              placeholder="Pilih Materi"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Nama Sub Materi</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#18355E]"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Ketercapaian (Opsional)</label>
            <textarea
              value={ketercapaian}
              onChange={(e) => setKetercapaian(e.target.value)}
              rows={3}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#18355E]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
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
