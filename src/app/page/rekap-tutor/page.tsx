// src/app/rekap-tutor/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { SingleValue } from 'react-select';

// Import Tipe dan Fungsi API
import { getAllAbsensiGuru, AbsensiGuru } from '@/app/lib/absence/guru';
import { SelectOptionType } from '@/app/lib/types/types';

// Import Komponen
import { TutorFilterPanel } from '@/app/components/rekap-absen/TutorFilterPanel';
import { TutorAbsenTable } from '@/app/components/rekap-absen/TutorAbsenTable';

const RekapAbsenTutorPage = () => {
  const [allAbsen, setAllAbsen] = useState<AbsensiGuru[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTutor, setSelectedTutor] = useState<SingleValue<SelectOptionType>>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllAbsensiGuru();
        setAllAbsen(data);
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

  const tutorOptions = useMemo((): SelectOptionType[] => {
    const tutors = new Map<string, string>();
    allAbsen.forEach(absen => {
      if (absen.tutor_id && absen.nama_tutor) {
        tutors.set(absen.tutor_id, absen.nama_tutor);
      }
    });
    return Array.from(tutors, ([value, label]) => ({ value, label }));
  }, [allAbsen]);
  
  const filteredAbsen = useMemo(() => {
    return allAbsen.filter((absen) => {
      const tutorMatch = !selectedTutor || absen.tutor_id === selectedTutor.value;
      if (!tutorMatch) return false;

      if (!startDate && !endDate) return true;

      const absenDate = new Date(absen.tanggal);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      absenDate.setHours(0,0,0,0);
      if(start) start.setHours(0,0,0,0);
      if(end) end.setHours(0,0,0,0);

      if (start && end) return absenDate >= start && absenDate <= end;
      if (start) return absenDate >= start;
      if (end) return absenDate <= end;
      
      return true;
    });
  }, [allAbsen, startDate, endDate, selectedTutor]);

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedTutor(null);
  };

  const handleExportToExcel = () => {
    if (filteredAbsen.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    const dataToExport = filteredAbsen.map((absen, index) => ({
      'No.': index + 1,
      'Nama Tutor': absen.nama_tutor,
      'Tanggal': new Date(absen.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      'Check-in': absen.checkin_time,
      'Check-out': absen.checkout_time || '-',
      'Status': absen.status.charAt(0).toUpperCase() + absen.status.slice(1),
      'Jarak Check-in (meter)': absen.jarak_meter,
      'Catatan': absen.catatan || '-',
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Absensi Tutor");
    XLSX.writeFile(workbook, `Rekap_Absensi_Tutor_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Rekapitulasi Absensi Tutor</h1>
      
      <TutorFilterPanel
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedTutor={selectedTutor}
        setSelectedTutor={setSelectedTutor}
        tutorOptions={tutorOptions}
        isLoading={loading}
        onResetFilters={handleResetFilters}
        onExportToExcel={handleExportToExcel}
        isExportDisabled={filteredAbsen.length === 0}
      />

      <TutorAbsenTable
        absensi={filteredAbsen}
        loading={loading}
        error={error}
        filteredTutorName={selectedTutor?.label}
        totalDataCount={allAbsen.length}
      />
    </div>
  );
};

export default RekapAbsenTutorPage;