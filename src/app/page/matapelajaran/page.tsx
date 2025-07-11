// src/app/pages/MapelPage.tsx (atau path yang sesuai)
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAllMapel,
  createMapel,
  updateMapel,
  deleteMapel,
  Mapel as MapelType,
  MapelInput,
} from '@/app/lib/curriculum/mataPelajaran';
import { MataPelajaranModal } from '@/app/components/modal/MataPelajaranModal';
import { Button } from '@/app/components/button/Button'; // Menggunakan Button yang konsisten

const MapelPage = () => {
  const { user } = useAuth();
  const [mapelList, setMapelList] = useState<MapelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [editMapel, setEditMapel] = useState<MapelType | null>(null);

  // BARU: State untuk menyimpan query pencarian
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMapel = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMapel();
      setMapelList(data);
    } catch {
      setError('Gagal memuat daftar mata pelajaran');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMapel();
    }
  }, [user]);

  // DIUBAH: Logika untuk memfilter mata pelajaran berdasarkan searchQuery
  const filteredMapel = mapelList.filter(mapel =>
    mapel.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mapel.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (mapel.program_nama && mapel.program_nama.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Sedang memuat data pengguna…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* DIUBAH: Baris kontrol untuk pencarian dan tombol tambah */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-full text-[#18355E] focus:outline-none focus:ring-2 focus:ring-[#18355E]/50"
          />
        </div>
        <Button onClick={() => { setEditMapel(null); setOpen(true); }}>
          Tambah Mata Pelajaran
        </Button>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Memuat daftar mata pelajaran…</div>
      )}

      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-3xl shadow ring-1 ring-[#18355E]/20 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#18355E] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Kode</th>
                <th className="py-3 px-4 text-left">Nama Mata Pelajaran</th>
                <th className="py-3 px-4 text-left">Jenjang</th>
                <th className="py-3 px-4 text-left">Program</th>
                <th className="py-3 px-4 text-left">Tingkat / Kelas</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* DIUBAH: Gunakan 'filteredMapel' untuk me-render tabel */}
              {filteredMapel.map((m) => (
                <tr key={m.id} className="hover:bg-[#F5F8FF]/60">
                  <td className="py-3 px-4 font-medium text-gray-600">{m.code}</td>
                  <td className="py-3 px-4 font-medium text-[#0F2850]">{m.nama}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{m.jenjang}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{m.program_nama}</td>
                  <td className="py-3 px-4 text-[#0F2850]">
                    Kelas {m.tingkat_min} - {m.tingkat_max}
                  </td>
                  <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                      onClick={() => { setEditMapel(m); setOpen(true); }}
                    >
                      Edit
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white text-xs"
                      onClick={async () => {
                        if (confirm(`Hapus mata pelajaran "${m.nama}"?`)) {
                          await deleteMapel(m.id);
                          await fetchMapel();
                        }
                      }}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tambah/Edit */}
      <MataPelajaranModal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        initialData={editMapel || undefined}
        onSubmit={async (data: MapelInput, id?: string) => {
          try {
            if (id) {
              await updateMapel(id, data);
            } else {
              await createMapel(data);
            }
            await fetchMapel();
            setOpen(false);
          } catch {
            alert('Gagal menyimpan data');
          }
        }}
      />
    </div>
  );
};

export default MapelPage;
