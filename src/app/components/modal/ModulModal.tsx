// src\app\components\modal\ModulModal.tsx
'use client';

import { FC, useEffect, useState } from 'react';
import Select from 'react-select';
import { Button } from '../button/Button';
import type { Modul, ModulInput } from '@/app/lib/curriculum/modul';
import { getAllMapel } from '@/app/lib/curriculum/mataPelajaran';
import { getAllEReference } from '@/app/lib/e-reference/api';

interface ModulModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Modul;
  onSubmit: (data: ModulInput, id?: string) => Promise<void>;
}

interface Option {
  value: string;
  label: string;
}

export const ModulModal: FC<ModulModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [mapelOptions, setMapelOptions] = useState<Option[]>([]);
  const [selectedMapel, setSelectedMapel] = useState<Option | null>(null);

  const [eReferenceOptions, setEReferenceOptions] = useState<Option[]>([]);
  const [selectedERef, setSelectedERef] = useState<Option | null>(null);

  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // fetch Mapel
    getAllMapel().then((data) => {
      const options = data.map((m) => ({
        value: m.id,
        label: m.nama,
      }));
      setMapelOptions(options);

      if (initialData) {
        const found = options.find((o) => o.value === initialData.mata_pelajaran_id);
        setSelectedMapel(found || null);
      }
    });

    // fetch E-Reference
    getAllEReference().then((data) => {
      const options = data.map((r) => ({
        value: r.id,
        label: r.judul,
      }));
      setEReferenceOptions(options);

      if (initialData?.e_reference_id) {
        const found = options.find((o) => o.value === initialData.e_reference_id);
        setSelectedERef(found || null);
      }
    });

    // fill other fields
    setNama(initialData?.nama ?? '');
    setDeskripsi(initialData?.deskripsi ?? '');

  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMapel || !nama.trim()) return;

    const payload: ModulInput = {
      mata_pelajaran_id: selectedMapel.value,
      nama: nama.trim(),
      deskripsi: deskripsi.trim() || undefined,
      e_reference_id: selectedERef?.value || undefined,
    };

    await onSubmit(payload, initialData?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg text-black">
        <h2 className="text-xl font-semibold mb-4 text-[#18355E]">
          {initialData ? 'Edit Modul' : 'Tambah Modul'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mata Pelajaran */}
          <div>
            <label className="block mb-1 font-medium">Mata Pelajaran</label>
            <Select
              options={mapelOptions}
              value={selectedMapel}
              onChange={setSelectedMapel}
              placeholder="Pilih Mata Pelajaran"
              isSearchable
              required
            />
          </div>

          {/* Nama Modul */}
          <div>
            <label className="block mb-1 font-medium">Nama Modul</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block mb-1 font-medium">Deskripsi (Opsional)</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* E-Reference */}
          <div>
            <label className="block mb-1 font-medium">Referensi (Opsional)</label>
            <Select
              options={eReferenceOptions}
              value={selectedERef}
              onChange={setSelectedERef}
              placeholder="Pilih E-Reference"
              isSearchable
              isClearable
            />
          </div>

          {/* Buttons */}
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
