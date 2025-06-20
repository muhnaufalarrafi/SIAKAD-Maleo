// src/app/components/modal/TutorModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '../button/Button';
import type { TutorInput } from '@/app/lib/users/tutor';
import { getAllTutorUsers, UserWithRoles } from '@/app/lib/rbac/users';

interface TutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    user_id: string | null;
    nama_lengkap: string;
    jenis_tutor: 'guru' | 'relawan';
    no_hp?: string;
    email_pribadi?: string;
    alamat?: string;
    nomor_identitas?: string;
    bidang_keahlian?: string;
  };
  onSubmit: (data: TutorInput & { user_id?: string | null }, id?: string) => void;
}

type TutorType = 'guru' | 'relawan';

export const TutorModal = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: TutorModalProps) => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [jenisTutor, setJenisTutor] = useState<TutorType>('guru');
  const [noHp, setNoHp] = useState('');
  const [emailPribadi, setEmailPribadi] = useState('');
  const [alamat, setAlamat] = useState('');
  const [nomorIdentitas, setNomorIdentitas] = useState('');
  const [bidangKeahlian, setBidangKeahlian] = useState('');

  // muat daftar tutor‐user sekali saat modal dibuka
  useEffect(() => {
    if (!isOpen) return;
    getAllTutorUsers().then(setUsers).catch(console.error);
  }, [isOpen]);

  // set nilai form saat open / edit
  useEffect(() => {
    if (!initialData) {
      setUserId(null);
      setNamaLengkap('');
      setJenisTutor('guru');
      setNoHp('');
      setEmailPribadi('');
      setAlamat('');
      setNomorIdentitas('');
      setBidangKeahlian('');
    } else {
      setUserId(initialData.user_id);
      setNamaLengkap(initialData.nama_lengkap);
      setJenisTutor(initialData.jenis_tutor);
      setNoHp(initialData.no_hp || '');
      setEmailPribadi(initialData.email_pribadi || '');
      setAlamat(initialData.alamat || '');
      setNomorIdentitas(initialData.nomor_identitas || '');
      setBidangKeahlian(initialData.bidang_keahlian || '');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      {
        // user_id boleh null atau empty
        user_id: userId,
        nama_lengkap: namaLengkap.trim(),
        jenis_tutor: jenisTutor,
        no_hp: noHp.trim() || undefined,
        email_pribadi: emailPribadi.trim() || undefined,
        alamat: alamat.trim() || undefined,
        nomor_identitas: nomorIdentitas.trim() || undefined,
        bidang_keahlian: bidangKeahlian.trim() || undefined,
      },
      initialData?.id
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg text-black">
        <h2 className="text-xl mb-4 font-semibold text-[#18355E]">
          {initialData ? 'Edit Tutor' : 'Tambah Tutor'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User selector (opsional) */}
          <div>
            <label className="block mb-1 font-medium">User (tutor)</label>
            <select
              value={userId ?? ''}
              onChange={e => setUserId(e.target.value || null)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            >
              <option value="">— (opsional) —</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
            </select>
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block mb-1 font-medium">Nama Lengkap</label>
            <input
              type="text"
              value={namaLengkap}
              onChange={e => setNamaLengkap(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* Jenis Tutor */}
            <div>
              <label className="block mb-1 font-medium">Jenis Tutor</label>
              <select
                value={jenisTutor}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setJenisTutor(e.target.value as TutorType)
                }
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
              >
                <option value="guru">Guru</option>
                <option value="relawan">Relawan</option>
              </select>
            </div>

          {/* No. HP & Email Pribadi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">No. HP</label>
              <input
                type="text"
                value={noHp}
                onChange={e => setNoHp(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email Pribadi</label>
              <input
                type="email"
                value={emailPribadi}
                onChange={e => setEmailPribadi(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
              />
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="block mb-1 font-medium">Alamat</label>
            <textarea
              value={alamat}
              onChange={e => setAlamat(e.target.value)}
              rows={2}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* Identitas & Bidang Keahlian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">No. Identitas</label>
              <input
                type="text"
                value={nomorIdentitas}
                onChange={e => setNomorIdentitas(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Bidang Keahlian</label>
              <input
                type="text"
                value={bidangKeahlian}
                onChange={e => setBidangKeahlian(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
              />
            </div>
          </div>

          {/* Buttons */}
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
