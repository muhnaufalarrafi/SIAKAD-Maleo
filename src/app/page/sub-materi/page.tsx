// src/app/admin/sub-materi/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  getAllSubMateri,
  createSubMateri,
  updateSubMateri,
  deleteSubMateri,
  SubMateri as SubMateriType,
  SubMateriInput
} from '@/app/lib/curriculum/submateri';
import { SubMateriModal } from '@/app/components/modal/SubMateriModal';

export default function SubMateriPage() {
  const { user } = useAuth();
  const [subs, setSubs] = useState<SubMateriType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editSub, setEditSub] = useState<SubMateriType | null>(null);

  const fetchSubs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllSubMateri();
      setSubs(data);
    } catch {
      setError('Gagal memuat data sub materi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchSubs();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Sedang memuat data pengguna…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      <div className="mt-6 bg-white rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#18355E]">Sub Materi</h3>
          <button
            id="btnAddSubMateri"
            onClick={() => {
              setEditSub(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow active:scale-95 transition"
          >
            Tambah Sub Materi
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading…</div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm bg-white rounded-3xl shadow ring-1 ring-[#18355E]/20">
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
                    <td className="py-3 px-4 text-[#0F2850]">{s.ketercapaian || '-'}</td>
                    <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditSub(s);
                          setModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Hapus sub materi "${s.nama}"?`)) {
                            try {
                              await deleteSubMateri(s.id);
                              await fetchSubs();
                            } catch {
                              alert('Gagal menghapus sub materi');
                            }
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
      </div>

      {/* Modal Tambah/Edit */}
      <SubMateriModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editSub || undefined}
        onSubmit={async (data: SubMateriInput, id?: string) => {
          try {
            if (id) {
              await updateSubMateri(id, data);
            } else {
              await createSubMateri(data);
            }
            await fetchSubs();
            setModalOpen(false);
          } catch {
            alert('Gagal menyimpan sub materi');
          }
        }}
      />
    </div>
  );
}
