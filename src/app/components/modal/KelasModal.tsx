// src/app/components/modal/KelasModal.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from '../button/Button';
import type { Kelas, KelasInput } from '@/app/lib/class/kelas';
import { getAllPrograms, Program } from '@/app/lib/curriculum/programs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Kelas;
  onSubmit: (data: KelasInput, id?: string) => void;
}

export const KelasModal: FC<Props> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit
}) => {
  const [nama, setNama] = useState('');
  const [tingkat, setTingkat] = useState<number>(1);
  const [programId, setProgramId] = useState('');
  const [tahunAjaran, setTahunAjaran] = useState('');
  const [programs, setPrograms] = useState<Program[]>([]);

  // load semua program sekali saja
  useEffect(() => {
    getAllPrograms()
      .then(list => setPrograms(list))
      .catch(err => {
        console.error('Gagal memuat daftar program:', err);
      });
  }, []);

  // when opening or initialData changes, prefill form
  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama);
      setTingkat(initialData.tingkat);
      setProgramId(initialData.program_id);
      setTahunAjaran(initialData.tahun_ajaran);
    } else {
      setNama('');
      setTingkat(1);
      setProgramId('');
      setTahunAjaran('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      {
        nama: nama.trim(),
        tingkat,
        program_id: programId,
        tahun_ajaran: tahunAjaran.trim(),
      },
      initialData?.id
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
        <h2 className="text-xl font-semibold mb-4 text-[#18355E]">
          {initialData ? 'Edit Kelas' : 'Tambah Kelas'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block mb-1 font-medium">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={e => setNama(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* Tingkat */}
          <div>
            <label className="block mb-1 font-medium">Tingkat</label>
            <input
              type="number"
              value={tingkat}
              onChange={e => setTingkat(parseInt(e.target.value, 10) || 1)}
              required
              min={1}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* Program */}
          <div>
            <label className="block mb-1 font-medium">Program</label>
            <select
              value={programId}
              onChange={e => setProgramId(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            >
              <option value="" disabled>— Pilih Program —</option>
              {programs.map(p => (
                <option key={p.id} value={String(p.id)}>
                  {p.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Tahun Ajaran */}
          <div>
            <label className="block mb-1 font-medium">Tahun Ajaran</label>
            <input
              type="text"
              value={tahunAjaran}
              onChange={e => setTahunAjaran(e.target.value)}
              required
              placeholder="contoh: 2023/2024"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* Buttons */}
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
