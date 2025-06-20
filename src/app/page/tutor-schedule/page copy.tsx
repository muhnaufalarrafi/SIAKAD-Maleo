// src/app/page/tutor-schedule/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  getAllJadwal,
  JadwalKelas
} from '@/app/lib/class/jadwalKelas';

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
    getAllJadwal()
      .then(setJadwal)
      .catch(err => setError(err.message || 'Gagal memuat jadwal'))
      .finally(() => setLoading(false));
  }, []);

  const timeSlots = useMemo(() => {
    const times = Array.from(new Set(
      jadwal.map(j => `${j.jam_mulai}–${j.jam_selesai}`)
    )).sort();

    return times.map(time => {
      const [jam_mulai] = time.split('–');
      const schedule = DAYS.reduce<Record<string,{subject:string;room:string}|null>>((acc, day) => {
        const entry = jadwal.find(j =>
          j.hari === day.key &&
          j.jam_mulai === jam_mulai &&
          `${j.jam_mulai}–${j.jam_selesai}` === time
        );
        acc[day.key.toLowerCase()] = entry
          ? { subject: entry.mata_pelajaran_id, room: entry.tempat || '-' }
          : null;
        return acc;
      }, {});
      return { time, schedule };
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
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#18355E]">Jadwal Mengajar</h3>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B]
                       text-[#18355E] font-semibold shadow active:scale-95 transition"
            // TODO: buka modal Tambah/Edit jadwal
          >
            Tambah Jadwal
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#18355E] text-white">
              <tr>
                <th className="py-2 px-3">Waktu</th>
                {DAYS.map(d => (
                  <th key={d.key} className="py-2 px-3">{d.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {timeSlots.map(slot => (
                <tr key={slot.time} className="hover:bg-[#F5F8FF]/60">
                  <td className="py-2 px-3 font-medium text-gray-700">{slot.time}</td>
                  {DAYS.map(d => {
                    const cell = slot.schedule[d.key.toLowerCase()];
                    return (
                      <td key={d.key} className="py-2 px-3">
                        {cell && (
                          <div className="bg-[#F6C443]/20 text-[#18355E] p-2 rounded">
                            {cell.subject}<br/>
                            <span className="text-xs">{cell.room}</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
