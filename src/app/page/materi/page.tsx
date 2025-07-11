// src/app/admin/materi/page.tsx
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  getAllMateri,
  createMateri,
  updateMateri,
  deleteMateri,
  Materi as MateriType,
  MateriInput,
} from '@/app/lib/curriculum/materi';
import { MateriModal } from '@/app/components/modal/MateriModal';
import TableDesain, { TableDesainColumn } from '@/app/components/TableDesain';

export default function MateriPage() {
  const { user } = useAuth();
  const [materiList, setMateriList] = useState<MateriType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMateri, setSelectedMateri] = useState<MateriType | null>(null);

  // BARU: State untuk menyimpan query pencarian
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMateri = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMateriList(await getAllMateri());
    } catch {
      setError('Gagal memuat data materi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchMateri();
  }, [user, fetchMateri]);

  // BARU: Logika untuk memfilter materi berdasarkan searchQuery
  const filteredMateri = materiList.filter(materi =>
    materi.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (materi.deskripsi && materi.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns: TableDesainColumn<MateriType>[] = useMemo(() => [
    // Kolom ID dan Mapel ID bisa disembunyikan jika tidak relevan untuk user
    // { header: 'ID', accessor: m => m.id }, 
    // { header: 'Mapel ID', accessor: m => m.mata_pelajaran_id },
    { header: '#', accessor: (m, index) => index + 1, className: 'w-12 text-center' },
    { header: 'Nama Materi', accessor: m => m.nama, className: 'font-medium' },
    { header: 'Deskripsi', accessor: m => m.deskripsi || '-', className: 'text-gray-600' },
    {
      header: 'Aksi',
      accessor: m => (
        <div className="flex justify-center space-x-2 whitespace-nowrap">
          <button
            onClick={() => {
              setSelectedMateri(m);
              setModalOpen(true);
            }}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs"
          >
            Edit
          </button>
          <button
            onClick={async () => {
              if (confirm(`Hapus materi "${m.nama}"?`)) {
                try {
                  await deleteMateri(m.id);
                  fetchMateri();
                } catch {
                  alert('Gagal menghapus materi');
                }
              }
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
          >
            Hapus
          </button>
        </div>
      ),
      className: 'text-center'
    },
  ], [fetchMateri]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Sedang memuat data pengguna…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      <div className="mt-6 bg-white rounded-2xl shadow p-6">
        
        {/* DIUBAH: Baris kontrol sekarang berisi input pencarian */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Cari berdasarkan nama materi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-full text-[#18355E] focus:outline-none focus:ring-2 focus:ring-[#18355E]/50"
            />
          </div>
          <button
            onClick={() => {
              setSelectedMateri(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow active:scale-95 transition whitespace-nowrap"
          >
            Tambah Materi
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading…</div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">{error}</div>
        ) : (
          // DIUBAH: Gunakan 'filteredMateri' untuk menampilkan data
          <TableDesain columns={columns} data={filteredMateri} />
        )}
      </div>

      <MateriModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedMateri || undefined}
        onSubmit={async (data: MateriInput, id?: string) => {
          try {
            if (id) await updateMateri(id, data);
            else await createMateri(data);
            fetchMateri();
            setModalOpen(false);
          } catch {
            alert('Gagal menyimpan materi');
          }
        }}
      />
    </div>
  );
}
