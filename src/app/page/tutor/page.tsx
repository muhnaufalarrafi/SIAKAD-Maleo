// src/app/page/tutor/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getJadwalByTutorId, JadwalKelas } from '@/app/lib/class/jadwalKelas';
import {
  getTodayAbsensiGuru,
  AbsensiGuru
} from '@/app/lib/absence/guru';
import AbsensiChart from '@/app/components/AbsensiChart';

const DAYS = [
  { key: 'Senin',  label: 'Senin'  },
  { key: 'Selasa', label: 'Selasa' },
  { key: 'Rabu',   label: 'Rabu'   },
  { key: 'Kamis',  label: 'Kamis'  },
  { key: 'Jumat',  label: 'Jumat'  },
];

export default function TutorDashboard() {
  const { user } = useAuth();
  const [jadwal, setJadwal] = useState<JadwalKelas[]>([]);
  const [attRec, setAttRec] = useState<AbsensiGuru | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ambil jadwal hari ini
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    getJadwalByTutorId(user.id)
      .then(grouped => {
        const all = Object.values(grouped).flat();
        const today = new Date().getDay();           // 0=Minggu…6=Sabtu
        const nama = DAYS[today - 1]?.key;           // Senin…Jumat
        setJadwal(all.filter(j => j.hari === nama));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  // ambil data absensi hari ini
  useEffect(() => {
    if (!user) return;
    getTodayAbsensiGuru(user.id)
      .then(rec => setAttRec(rec))
      .catch(err => {
        if (err.status !== 404) console.error(err);
        // kalau 404: belum pernah check-in → biarkan null
      });
  }, [user]);

  if (!user) return <div>Loading user...</div>;
  if (loading) return <div>Loading jadwal...</div>;
  if (error)   return <div className="text-red-600">{error}</div>;

  // --- SOLUSI DIMULAI DI SINI ---
  const todayDateString = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Siapkan tampilan
  const checkinDisplay  = attRec?.checkin_time  || '—';
  const checkoutDisplay = attRec?.checkout_time || '—';
  const gpsStatus       =
    attRec?.status === 'hadir' ? 'Terverifikasi'
  : attRec?.status === 'alfa'  ? 'Diluar Radius'
  :                           '—';

  return (
    <div className="flex-1 p-6 lg:p-10 space-y-6 bg-maleo-50">

      {/* Jadwal Hari Ini */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[#18355E]">Jadwal Hari Ini</h2>
        {jadwal.length === 0 ? (
          <p className="text-gray-500">Hari ini Anda Tidak Memiliki Jadwal Kelas</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {jadwal.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span className="text-[#0F2850]">
                  {item.jam_mulai} – {item.jam_selesai} | {item.nama_mapel} ({item.tempat || '-'})
                </span>
                {/* Ganti item.tanggal dengan todayDateString */}
                <span className="text-gray-500">{item.hari}, {todayDateString}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Status Kehadiran */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[#18355E]">Status Kehadiran</h2>
        <div className="flex gap-6">
          <div className="flex-1 bg-[#F5F8FF] rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Check-In</p>
            <p className="text-2xl font-bold text-[#18355E]">{checkinDisplay}</p>
          </div>
          <div className="flex-1 bg-[#F5F8FF] rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Check-Out</p>
            <p className="text-2xl font-bold text-[#18355E]">{checkoutDisplay}</p>
          </div>
          <div className="flex-1 bg-[#F5F8FF] rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">GPS Status</p>
            <p className="text-2xl font-bold text-[#18355E]">{gpsStatus}</p>
          </div>
        </div>
      </section>

     {/* Grafik Kehadiran Harian */}
     <AbsensiChart />

    </div>
  );
}