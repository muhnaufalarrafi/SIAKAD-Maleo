// src\app\page\program\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllPrograms, createProgram, updateProgram, deleteProgram, Program } from '@/app/lib/curriculum/programs';
import { ProgramModal } from '@/app/components/modal/ProgramModal';

const ProgramPage = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Program | null>(null);

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: Program[] = await getAllPrograms();
      setPrograms(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPrograms();
  }, [user]);

  const handleSubmit = async (data: { id?: string; code: string; nama: string; jenjang: string }) => {
    // Pastikan `createProgram` dan `updateProgram` di `programs.ts` menerima tipe ini
    // dan mengembalikan Promise<Program>
    try {
      if (data.id) {
        await updateProgram(data.id, data);
      } else {
        await createProgram(data);
      }
      setModalOpen(false);
      setEditData(null);
      await fetchPrograms();
    } catch (err: unknown) { // Tambahkan penanganan error yang lebih baik
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Gagal menyimpan program: ${msg}`); // Gunakan alert atau setError
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus program ini?')) {
      await deleteProgram(id);
      await fetchPrograms();
    }
  };

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
        <h1 className="text-2xl font-semibold text-[#18355E]">Kelola Program</h1>
        <button
          onClick={() => { setEditData(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow active:scale-95 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Program
        </button>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Memuat daftar program…</div>
      )}

      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-3xl shadow ring-1 ring-[#18355E]/20 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#18355E] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Program ID</th>
                <th className="py-3 px-4 text-left">Kode</th>
                <th className="py-3 px-4 text-left">Nama</th>
                <th className="py-3 px-4 text-left">Jenjang</th>
                <th className="py-3 px-4 text-left">Tanggal Dibuat</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {programs.map((program) => (
                <tr key={program.id} className="hover:bg-[#F5F8FF]/60">
                  <td className="py-3 px-4 font-medium text-[#0F2850]">{program.id}</td>
                  <td className="py-3 px-4 font-medium text-[#0F2850]">{program.code}</td>
                  <td className="py-3 px-4 font-medium text-[#0F2850]">{program.nama}</td>
                  <td className="py-3 px-4 font-medium text-[#0F2850]">{program.jenjang}</td>
                  <td className="py-3 px-4 font-medium text-[#0F2850]">
                    {new Date(program.created_at).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => { setEditData(program); setModalOpen(true); }}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
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

      <ProgramModal
        isOpen={isModalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSubmit={handleSubmit}
        initialData={editData || undefined}
      />
    </div>
  );
};

export default ProgramPage;
