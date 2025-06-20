// src/app/components/modal/EReferenceModal.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from '../button/Button';
import {
  EReference,
  EReferenceLinkInput,
  EReferenceFileInputForUpdate,
} from '@/app/lib/e-reference/api';
import { getAllPrograms } from '@/app/lib/curriculum/programs';
import { getAllMapel, Mapel } from '@/app/lib/curriculum/mataPelajaran';

export type EReferenceSubmitInput = EReferenceLinkInput | EReferenceFileInputForUpdate;

interface EReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EReference;
  onSubmit: (data: EReferenceSubmitInput, id?: string) => Promise<void>;
}

export const EReferenceModal: FC<EReferenceModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [programId, setProgramId] = useState('');
  const [mapelId, setMapelId] = useState('');
  const [tipe, setTipe] = useState<'file' | 'video' | 'link'>('link');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [isEditingFile, setIsEditingFile] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [programs, setPrograms] = useState<{ id: string; nama: string }[]>([]);
  const [mapels, setMapels] = useState<Mapel[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    getAllPrograms().then(setPrograms);
    getAllMapel().then(setMapels);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setJudul(initialData.judul);
      setDeskripsi(initialData.deskripsi || '');
      setProgramId(initialData.program_id);
      setMapelId(initialData.mata_pelajaran_id);
      setTipe(initialData.tipe);
      setUrl(initialData.tipe === 'file' ? '' : initialData.url);
    } else {
      setJudul('');
      setDeskripsi('');
      setProgramId('');
      setMapelId('');
      setTipe('link');
      setUrl('');
    }
    setFile(null);
    setIsEditingUrl(false);
    setIsEditingFile(false);
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs: Record<string, string> = {};
    if (!judul.trim()) errs.judul = 'Judul wajib diisi';
    if (!programId) errs.program_id = 'Program wajib dipilih';
    if (!mapelId) errs.mata_pelajaran_id = 'Mata pelajaran wajib dipilih';
    if (!tipe) errs.tipe = 'Tipe wajib dipilih';

    if (tipe === 'file') {
      if (!initialData && !file) errs.file = 'File wajib diunggah';
      if (initialData && isEditingFile && !file) errs.file = 'File baru wajib dipilih';
    } else {
      if (!initialData && !url.trim()) errs.url = 'URL wajib diisi';
      if (initialData && isEditingUrl && !url.trim()) errs.url = 'URL wajib diisi';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      const commonFields = {
        judul: judul.trim(),
        deskripsi: deskripsi.trim() || undefined,
        program_id: programId,
        mata_pelajaran_id: mapelId,
      };

      let payload: EReferenceSubmitInput;

      if (tipe === 'file') {
        if (initialData) {
          const match = initialData.url.match(/[-\w]{25,}/);
          const oldFileId = match ? match[0] : undefined;

          if (isEditingFile && file) {
            payload = {
              ...commonFields,
              tipe: 'file',
              file: file,
              url: undefined,
              oldFileId: oldFileId
            };
          } else {
            payload = {
              ...commonFields,
              tipe: 'file',
              file: undefined,
              url: initialData.url
            };
          }
        } else {
          payload = {
            ...commonFields,
            tipe: 'file',
            file: file!,
            url: undefined
          };
        }
      } else {
        payload = {
          ...commonFields,
          tipe: tipe as 'video' | 'link',
          url: initialData && !isEditingUrl ? initialData.url : url.trim(),
        };
      }

      await onSubmit(payload, initialData?.id);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error in EReferenceModal handleSubmit:', err.message);
      } else {
        console.error('Unknown error in EReferenceModal handleSubmit:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-[#18355E]">
          {initialData ? 'Edit E-Reference' : 'Tambah E-Reference'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-[#18355E]">
          {/* Judul */}
          <div>
            <label className="block mb-1 font-medium">
              Judul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={judul}
              onChange={e => setJudul(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
            {errors.judul && <p className="text-red-600 text-sm">{errors.judul}</p>}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block mb-1 font-medium">Deskripsi</label>
            <textarea
              value={deskripsi}
              onChange={e => setDeskripsi(e.target.value)}
              rows={2}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* Program */}
          <div>
            <label className="block mb-1 font-medium">
              Program <span className="text-red-500">*</span>
            </label>
            <select
              value={programId}
              onChange={e => setProgramId(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            >
              <option value="">— Pilih Program —</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
            {errors.program_id && <p className="text-red-600 text-sm">{errors.program_id}</p>}
          </div>

          {/* Mata Pelajaran */}
          <div>
            <label className="block mb-1 font-medium">
              Mata Pelajaran <span className="text-red-500">*</span>
            </label>
            <select
              value={mapelId}
              onChange={e => setMapelId(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            >
              <option value="">— Pilih Mapel —</option>
              {mapels.map(m => (
                <option key={m.id} value={m.id}>{m.nama}</option>
              ))}
            </select>
            {errors.mata_pelajaran_id && <p className="text-red-600 text-sm">{errors.mata_pelajaran_id}</p>}
          </div>

          {/* Tipe */}
          <div>
            <label className="block mb-1 font-medium">
              Tipe <span className="text-red-500">*</span>
            </label>
            <select
              value={tipe}
              onChange={e => setTipe(e.target.value as typeof tipe)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            >
              <option value="file">File</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
            </select>
            {errors.tipe && <p className="text-red-600 text-sm">{errors.tipe}</p>}
          </div>

          {/* URL */}
          {tipe !== 'file' && (
            initialData && !isEditingUrl ? (
              <div className="space-y-2">
                <label className="block mb-1 font-medium">URL Saat Ini</label>
                <a
                  href={initialData.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block underline text-[#18355E]"
                >
                  {initialData.url}
                </a>
                <button
                  type="button"
                  onClick={() => setIsEditingUrl(true)}
                  className="text-sm text-[#F6C443] hover:underline"
                >
                  Ubah URL
                </button>
              </div>
            ) : (
              <div>
                <label className="block mb-1 font-medium">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
                />
                {errors.url && <p className="text-red-600 text-sm">{errors.url}</p>}
              </div>
            )
          )}

          {/* File */}
          {tipe === 'file' && (
            initialData && !isEditingFile ? (
              <div className="space-y-2">
                <label className="block mb-1 font-medium">File Saat Ini</label>
                <a
                  href={initialData.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block underline text-[#18355E]"
                >
                  {initialData.judul}
                </a>
                <button
                  type="button"
                  onClick={() => setIsEditingFile(true)}
                  className="text-sm text-[#F6C443] hover:underline"
                >
                  Ubah File
                </button>
              </div>
            ) : (
              <div>
                <label className="block mb-1 font-medium">
                  Unggah File <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="*"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
                {errors.file && <p className="text-red-600 text-sm">{errors.file}</p>}
              </div>
            )
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-black"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};