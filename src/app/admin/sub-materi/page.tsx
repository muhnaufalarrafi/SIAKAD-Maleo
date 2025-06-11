// src/app/admin/sub-materi/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getAllSubMateri } from '@/app/lib/curriculum/submateri';

interface SubMateri {
  id: string;
  materi_id: string;
  nama: string;
  ketercapaian?: string;
}

export default function SubMateriPage() {
  const { token } = useAuth();
  const [subs, setSubs] = useState<SubMateri[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    getAllSubMateri(token)
      .then(data => setSubs(data))
      .catch(() => setError('Gagal memuat data sub materi'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      <div className="mt-6 bg-white rounded-2xl shadow p-6">
        {/* Header dan Tombol Tambah */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#18355E]">Sub Materi</h3>
          <button
            id="btnAddSubMateri"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow active:scale-95 transition"
          >
            Tambah Sub Materi
          </button>
        </div>

        {/* Tabel Sub Materi */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#18355E] text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Materi ID</th>
                <th className="py-3 px-4 text-left">Nama</th>
                <th className="py-3 px-4 text-left">Ketercapaian</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subs.map((s) => (
                <tr key={s.id} className="hover:bg-[#F5F8FF]/60">
                  <td className="py-3 px-4 font-medium text-[#0F2850]">{s.id}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{s.materi_id}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{s.nama}</td>
                  <td className="py-3 px-4 text-[#0F2850]">{s.ketercapaian ?? '-'}</td>
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
