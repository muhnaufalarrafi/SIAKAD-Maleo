// src\app\page\tutor-schedule\page.tsx
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
      console.log("DATA JADWAL MENTAH:", flatJadwal); // <-- TAMBAHKAN INI
      setJadwal(flatJadwal);
    })
    .catch(err => setError(err.message || 'Gagal memuat jadwal'))
    .finally(() => setLoading(false));
}, [user]);

  // Bangun timeSlots dari jadwal ("07:00–08:00" → "07:00")
  const timeSlots: TimeSlot[] = useMemo(() => {
    const times = Array.from(
      new Set(jadwal.map(j => `${j.jam_mulai}–${j.jam_selesai}`))
    ).sort();
    return times.map(str => {
      const [jam_mulai] = str.split('–');
      const schedule = DAYS.reduce<
        Record<string, { subject: string; room: string } | null>
      >((acc, day) => {
        const entry = jadwal.find(
          j =>
            j.hari === day.key &&
            `${j.jam_mulai}–${j.jam_selesai}` === str
        );
        acc[day.key] = entry
          ? {
              subject: entry.nama_mapel || '–',
              room: entry.tempat || '–'
            }
          : null;
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
