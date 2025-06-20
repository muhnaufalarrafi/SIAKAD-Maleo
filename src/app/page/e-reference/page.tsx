// src\app\page\e-reference\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  getAllEReference,
  createEReference,
  updateEReference,
  deleteEReference,
  uploadEReferenceFile,
  EReference,
  EReferenceLinkInput,
  EReferenceFileInput,
  
} from '@/app/lib/e-reference/api';
import { EReferenceModal } from '@/app/components/modal/EReferenceModal';

export default function EReferencePage() {
  const { user } = useAuth();

  const [refs, setRefs] = useState<EReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRef, setSelectedRef] = useState<EReference | null>(null);

  const loadRefs = async () => {
    setLoading(true);
    try {
      const data = await getAllEReference();
      setRefs(data);
      setError(null);
    } catch {
      setError('Gagal memuat data e-reference');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadRefs();
  }, [user]);

  const isRole = (roleName: string): boolean =>
    user?.roles?.some((r) => r.name.toLowerCase() === roleName.toLowerCase()) ?? false;

  const isAdmin = isRole('admin') || isRole('superadmin');
  const isTutor = isRole('tutor');

  const isOwner = (ref: EReference) =>
    isAdmin || (isTutor && ref.uploaded_by_user_id === user?.id);

  const handleAdd = () => {
    setSelectedRef(null);
    setModalOpen(true);
  };

  const handleEdit = (ref: EReference) => {
    setSelectedRef(ref);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus reference ini?')) return;
    try {
      await deleteEReference(id);
      await loadRefs();
    } catch {
      alert('Gagal menghapus reference');
    }
  };

  const handleSubmit = async (
    data: EReferenceLinkInput | EReferenceFileInput,
    id?: string
  ) => {
    try {
      if (id) {
        // UPDATE
        if ('file' in data && data.file && selectedRef) {
          const match = selectedRef.url.match(/[-\w]{25,}/); // ambil fileId dari Google Drive URL
          const oldFileId = match ? match[0] : undefined;
          await updateEReference(id, { ...data, oldFileId });
        } else {
          await updateEReference(id, data as EReferenceLinkInput);
        }
      } else {
        // CREATE
        if ('file' in data && data.file) {
          await uploadEReferenceFile(data as EReferenceFileInput);
        } else {
          await createEReference(data as EReferenceLinkInput);
        }
      }
      setModalOpen(false);
      await loadRefs();
    } catch (err: unknown) { // Ganti 'any' dengan 'unknown'
      const msg =
        err instanceof Error && err.message // Lakukan type narrowing
          ? err.message
          : 'Gagal menyimpan reference';
      alert(msg);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#18355E]">E-Reference</h1>
        {(isAdmin || isTutor) && (
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443]
              hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow transition
              active:scale-95"
            onClick={handleAdd}
          >
            + Tambah
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {refs.map((ref) => (
          <div key={ref.id} className="bg-white rounded-2xl shadow p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-[#18355E]">{ref.judul}</h3>
            {ref.deskripsi && (
              <p className="mt-2 text-gray-600 flex-1">{ref.deskripsi}</p>
            )}
            <p className="mt-4 text-sm text-gray-500">
              Program: {ref.program_nama || '-'} • Mapel: {ref.mapel_nama || '-'}
            </p>

            <div className="mt-4 flex items-center flex-wrap gap-4">
              <span className="uppercase text-sm font-semibold text-[#F6C443]">
                {ref.tipe}
              </span>
              <a
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#F6C443] font-semibold underline"
              >
                Buka
              </a>
              {isOwner(ref) && (
                <>
                  <button
                    className="text-emerald-600 hover:text-emerald-700 font-semibold"
                    onClick={() => handleEdit(ref)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-700 font-semibold"
                    onClick={() => handleDelete(ref.id)}
                  >
                    Hapus
                  </button>
                </>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Upload by: {ref.tutor_nama || '-'}
            </p>
          </div>
        ))}
      </div>

      <EReferenceModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedRef ?? undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
