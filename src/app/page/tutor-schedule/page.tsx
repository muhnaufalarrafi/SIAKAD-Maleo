'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getJadwalByTutorId, JadwalKelas } from '@/app/lib/class/jadwalKelas';
import ScheduleCalendar, { TimeSlot } from '@/app/components/ScheduleCalendar';

const DAYS = [
  { key: 'Senin',  label: 'Senin'  },
  { key: 'Selasa', label: 'Selasa' },
  { key: 'Rabu',   label: 'Rabu'   },
  { key: 'Kamis',  label: 'Kamis'  },
  { key: 'Jumat',  label: 'Jumat'  },
];

export default function TutorSchedulePage() {
  const { user } = useAuth();
  const [jadwal,  setJadwal]  = useState<JadwalKelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string|null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getJadwalByTutorId(user.id)
      .then(grouped => {
        const flatJadwal = Object.values(grouped).flat();
        setJadwal(flatJadwal);
      })
      .catch(err => setError(err.message || 'Gagal memuat jadwal'))
      .finally(() => setLoading(false));
  }, [user]);

  // --- PERUBAHAN DI SINI ---
  // Memproses data 'jadwal' untuk memisahkan mata pelajaran dan kelas.
  const timeSlots: TimeSlot[] = useMemo(() => {
    // 1. Dapatkan semua rentang waktu unik dan urutkan.
    const uniqueTimeRanges = Array.from(
      new Set(jadwal.map(j => `${j.jam_mulai}–${j.jam_selesai}`))
    ).sort();

    // 2. Untuk setiap rentang waktu, buat satu baris untuk tabel jadwal.
    return uniqueTimeRanges.map(timeRange => {
      const [jam_mulai] = timeRange.split('–');

      // 3. Untuk setiap hari, cari entri jadwal yang cocok.
      const schedule = DAYS.reduce<
        Record<string, { subject: string; room: string } | null>
      >((acc, day) => {
        const entry = jadwal.find(
          j =>
            j.hari === day.key &&
            `${j.jam_mulai}–${j.jam_selesai}` === timeRange
        );

        // 4. Jika entri jadwal ditemukan, format ulang teksnya.
        if (entry) {
          // Baris pertama hanya untuk nama mata pelajaran.
          const subjectText = entry.nama_mapel || 'N/A';
          
          // Baris kedua untuk kelas dan tempat, tanpa keterangan.
          const classText = entry.nama_kelas ? `Kelas ${entry.nama_kelas}` : '';
          const placeText = entry.tempat || '';
          
          // Gabungkan kelas dan tempat dengan pemisah jika keduanya ada.
          const roomText = [classText, placeText].filter(Boolean).join(' - ');

          acc[day.key] = {
            subject: subjectText,
            // Tampilkan hasil gabungan, atau strip jika kosong.
            room: roomText || '–',
          };
        } else {
          // Jika tidak ada jadwal, biarkan kosong.
          acc[day.key] = null;
        }
        return acc;
      }, {});

      return { time: jam_mulai, schedule };
    });
  }, [jadwal]);

  if (!user) {
    return <div className="text-center py-10 text-gray-600">Memuat data pengguna…</div>;
  }
  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading jadwal…</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Judul */}
        <h1 className="text-2xl font-semibold text-[#18355E]">
          Jadwal Mengajar
        </h1>
        {/* Calendar */}
        <ScheduleCalendar days={DAYS} timeSlots={timeSlots} />
      </div>
    </div>
  );
}
