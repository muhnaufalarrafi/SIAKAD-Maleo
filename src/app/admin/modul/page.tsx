// src/app/admin/modul/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getAllModul } from '@/app/lib/curriculum/modul';

interface Modul {
  id: string;
  mata_pelajaran_id: string;
  mapel_nama: string;
  nama: string;
  deskripsi?: string;
  e_reference_id?: string;
  reference_judul?: string;
  reference_url?: string;
}

export default function ModulPage() {
  const { token } = useAuth();
  const [modul, setModul] = useState<Modul[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    getAllModul(token)
      .then(data => setModul(data))
      .catch(() => setError('Gagal memuat data modul'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)   return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      <div className="mt-6 bg-white rounded-2xl shadow p-6">
        {/* Header dan Tombol Tambah */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#18355E]">Modul</h3>
          <button
            id="btnAddModul"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow active:scale-95 transition"
          >
            Tambah Modul
          </button>
        </div>

        {/* Tabel Modul */}
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
              {modul.map((m) => (
                <tr key={m.id} className="hover:bg-[#F5F8FF]/60">
                  <td className="py-3 px-4 font-medium text-[#0F2850]">{m.id}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{m.mapel_nama}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{m.nama}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{m.deskripsi ?? '-'}</td>
                  <td className="py-3 px-4 text-[#0F2850]">
                    {m.reference_judul
                      ? <a href={m.reference_url} target="_blank" className="underline">{m.reference_judul}</a>
                      : '-'}
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <button className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
