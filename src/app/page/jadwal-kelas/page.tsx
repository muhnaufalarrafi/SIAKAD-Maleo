// src/app/page/jadwal-kelas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  getAllJadwal,
  createJadwal,
  updateJadwal,
  deleteJadwal,
  JadwalKelas,
  JadwalKelasInput
} from '@/app/lib/class/jadwalKelas';
import { Button } from '@/app/components/button/Button';
import { JadwalKelasModal } from '@/app/components/modal/JadwalKelasModal';
import { getAllMapel, Mapel } from '@/app/lib/curriculum/mataPelajaran';
import { getAllTutors, Tutor } from '@/app/lib/users/tutor';
import { getAllKelas, Kelas } from '@/app/lib/class/kelas';


export default function JadwalKelasPage() {
  const { user } = useAuth();
  const [jadwals, setJadwals] = useState<JadwalKelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapels, setMapels] = useState<Mapel[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);


  // modal state
  const [isModalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<JadwalKelas | null>(null);

  // fetch data
const refresh = async () => {
  setLoading(true);
  setError(null);
  try {
    const [jadwalData, mapelData, tutorData, kelasData] = await Promise.all([
      getAllJadwal(),
      getAllMapel(),
      getAllTutors(),
      getAllKelas()
    ]);
    setJadwals(jadwalData);
    setMapels(mapelData);
    setTutors(tutorData);
    setKelasList(kelasData);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    setError(msg);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!user) return;
    refresh();
  }, [user]);

  if (!user) return <div className="text-center py-10">Memuat data pengguna…</div>;
  if (loading) return <div className="text-center py-10">Loading…</div>;
  if (error)   return <div className="text-center py-10 text-red-600">{error}</div>;

  // handlers
  const handleAdd = () => {
    setSelected(null);
    setModalOpen(true);
  };
  const handleEdit = (j: JadwalKelas) => {
    setSelected(j);
    setModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus jadwal ini?')) return;
    try {
      await deleteJadwal(id);
      refresh();
    } catch {
      alert('Gagal menghapus jadwal');
    }
  };
  const handleSubmit = async (data: JadwalKelasInput, id?: string) => {
    if (id) {
      await updateJadwal(id, data);
    } else {
      await createJadwal(data);
    }
    setModalOpen(false);
    refresh();
  };

  const getMapelName = (id: string) => mapels.find(m => m.id === id)?.nama || '-';
  const getTutorName = (id: string) => tutors.find(t => t.id === id)?.nama_lengkap || '-';
  const getKelasName = (id?: string) => {
    if (!id) return '-';
    return kelasList.find(k => k.id === id)?.nama || '-'; 
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#18355E]">Jadwal Kelas</h1>
        <Button onClick={handleAdd}>+ Tambah Jadwal</Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow p-6">
        <table className="min-w-full text-sm">
          <thead className="bg-[#18355E] text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Hari</th>
              <th className="py-3 px-4 text-left">Jam Mulai</th>
              <th className="py-3 px-4 text-left">Jam Selesai</th>
              <th className="py-3 px-4 text-left">Tempat</th>
              <th className="py-3 px-4 text-left">Keterangan</th>
              <th className="py-3 px-4 text-left">Mata Pelajaran</th>
              <th className="py-3 px-4 text-left">Tutor</th>
              <th className="py-3 px-4 text-left">Kelas</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jadwals.map((j, i) => (
              <tr key={j.id} className="hover:bg-[#F5F8FF]/60 text-[#18355E]">
                <td className="py-3 px-4">{i + 1}</td>
                <td className="py-3 px-4">{j.hari}</td>
                <td className="py-3 px-4">{j.jam_mulai}</td>
                <td className="py-3 px-4">{j.jam_selesai}</td>
                <td className="py-3 px-4">{j.tempat ?? '-'}</td>
                <td className="py-3 px-4">{j.keterangan ?? '-'}</td>
                <td className="py-3 px-4">{getMapelName(j.mata_pelajaran_id)}</td>
                <td className="py-3 px-4">{getTutorName(j.tutor_id)}</td>
                <td className="py-3 px-4">{getKelasName(j.kelas_id)}</td>
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                    onClick={() => handleEdit(j)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                    onClick={() => handleDelete(j.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <JadwalKelasModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selected ?? undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
