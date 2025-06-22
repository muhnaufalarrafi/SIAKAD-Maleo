// src/app/components/rekap-absen/AbsenTable.tsx
'use client';

import React from 'react';
import { AbsensiSiswa } from '@/app/lib/absence/siswa'; // Sesuaikan path jika perlu

interface AbsenTableProps {
  absensi: AbsensiSiswa[];
  loading: boolean;
  error: string | null;
  filteredClassName?: string | null;
  totalDataCount: number;
}

const TableSkeleton = () => (
    <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="space-y-3">
            <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
        </div>
    </div>
);


const getStatusColor = (status: string) => {
  switch (status) {
    case 'hadir': return 'bg-green-100 text-green-800';
    case 'sakit': return 'bg-yellow-100 text-yellow-800';
    case 'izin': return 'bg-blue-100 text-blue-800';
    case 'alfa': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const AbsenTable = React.memo<AbsenTableProps>(({ absensi, loading, error, filteredClassName, totalDataCount }) => {
  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 font-semibold bg-white rounded-xl shadow">{error}</div>;
  }
  
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {filteredClassName ? `Rekap Absensi: ${filteredClassName}` : 'Rekap Absensi Semua Kelas'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Menampilkan {absensi.length} dari {totalDataCount} total data.
          </p>
      </div>

      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">No</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tanggal</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nama Siswa</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Jam</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Catatan</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {absensi.length > 0 ? (
            absensi.map((absen, index) => (
              <tr key={absen.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                  {new Date(absen.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{absen.nama_siswa}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(absen.status)}`}>
                    {absen.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{absen.jam_mulai} - {absen.jam_selesai}</td>
                <td className="px-6 py-4 text-gray-500">{absen.catatan || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-500">
                Tidak ada data yang cocok dengan filter yang diterapkan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

AbsenTable.displayName = 'AbsenTable';