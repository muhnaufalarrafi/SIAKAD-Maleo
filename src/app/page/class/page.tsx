// src/app/admin/class/page.tsx
'use client';

import { useEffect, useState, useCallback  } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  getAllKelas,
  createKelas,
  updateKelas,
  deleteKelas,
  Kelas as KelasType,
} from '@/app/lib/class/kelas';
import {
  getAllKelasSiswa,
  createKelasSiswa,
  updateKelasSiswa,
  deleteKelasSiswa,
  KelasSiswa as KelasSiswaType,
} from '@/app/lib/class/kelasSiswa';
import { getAllPrograms, Program } from '@/app/lib/curriculum/programs';
import ClassTabs from '@/app/components/ClassTabs';
import { KelasModal } from '@/app/components/modal/KelasModal';
import { KelasSiswaModal } from '@/app/components/modal/KelasSiswaModal';

export default function ClassPage() {
  const { user } = useAuth();

  // tabs & data
  const [activeTab, setActiveTab]     = useState<'kelas'|'assignment'>('kelas');
  const [kelasList, setKelasList]     = useState<KelasType[]>([]);
  const [assignList, setAssignList]   = useState<KelasSiswaType[]>([]);
  const [programs, setPrograms]       = useState<Program[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string|null>(null);

  // modal Kelas
  const [isKelasModalOpen, setKelasModalOpen]   = useState(false);
  const [selectedKelas, setSelectedKelas]       = useState<KelasType|null>(null);
  // modal Penugasan
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAssign, setSelectedAssign]     = useState<KelasSiswaType|null>(null);

  // Ambil daftar program sekali saja
  useEffect(() => {
    if (!user) return;
    getAllPrograms()
      .then(setPrograms)
      .catch(() => { /* optional error handling */ });
  }, [user]);

  // loadData sesuai tab
  // loadData sesuai tab, dibungkus useCallback agar stabil
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'kelas') {
        setKelasList(await getAllKelas());
      } else {
        setAssignList(await getAllKelasSiswa());
      }
    } catch {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // reload setiap user siap atau loadData berubah
  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, loadData]);

  if (!user)   return <div className="text-center py-10">Memuat data pengguna…</div>;
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)   return <div className="text-center py-10 text-red-600">{error}</div>;

  // definisi header untuk masing-masing tabel
  const kelasColumns = [
    { key: 'id',      label: 'ID',           align: 'text-left' },
    { key: 'nama',    label: 'Nama',         align: 'text-left' },
    { key: 'tingkat', label: 'Tingkat',      align: 'text-left' },
    { key: 'program', label: 'Program',      align: 'text-left' },
    { key: 'tahun',   label: 'Tahun Ajaran', align: 'text-left' },
    { key: 'aksi',    label: 'Aksi',         align: 'text-center' },
  ];

  const assignColumns = [
    { key: 'id',       label: 'ID',       align: 'text-left' },
    { key: 'kelas_id', label: 'Kelas ID', align: 'text-left' },
    { key: 'siswa_id', label: 'Siswa ID', align: 'text-left' },
    { key: 'aksi',     label: 'Aksi',     align: 'text-center' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      <ClassTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* === PANEL DATA KELAS === */}
      {activeTab === 'kelas' && (
        <div className="mt-6 bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#18355E]">Data Kelas</h3>
            <button
              onClick={() => { setSelectedKelas(null); setKelasModalOpen(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow active:scale-95 transition"
            >
              Tambah Kelas
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#18355E] text-white">
                <tr>
                  {kelasColumns.map(col => (
                    <th key={col.key} className={`py-3 px-4 ${col.align}`}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#0F2850]">
                {kelasList.map(k => {
                  const prog = programs.find(p => String(p.id) === String(k.program_id));
                  const cells = [
                    <td key="id"      className="py-3 px-4">{k.id}</td>,
                    <td key="nama"    className="py-3 px-4">{k.nama}</td>,
                    <td key="tingkat" className="py-3 px-4">{k.tingkat}</td>,
                    <td key="program" className="py-3 px-4">{prog?.nama ?? k.program_id}</td>,
                    <td key="tahun"   className="py-3 px-4">{k.tahun_ajaran}</td>,
                    <td key="aksi"    className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => { setSelectedKelas(k); setKelasModalOpen(true); }}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs"
                      >Edit</button>
                      <button
                        onClick={async () => {
                          if (confirm('Yakin ingin menghapus?')) {
                            await deleteKelas(k.id);
                            loadData();
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                      >Hapus</button>
                    </td>,
                  ];
                  return <tr key={k.id} className="hover:bg-[#F5F8FF]/60">{cells}</tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === PANEL PENUGASAN SISWA === */}
      {activeTab === 'assignment' && (
        <div className="mt-6 bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#18355E]">Penugasan Siswa</h3>
            <button
              onClick={() => { setSelectedAssign(null); setAssignModalOpen(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow active:scale-95 transition"
            >
              Tugaskan Siswa
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#18355E] text-white">
                <tr>
                  {assignColumns.map(col => (
                    <th key={col.key} className={`py-3 px-4 ${col.align}`}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#0F2850]">
                {assignList.map(a => {
                  const cells = [
                    <td key="id"      className="py-3 px-4">{a.id}</td>,
                    <td key="kelas_id" className="py-3 px-4">{a.kelas_id}</td>,
                    <td key="siswa_id" className="py-3 px-4">{a.siswa_id}</td>,
                    <td key="aksi"     className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => { setSelectedAssign(a); setAssignModalOpen(true); }}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs"
                      >Edit</button>
                      <button
                        onClick={async () => {
                          if (confirm('Yakin ingin menghapus?')) {
                            await deleteKelasSiswa(a.id);
                            loadData();
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                      >Hapus</button>
                    </td>,
                  ];
                  return <tr key={a.id} className="hover:bg-[#F5F8FF]/60">{cells}</tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <KelasModal
        isOpen={isKelasModalOpen}
        onClose={() => setKelasModalOpen(false)}
        initialData={selectedKelas ?? undefined}
        onSubmit={async (data, id) => {
          if (id) await updateKelas(id, data);
          else   await createKelas(data);
          setKelasModalOpen(false);
          loadData();
        }}
      />

      <KelasSiswaModal
        isOpen={isAssignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        initialData={selectedAssign ?? undefined}
        onSubmit={async (data, id) => {
          if (id) await updateKelasSiswa(id, data);
          else   await createKelasSiswa(data);
          setAssignModalOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
