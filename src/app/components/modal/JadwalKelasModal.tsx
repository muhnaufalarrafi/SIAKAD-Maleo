// src/app/components/modal/JadwalKelasModal.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from '../button/Button';
import type { JadwalKelas, JadwalKelasInput } from '@/app/lib/class/jadwalKelas';
import { getAllMapel, Mapel } from '@/app/lib/curriculum/mataPelajaran';
import { getAllKelas, Kelas } from '@/app/lib/class/kelas';
import { getAllTutors, Tutor } from '@/app/lib/users/tutor';


interface JadwalKelasModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: JadwalKelas;
  onSubmit: (data: JadwalKelasInput, id?: string) => Promise<void>;
}

export const JadwalKelasModal: FC<JadwalKelasModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [mapelList, setMapelList] = useState<Mapel[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [tutorList, setTutorList] = useState<Tutor[]>([]);

  const [mataPelId, setMataPelId] = useState('');
  const [tutorId, setTutorId] = useState('');
  const [hari, setHari] = useState('');
  const [jamMulai, setJamMulai] = useState('');
  const [jamSelesai, setJamSelesai] = useState('');
  const [tempat, setTempat] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [kelasId, setKelasId] = useState('');
  

  useEffect(() => {
    if (!isOpen) return;

  const fetchData = async () => {
    try {
      const mapels = await getAllMapel();
      const kelas = await getAllKelas();
      const tutors = await getAllTutors(); // ambil semua tutor

      setMapelList(mapels);
      setKelasList(kelas);
      setTutorList(tutors); // simpan ke state
    } catch (err) {
      console.error('Gagal memuat dropdown:', err);
    }
  };

    fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setMataPelId(initialData.mata_pelajaran_id);
      setTutorId(initialData.tutor_id);
      setHari(initialData.hari);
      setJamMulai(initialData.jam_mulai);
      setJamSelesai(initialData.jam_selesai);
      setTempat(initialData.tempat ?? '');
      setKeterangan(initialData.keterangan ?? '');
      setKelasId(initialData.kelas_id ?? '');
    } else {
      setMataPelId('');
      setTutorId('');
      setHari('');
      setJamMulai('');
      setJamSelesai('');
      setTempat('');
      setKeterangan('');
      setKelasId('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  await onSubmit(
    {
      mata_pelajaran_id: String(mataPelId ?? '').trim(),
      tutor_id: String(tutorId ?? '').trim(),
      hari: String(hari ?? '').trim(),
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai,
      tempat: String(tempat ?? '').trim() || undefined,
      keterangan: String(keterangan ?? '').trim() || undefined,
      kelas_id: String(kelasId ?? '').trim() || undefined,
    },
    initialData?.id
  );

  onClose();
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg text-black max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-[#18355E]">
          {initialData ? 'Edit Jadwal Kelas' : 'Tambah Jadwal Kelas'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mata Pelajaran Dropdown */}
          <div>
            <label className="block mb-1 font-medium">Mata Pelajaran</label>
            <select
              value={mataPelId}
              onChange={(e) => setMataPelId(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            >
              <option value="">-- Pilih Mata Pelajaran --</option>
              {mapelList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Tutor ID */}
          <div>
            <label className="block mb-1 font-medium">Tutor</label>
            <select
              value={tutorId}
              onChange={(e) => setTutorId(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            >
              <option value="">-- Pilih Tutor --</option>
              {tutorList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nama_lengkap} ({t.jenis_tutor})
                </option>
              ))}
            </select>
          </div>

          {/* Hari */}
          <div>
            <label className="block mb-1 font-medium">Hari</label>
            <input
              type="text"
              value={hari}
              onChange={(e) => setHari(e.target.value)}
              required
              placeholder="Senin, Selasa, dst"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* Jam Mulai dan Selesai */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Jam Mulai</label>
              <input
                type="time"
                value={jamMulai}
                onChange={(e) => setJamMulai(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Jam Selesai</label>
              <input
                type="time"
                value={jamSelesai}
                onChange={(e) => setJamSelesai(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
              />
            </div>
          </div>

          {/* Tempat */}
          <div>
            <label className="block mb-1 font-medium">Tempat (opsional)</label>
            <input
              type="text"
              value={tempat}
              onChange={(e) => setTempat(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* Keterangan */}
          <div>
            <label className="block mb-1 font-medium">Keterangan (opsional)</label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={2}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* Kelas Dropdown */}
          <div>
            <label className="block mb-1 font-medium">Kelas (opsional)</label>
            <select
              value={kelasId}
              onChange={(e) => setKelasId(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            >
              <option value="">-- Pilih Kelas --</option>
              {kelasList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama} (Tingkat {k.tingkat})
                </option>
              ))}
            </select>
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
            <Button type="submit">{initialData ? 'Update' : 'Simpan'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
