// src/app/components/modal/KelasSiswaModal.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from '../button/Button';
import type { KelasSiswa, KelasSiswaInput } from '@/app/lib/class/kelasSiswa';
import { getAllKelas, Kelas } from '@/app/lib/class/kelas';
import { getAllSiswa, Siswa } from '@/app/lib/users/siswa';

interface KelasSiswaModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Jika edit, kirim data awal */
  initialData?: KelasSiswa;
  /** panggil createKelasSiswa/updateKelasSiswa */
  onSubmit: (data: KelasSiswaInput, id?: string) => Promise<void>;
}

export const KelasSiswaModal: FC<KelasSiswaModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [kelasOptions, setKelasOptions] = useState<Kelas[]>([]);
  const [siswaOptions, setSiswaOptions] = useState<Siswa[]>([]);
  const [loadingOpts, setLoadingOpts] = useState(true);

  const [kelasFilter, setKelasFilter] = useState('');
  const [siswaFilter, setSiswaFilter] = useState('');

  const [kelasId, setKelasId] = useState(initialData?.kelas_id ?? '');
  const [selectedSiswaIds, setSelectedSiswaIds] = useState<string[]>(
    initialData ? [initialData.siswa_id] : []
  );

  // Ambil opsi kelas & siswa saat modal dibuka
  useEffect(() => {
    if (!isOpen) return;
    setLoadingOpts(true);
    Promise.all([getAllKelas(), getAllSiswa()])
      .then(([kls, sis]) => {
        setKelasOptions(kls);
        setSiswaOptions(sis);
      })
      .finally(() => setLoadingOpts(false));
  }, [isOpen]);

  // Reset form ketika modal dibuka/tutup atau data awal berubah
  useEffect(() => {
    setKelasId(initialData?.kelas_id ?? '');
    setSelectedSiswaIds(initialData ? [initialData.siswa_id] : []);
    setKelasFilter('');
    setSiswaFilter('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const filteredKelas = kelasOptions.filter(k =>
    k.nama.toLowerCase().includes(kelasFilter.toLowerCase()) ||
    k.tahun_ajaran.includes(kelasFilter)
  );
  const filteredSiswa = siswaOptions.filter(s =>
    s.nama_lengkap.toLowerCase().includes(siswaFilter.toLowerCase()) ||
    s.nis.includes(siswaFilter)
  );

  const addSiswa = (id: string) => {
    if (!selectedSiswaIds.includes(id)) {
      setSelectedSiswaIds([...selectedSiswaIds, id]);
    }
  };
  const removeSiswa = (id: string) => {
    setSelectedSiswaIds(selectedSiswaIds.filter(x => x !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      // mode edit: update siswa pertama saja
      const sid = selectedSiswaIds[0] ?? '';
      await onSubmit({ kelas_id: kelasId, siswa_id: sid }, initialData.id);
    } else {
      // mode create: buat satu record per siswa terpilih
      await Promise.all(
        selectedSiswaIds.map(sid =>
          onSubmit({ kelas_id: kelasId, siswa_id: sid })
        )
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg text-black max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-[#18355E]">
          {initialData ? 'Edit Penugasan' : 'Tambah Penugasan'}
        </h2>

        {loadingOpts ? (
          <div className="text-center py-10">Loading opsi…</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pencarian & Pilih Kelas */}
            <div>
              <label className="block mb-1 font-medium">Cari Kelas</label>
              <input
                type="text"
                placeholder="Ketik nama atau tahun ajaran"
                value={kelasFilter}
                onChange={e => setKelasFilter(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-2 focus:ring-2 focus:ring-[#18355E]"
              />
              <ul className="max-h-32 overflow-y-auto border rounded">
                {filteredKelas.map(k => (
                  <li key={k.id}>
                    <label className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100">
                      <input
                        type="radio"
                        name="kelas"
                        value={k.id}
                        checked={kelasId === k.id}
                        onChange={() => setKelasId(k.id)}
                        required
                      />
                      <span>
                        {k.nama} (Tingkat {k.tingkat}, {k.tahun_ajaran})
                      </span>
                    </label>
                  </li>
                ))}
                {filteredKelas.length === 0 && (
                  <li className="px-2 py-1 text-gray-500">Tidak ada kelas</li>
                )}
              </ul>
            </div>

            {/* Pencarian & Pilih Siswa (multi) */}
            <div>
              <label className="block mb-1 font-medium">Cari Siswa</label>
              <input
                type="text"
                placeholder="Ketik nama atau NIS"
                value={siswaFilter}
                onChange={e => setSiswaFilter(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-2 focus:ring-2 focus:ring-[#18355E]"
              />
              <ul className="max-h-40 overflow-y-auto border rounded space-y-1 p-1">
                {filteredSiswa.map(s => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => addSiswa(s.id)}
                      className="flex w-full items-center justify-between px-2 py-1 hover:bg-gray-100"
                    >
                      <span>{s.nama_lengkap} ({s.nis})</span>
                      {!selectedSiswaIds.includes(s.id) && (
                        <span className="text-green-600">＋</span>
                      )}
                    </button>
                  </li>
                ))}
                {filteredSiswa.length === 0 && (
                  <li className="px-2 py-1 text-gray-500">Tidak ada siswa</li>
                )}
              </ul>

              {/* Chips siswa terpilih */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSiswaIds.map(id => {
                  const s = siswaOptions.find(x => x.id === id);
                  return s ? (
                    <span
                      key={id}
                      className="flex items-center gap-1 bg-[#F0F0F0] px-2 py-1 rounded-full text-sm"
                    >
                      {s.nama_lengkap}
                      <button
                        type="button"
                        onClick={() => removeSiswa(id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            {/* Tombol aksi */}
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
        )}
      </div>
    </div>
  );
};
