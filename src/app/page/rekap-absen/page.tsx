// src/app/rekap-absen/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { SingleValue } from 'react-select';

// Import Tipe dan Fungsi API
import { getAllAbsensiSiswa, AbsensiSiswa } from '@/app/lib/absence/siswa';
import { getAllKelas, Kelas } from '@/app/lib/class/kelas';
import { SelectOptionType } from '@/app/lib/types/types';

// Import Komponen Baru
import { FilterPanel } from '@/app/components/rekap-absen/FilterPanel';
import { AbsenTable } from '@/app/components/rekap-absen/AbsenTable';

const RekapAbsenPage = () => {
  // State untuk menampung data dari API
  const [allAbsen, setAllAbsen] = useState<AbsensiSiswa[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);

  // State untuk UI (loading, error)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk semua filter
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedKelas, setSelectedKelas] = useState<SingleValue<SelectOptionType>>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [absenData, kelasData] = await Promise.all([
          getAllAbsensiSiswa(),
          getAllKelas(),
        ]);
        setAllAbsen(absenData);
        setKelasList(kelasData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || 'Gagal memuat data.');
        } else {
          setError('Terjadi kesalahan yang tidak diketahui.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kelasOptions = useMemo((): SelectOptionType[] => 
    kelasList.map(k => ({ value: k.id, label: `${k.nama} (${k.tahun_ajaran})` })), 
    [kelasList]
  );
  
  const filteredAbsen = useMemo(() => {
    return allAbsen.filter((absen) => {
      const kelasMatch = !selectedKelas || absen.kelas_id === selectedKelas.value;
      if (!kelasMatch) return false;

      if (!startDate && !endDate) return true;

      const absenDate = new Date(absen.tanggal);
      absenDate.setHours(0,0,0,0);
      const start = startDate ? new Date(startDate) : null;
      if(start) start.setHours(0,0,0,0);
      const end = endDate ? new Date(endDate) : null;
      if(end) end.setHours(0,0,0,0);

      if (start && end) return absenDate >= start && absenDate <= end;
      if (start) return absenDate >= start;
      if (end) return absenDate <= end;
      
      return true;
    });
  }, [allAbsen, startDate, endDate, selectedKelas]);

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedKelas(null);
  };

  const handleExportToExcel = () => {
    if (filteredAbsen.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    const dataToExport = filteredAbsen.map((absen, index) => ({
      'No.': index + 1,
      'Tanggal': new Date(absen.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      'Hari': absen.hari || '-',
      'Nama Siswa': absen.nama_siswa,
      'Jam': absen.jam_mulai ? `${absen.jam_mulai} - ${absen.jam_selesai}` : '-',
      'Status': absen.status.charAt(0).toUpperCase() + absen.status.slice(1),
      'Catatan': absen.catatan || '-',
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Absensi");
    worksheet["!cols"] = [
      { wch: 5 }, { wch: 20 }, { wch: 10 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 40 },
    ];
    XLSX.writeFile(workbook, `Rekap_Absensi_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Rekapitulasi Absensi Siswa</h1>
      
      <FilterPanel
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedKelas={selectedKelas}
        setSelectedKelas={setSelectedKelas}
        kelasOptions={kelasOptions}
        isLoading={loading}
        onResetFilters={handleResetFilters}
        onExportToExcel={handleExportToExcel}
        isExportDisabled={filteredAbsen.length === 0}
      />

      <AbsenTable
        absensi={filteredAbsen}
        loading={loading}
        error={error}
        filteredClassName={selectedKelas?.label}
        totalDataCount={allAbsen.length}
      />
    </div>
  );
};

export default RekapAbsenPage;