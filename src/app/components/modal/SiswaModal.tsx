// src\app\components\modal\SiswaModal.tsx
'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Button } from '../button/Button';
import type { Siswa, SiswaInput } from '@/app/lib/users/siswa';
import { getAllSiswaUsers } from '@/app/lib/rbac/users';
import { getAllKelas } from '@/app/lib/class/kelas';

interface SiswaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Siswa;
  onSubmit: (data: Omit<SiswaInput, 'user_id'> & { user_id?: string | null }, id?: string) => void;
}

interface Option {
  value: string;
  label: string;
}

export const SiswaModal = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: SiswaModalProps) => {
  const [userOptions, setUserOptions] = useState<Option[]>([]);
  const [selectedUser, setSelectedUser] = useState<Option | null>(null);

  const [nis, setNis] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [statusAktif, setStatusAktif] = useState(true);

  const [kelasOptions, setKelasOptions] = useState<Option[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<Option | null>(null);

  // Ambil semua user siswa
  useEffect(() => {
    if (!isOpen) return;
    getAllSiswaUsers()
      .then((users) => {
        const options = users.map((u) => ({
          value: u.id,
          label: u.email,
        }));
        setUserOptions(options);

        if (initialData?.user_id) {
          const found = options.find((opt) => opt.value === initialData.user_id);
          setSelectedUser(found || null);
        } else {
          setSelectedUser(null);
        }
      })
      .catch(console.error);
  }, [isOpen, initialData?.user_id]);

  // Ambil kelas
  useEffect(() => {
    if (!isOpen) return;
    getAllKelas()
      .then((kelasList) => {
        const options = kelasList.map(k => ({
          value: k.nama,
          label: `${k.nama} (Tingkat ${k.tingkat}, ${k.tahun_ajaran})`,
        }));
        setKelasOptions(options);

        if (initialData?.kelas) {
          const found = options.find((opt) => opt.value === initialData.kelas);
          setSelectedKelas(found || null);
        } else {
          setSelectedKelas(null);
        }
      })
      .catch(console.error);
  }, [isOpen, initialData?.kelas]);

  // Inisialisasi data saat modal dibuka
useEffect(() => {
  if (!initialData) {
    setNis('');
    setNamaLengkap('');
    setJenisKelamin('L');
    setTanggalLahir('');
    setStatusAktif(true);
  } else {
    setNis(initialData.nis);
    setNamaLengkap(initialData.nama_lengkap);
    setJenisKelamin(initialData.jenis_kelamin as 'L' | 'P' || 'L');

    // FIXED bagian ini:
    if (initialData.tanggal_lahir) {
      const local = new Date(initialData.tanggal_lahir);
      const year = local.getFullYear();
      const month = String(local.getMonth() + 1).padStart(2, '0');
      const day = String(local.getDate()).padStart(2, '0');
      setTanggalLahir(`${year}-${month}-${day}`);
    } else {
      setTanggalLahir('');
    }

    setStatusAktif(initialData.status_aktif);
  }
}, [initialData, isOpen]);

  if (!isOpen) return null;

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const payload: Omit<SiswaInput, 'user_id'> & { user_id?: string | null } = {
    nis: nis.trim(),
    nama_lengkap: namaLengkap.trim(),
    jenis_kelamin: jenisKelamin,
    tanggal_lahir: tanggalLahir || undefined,
    kelas: selectedKelas?.value || undefined,
    status_aktif: statusAktif,
  };

  if (!initialData && selectedUser) {
  payload.user_id = selectedUser.value;
  }

  onSubmit(payload, initialData?.id);
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg text-black">
        <h2 className="text-xl mb-4 font-semibold text-[#18355E]">
          {initialData ? 'Edit Siswa' : 'Tambah Siswa'}
        </h2>
        {initialData && (
          <p className="mb-4 text-sm text-gray-600">
            Record ID: <span className="font-mono">{initialData.id}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User */}
          <div>
            <label className="block mb-1 font-medium">User (siswa)</label>
            <Select
              options={userOptions}
              value={selectedUser}
              onChange={setSelectedUser}
              isClearable={!initialData}
              isSearchable
              placeholder={initialData ? '(Tidak dapat diubah)' : 'Pilih user siswa'}
              isDisabled={false}
            />
          </div>

          {/* NIS */}
          <div>
            <label className="block mb-1 font-medium">NIS</label>
            <input
              type="text"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block mb-1 font-medium">Nama Lengkap</label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
            />
          </div>

          {/* Jenis Kelamin & Tgl Lahir */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Jenis Kelamin</label>
              <select
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value as 'L' | 'P')}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Tanggal Lahir</label>
              <input
                type="date"
                value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#18355E]"
              />
            </div>
          </div>

          {/* Kelas */}
          <div>
            <label className="block mb-1 font-medium">Kelas</label>
            <Select
              options={kelasOptions}
              value={selectedKelas}
              onChange={setSelectedKelas}
              isClearable
              isSearchable
              placeholder="Pilih kelas"
            />
          </div>

          {/* Status Aktif */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={statusAktif}
              onChange={(e) => setStatusAktif(e.target.checked)}
              id="status_aktif"
            />
            <label htmlFor="status_aktif" className="font-medium">
              Status Aktif
            </label>
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
            <Button type="submit">{initialData ? 'Update' : 'Simpan'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
