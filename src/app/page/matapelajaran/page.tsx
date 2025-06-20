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

const MapelPage = () => {
  const { user } = useAuth();
  const [mapelList, setMapelList] = useState<MapelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [editMapel, setEditMapel] = useState<MapelType | null>(null);

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
    if (!user) return;
    fetchMapel();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Sedang memuat data pengguna…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#18355E]">Kelola Mata Pelajaran</h1>
        <button
          id="btnAddMapel"
          onClick={() => { setEditMapel(null); setOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow active:scale-95 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Mata Pelajaran
        </button>
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
                <th className="py-3 px-4 text-left">Mapel ID</th>
                <th className="py-3 px-4 text-left">Nama</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mapelList.map((m) => (
                <tr key={m.id} className="hover:bg-[#F5F8FF]/60">
                  <td className="py-3 px-4 font-medium text-[#0F2850]">{m.id}</td>
                  <td className="py-3 px-4 font-medium text-[#0F2850]">{m.nama}</td>
                  <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => { setEditMapel(m); setOpen(true); }}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Hapus mata pelajaran "${m.nama}"?`)) {
                          await deleteMapel(m.id);
                          await fetchMapel();
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
