// src/app/page/kelas-siswa/page.tsx
'use client';

import { useState, useEffect } from 'react';
import TableDesain, { TableDesainColumn } from '@/app/components/TableDesain';
import { getAllKelas, Kelas } from '@/app/lib/class/kelas';
import { getAllKelasSiswa, KelasSiswa } from '@/app/lib/class/kelasSiswa';
import { getAllSiswa, Siswa } from '@/app/lib/users/siswa';

export default function KelasSiswaPage() {
  // === State ===
  const [kelasList, setKelasList]       = useState<Kelas[]>([]);
  const [relList, setRelList]           = useState<KelasSiswa[]>([]);
  const [siswaList, setSiswaList]       = useState<Siswa[]>([]);
  const [selectedKelasId, setSelectedKelasId] = useState<string>('');
  const [filteredSiswa, setFilteredSiswa]     = useState<Siswa[]>([]);
  const [loading, setLoading]           = useState<boolean>(true);
  const [error, setError]               = useState<string|null>(null);

  // === Fetch data on mount ===
  useEffect(() => {
    (async () => {
      try {
        const [kelas, relasi, siswa] = await Promise.all([
          getAllKelas(),
          getAllKelasSiswa(),
          getAllSiswa()
        ]);
        setKelasList(kelas);
        setRelList(relasi);
        setSiswaList(siswa);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // === Filter siswa tiap kali kelas dipilih ===
  useEffect(() => {
    if (!selectedKelasId) {
      setFilteredSiswa([]);
      return;
    }
    const siswaIds = relList
      .filter(r => String(r.kelas_id) === selectedKelasId)
      .map(r => String(r.siswa_id));
    setFilteredSiswa(siswaList.filter(s => siswaIds.includes(String(s.id))));
  }, [selectedKelasId, relList, siswaList]);

  // === Loading / Error handling ===
  if (loading) return <div className="p-6">Loading…</div>;
  if (error)   return <div className="p-6 text-red-600">Error: {error}</div>;

  // === Definisi kolom untuk TableDesain ===
  const columns: TableDesainColumn<Siswa>[] = [
    { header: 'No', accessor: (_, i) => i + 1, width: 'w-12' },
    { header: 'NIS', accessor: s => s.nis, width: 'w-24' },
    { header: 'Nama Lengkap', accessor: s => s.nama_lengkap },
    { header: 'Jenis Kelamin', accessor: s => s.jenis_kelamin || '-' },
    {
      header: 'Tanggal Lahir',
      accessor: s =>
        s.tanggal_lahir
          ? new Date(s.tanggal_lahir).toLocaleDateString('id-ID')
          : '-'
    },
    {
      header: 'Status Aktif',
      accessor: s => (
        <span className={`font-medium ${s.status_aktif ? 'text-green-600' : 'text-red-600'}`}>
          {s.status_aktif ? 'Aktif' : 'Non-Aktif'}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 bg-[#F5F8FF] min-h-screen">
      <h1 className="text-2xl font-semibold text-[#18355E] mb-4">
        Daftar Siswa per Kelas
      </h1>

      {/* --- Dropdown Pilih Kelas --- */}
      <div className="mb-6 max-w-xs">
        <label htmlFor="kelas" className="block mb-2 text-sm font-medium text-[#0F2850]">
          Pilih Kelas
        </label>
        <select
          id="kelas"
          value={selectedKelasId}
          onChange={e => setSelectedKelasId(e.target.value)}
          className="block w-full bg-white border border-[#18355E] rounded-md p-2 text-[#0F2850]
                     focus:outline-none focus:ring-2 focus:ring-[#18355E] focus:border-transparent"
        >
          <option value="">-- Pilih Kelas --</option>
          {kelasList.map(k => (
            <option key={k.id} value={k.id}>
              {k.nama} — Tingkat {k.tingkat} ({k.tahun_ajaran})
            </option>
          ))}
        </select>
      </div>

      {/* --- Tabel Siswa --- */}
      {selectedKelasId && (
        filteredSiswa.length === 0
          ? <p className="text-gray-500">Belum ada siswa di kelas ini.</p>
          : <TableDesain columns={columns} data={filteredSiswa} />
      )}
    </div>
  );
}
