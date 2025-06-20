// src\app\page\siswa-tutor\page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  getAllSiswa,
  createSiswa,
  updateSiswa,
  deleteSiswa,
  Siswa as SiswaType,
} from '@/app/lib/users/siswa';
import {
  getAllTutors,
  createTutor,
  updateTutor,
  deleteTutor,
  Tutor as TutorType,
  TutorInput
} from '@/app/lib/users/tutor';
import UserTabs from '@/app/components/UserTabs';
import { SiswaModal } from '@/app/components/modal/SiswaModal';
import { TutorModal } from '@/app/components/modal/TutorModal';

export default function UsersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'siswa'|'tutor'>('siswa');
  const [siswaList, setSiswaList] = useState<SiswaType[]>([]);
  const [tutorList, setTutorList] = useState<TutorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const [isSiswaModalOpen, setSiswaModalOpen] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<SiswaType|null>(null);

  const [isTutorModalOpen, setTutorModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<TutorType|null>(null);

  const fetchData = useCallback(async () => {
     setLoading(true);
     setError(null);
     try {
       if (activeTab === 'siswa') {
         setSiswaList(await getAllSiswa());
       } else {
         setTutorList(await getAllTutors());
       }
     } catch {
       setError('Gagal memuat data');
     } finally {
       setLoading(false);
     }
  }, [activeTab]);


  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, fetchData]);

  if (!user) {
    return <div className="flex items-center justify-center h-screen"><p>Loading user…</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      <UserTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {loading ? (
        <div className="text-center py-10">Loading…</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : activeTab === 'siswa' ? (
        <div className="mt-6 bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#18355E]">Data Siswa</h3>
            <button
              onClick={() => { setSelectedSiswa(null); setSiswaModalOpen(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold"
            >
              Tambah Siswa
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm bg-white rounded-3xl shadow">
              <thead className="bg-[#18355E] text-white">
                <tr>
                  <th className="py-3 px-4 text-left align-middle">ID</th>
                  <th className="py-3 px-4 text-left align-middle">User ID</th>
                  <th className="py-3 px-4 text-left align-middle">NIS</th>
                  <th className="py-3 px-4 text-left align-middle">Nama</th>
                  <th className="py-3 px-4 text-left align-middle">Kelas</th>
                  <th className="py-3 px-4 text-left align-middle">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {siswaList.map(s => (
                  <tr key={s.id} className="hover:bg-[#F5F8FF]/60 text-[#0F2850]">
                    <td className="py-3 px-4 text-left align-middle">{s.id}</td>
                    <td className="py-3 px-4 text-left align-middle">{s.user_id}</td>
                    <td className="py-3 px-4 text-left align-middle">{s.nis}</td>
                    <td className="py-3 px-4 text-left align-middle">{s.nama_lengkap}</td>
                    <td className="py-3 px-4 text-left align-middle">{s.kelas ?? '-'}</td>
                    <td className="py-3 px-4 text-left align-middle text-center space-x-2">
                      <button
                        onClick={() => { setSelectedSiswa(s); setSiswaModalOpen(true); }}
                        className="px-3 py-1.5 bg-emerald-500 text-white rounded text-xs"
                      >Edit</button>
                      <button
                        onClick={async () => {
                          if (confirm(`Hapus siswa "${s.nama_lengkap}"?`)) {
                            await deleteSiswa(s.id);
                            await fetchData();
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white rounded text-xs"
                      >Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#18355E]">Data Tutor</h3>
            <button
              onClick={() => { setSelectedTutor(null); setTutorModalOpen(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold"
            >
              Tambah Tutor
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm bg-white rounded-3xl shadow">
              <thead className="bg-[#18355E] text-white">
                <tr>
                  <th className="py-3 px-4 text-left align-middle">ID</th>
                  <th className="py-3 px-4 text-left align-middle">User ID</th>
                  <th className="py-3 px-4 text-left align-middle">Nama Lengkap</th>
                  <th className="py-3 px-4 text-left align-middle">Jenis Tutor</th>
                  <th className="py-3 px-4 text-left align-middle">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tutorList.map(t => (
                  <tr key={t.id} className="hover:bg-[#F5F8FF]/60 text-[#0F2850]">
                    <td className="py-3 px-4 text-left align-middle">{t.id}</td>
                    <td className="py-3 px-4 text-left align-middle">{t.user_id}</td>
                    <td className="py-3 px-4 text-left align-middle">{t.nama_lengkap}</td>
                    <td className="py-3 px-4 text-left align-middle">{t.jenis_tutor}</td>
                    <td className="py-3 px-4 text-left align-middle text-center space-x-2">
                      <button
                        onClick={() => { setSelectedTutor(t); setTutorModalOpen(true); }}
                        className="px-3 py-1.5 bg-emerald-500 text-white rounded text-xs"
                      >Edit</button>
                      <button
                        onClick={async () => {
                          if (confirm(`Hapus tutor "${t.nama_lengkap}"?`)) {
                            await deleteTutor(t.id);
                            await fetchData();
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white rounded text-xs"
                      >Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    <SiswaModal
      isOpen={isSiswaModalOpen}
      onClose={() => setSiswaModalOpen(false)}
      initialData={selectedSiswa ?? undefined}
      onSubmit={async (data, id) => {
        if (id) {
          await updateSiswa(id, data);   // data sudah cocok SiswaInput
        } else {
          await createSiswa(data);
        }
        setSiswaModalOpen(false);
        await fetchData();
      }}
    />

      <TutorModal
        isOpen={isTutorModalOpen}
        onClose={() => setTutorModalOpen(false)}
        initialData={selectedTutor || undefined}
        onSubmit={async (data: TutorInput, id?: string) => {
          if (id) await updateTutor(id, data);
          else await createTutor(data);
          setTutorModalOpen(false);
          await fetchData();
        }}
      />
    </div>
  );
}
