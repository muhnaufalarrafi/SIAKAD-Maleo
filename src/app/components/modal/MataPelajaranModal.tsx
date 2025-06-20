// src\app\components\modal\MataPelajaranModal.tsx
'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Button } from '../button/Button';
import type { MapelInput, Mapel } from '@/app/lib/curriculum/mataPelajaran';
import { getAllPrograms, Program } from '@/app/lib/curriculum/programs'; // pastikan path benar

interface ProgramOption {
  value: string;
  label: string;
}

interface MataPelajaranModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Mapel;
  onSubmit: (data: MapelInput, id?: string) => void;
}

export const MataPelajaranModal = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: MataPelajaranModalProps) => {
  const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);
  const [programId, setProgramId] = useState<ProgramOption | null>(null);
  const [code, setCode] = useState('');
  const [nama, setNama] = useState('');
  const [tingkatMin, setTingkatMin] = useState(1);
  const [tingkatMax, setTingkatMax] = useState(6);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
          const res: Program[] = await getAllPrograms();
          // options adalah ProgramOption[]
          const options: ProgramOption[] = res.map((p) => ({
          value: p.id.toString(),
          label: p.nama,
        }));
        setProgramOptions(options);

        if (initialData) {
          const selected = options.find(opt => opt.value === initialData.id.toString());
          setProgramId(selected || null);
        }
      } catch (err) {
        console.error('Gagal mengambil program:', err);
      }
    };

    if (isOpen) fetchPrograms();
  }, [isOpen, initialData]);

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code || '');
      setNama(initialData.nama || '');
      setTingkatMin(initialData.tingkat_min ?? 1);
      setTingkatMax(initialData.tingkat_max ?? 6);
    } else {
      setCode('');
      setNama('');
      setTingkatMin(1);
      setTingkatMax(6);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !code.trim() || !programId) return;

    onSubmit(
      {
        program_id: parseInt(programId.value),
        code: code.trim(),
        nama: nama.trim(),
        tingkat_min: tingkatMin,
        tingkat_max: tingkatMax,
      },
      initialData?.id
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
        <h2 className="text-xl mb-4 font-semibold text-[#18355E]">
          {initialData ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
            <Select
              options={programOptions}
              value={programId}
              onChange={(opt) => setProgramId(opt)}
              placeholder="Pilih Program"
              className="text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#18355E]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#18355E]"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Min</label>
              <input
                type="number"
                value={tingkatMin}
                onChange={(e) => setTingkatMin(parseInt(e.target.value))}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#18355E]"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Max</label>
              <input
                type="number"
                value={tingkatMax}
                onChange={(e) => setTingkatMax(parseInt(e.target.value))}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#18355E]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
