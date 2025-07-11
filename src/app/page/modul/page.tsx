// src/app/admin/modul/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  getAllModul,
  createModul,
  updateModul,
  deleteModul,
  type Modul
} from '@/app/lib/curriculum/modul';
import { ModulModal } from '@/app/components/modal/ModulModal';

export default function ModulPage() {
  const { user } = useAuth();

  const [modulList, setModulList]       = useState<Modul[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string|null>(null);

  // modal state
  const [isModalOpen, setModalOpen]     = useState(false);
  const [selectedModul, setSelectedModul] = useState<Modul|null>(null);

  // BARU: State untuk menyimpan query pencarian
  const [searchQuery, setSearchQuery] = useState('');

  // fetch all modul
  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllModul();
      setModulList(data);
    } catch {
      setError('Gagal memuat data modul');
    } finally {
      setLoading(false);
    }
  }

  // on mount, after auth
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // BARU: Logika untuk memfilter modul berdasarkan searchQuery
  const filteredModul = modulList.filter(modul =>
    modul.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (modul.mapel_nama && modul.mapel_nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (modul.deskripsi && modul.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user)   return <div className="text-center py-10">Memuat pengguna…</div>;
  if (loading) return <div className="text-center py-10">Loading…</div>;
  if (error)   return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      <div className="mt-6 bg-white rounded-2xl shadow p-6">
        
        {/* DIUBAH: Baris kontrol sekarang berisi input pencarian */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Cari modul, mapel, deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-full text-[#18355E] focus:outline-none focus:ring-2 focus:ring-[#18355E]/50"
            />
          </div>
          <button
            onClick={() => { setSelectedModul(null); setModalOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold whitespace-nowrap"
          >
            Tambah Modul
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#18355E] text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Mapel</th>
                <th className="py-3 px-4 text-left">Nama Modul</th>
                <th className="py-3 px-4 text-left">Deskripsi</th>
                <th className="py-3 px-4 text-left">Referensi</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* DIUBAH: Gunakan 'filteredModul' untuk menampilkan data */}
              {filteredModul.map(m => (
                <tr key={m.id} className="hover:bg-[#F5F8FF]/60">
                  <td className="py-3 px-4 font-medium text-[#0F2850]">{m.id}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{m.mapel_nama}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{m.nama}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{m.deskripsi ?? '-'}</td>
                  <td className="py-3 px-4 text-[#0F2850]">
                    {m.reference_judul
                      ? (
                        <a
                          href={m.reference_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {m.reference_judul}
                        </a>
                      )
                      : '-'}
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => { setSelectedModul(m); setModalOpen(true); }}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Yakin ingin menghapus modul ini?')) {
                          await deleteModul(m.id);
                          loadData();
                        }
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for create/edit */}
      <ModulModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedModul ?? undefined}
        onSubmit={async (data, id) => {
          if (id) await updateModul(id, data);
          else   await createModul(data);
          setModalOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
