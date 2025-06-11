// src/app/admin/materi/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getAllMateri } from '@/app/lib/curriculum/materi';

interface Materi {
  id: string;
  mata_pelajaran_id: string;
  nama: string;
  deskripsi?: string;
}

export default function MateriPage() {
  const { token } = useAuth();
  const [materi, setMateri] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    getAllMateri(token)
      .then(data => setMateri(data))
      .catch(() => setError('Gagal memuat data materi'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      <div className="mt-6 bg-white rounded-2xl shadow p-6">
        {/* Header dan Tombol Tambah */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#18355E]">Materi</h3>
          <button
            id="btnAddMateri"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow active:scale-95 transition"
          >
            Tambah Materi
          </button>
        </div>

        {/* Tabel Materi */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#18355E] text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Mata Pelajaran ID</th>
                <th className="py-3 px-4 text-left">Nama</th>
                <th className="py-3 px-4 text-left">Deskripsi</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {materi.map((m) => (
                <tr key={m.id} className="hover:bg-[#F5F8FF]/60">
                  <td className="py-3 px-4 font-medium text-[#0F2850]">{m.id}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{m.mata_pelajaran_id}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{m.nama}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{m.deskripsi ?? '-'}</td>
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
