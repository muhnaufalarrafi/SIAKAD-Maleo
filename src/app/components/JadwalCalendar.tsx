import { useMemo } from 'react';
import { JadwalKelas } from '@/app/lib/class/jadwalKelas';

// Definisikan hari dalam seminggu
const DAYS = [
  { key: 'Senin',  label: 'Senin'  },
  { key: 'Selasa', label: 'Selasa' },
  { key: 'Rabu',   label: 'Rabu'   },
  { key: 'Kamis',  label: 'Kamis'  },
  { key: 'Jumat',  label: 'Jumat'  },
];

interface JadwalCalendarProps {
  jadwals: JadwalKelas[];
}

export function JadwalCalendar({ jadwals }: JadwalCalendarProps) {
  // Proses data jadwal untuk format kalender
  const timeSlots = useMemo(() => {
    // 1. Dapatkan semua rentang waktu unik (misal: "08:00-09:00") dan urutkan
    const uniqueTimeRanges = Array.from(
      new Set(jadwals.map(j => `${j.jam_mulai}-${j.jam_selesai}`))
    ).sort();

    // 2. Buat baris untuk setiap rentang waktu
    return uniqueTimeRanges.map(timeRange => {
      const [jam_mulai] = timeRange.split('-');

      // 3. Untuk setiap hari, cari jadwal yang cocok
      const scheduleByDay = DAYS.reduce((acc, day) => {
        const entries = jadwals.filter(
          j => j.hari === day.key && `${j.jam_mulai}-${j.jam_selesai}` === timeRange
        );
        acc[day.key] = entries;
        return acc;
      }, {} as Record<string, JadwalKelas[]>);

      return { time: jam_mulai, schedule: scheduleByDay };
    });
  }, [jadwals]);

  return (
    <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-[#18355E] text-white">
            <th className="py-3 px-2 text-left text-sm w-24">Waktu</th>
            {DAYS.map(day => (
              <th key={day.key} className="py-3 px-2 text-left text-sm">{day.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(({ time, schedule }) => (
            <tr key={time} className="border-b border-gray-200">
              <td className="py-3 px-2 font-medium text-gray-700 align-top">{time}</td>
              {DAYS.map(day => (
                <td key={day.key} className="py-2 px-2 align-top">
                  {schedule[day.key]?.map(entry => (
                    <div key={entry.id} className="bg-blue-50 text-blue-800 p-2 rounded-lg mb-2 text-xs">
                      <p className="font-bold">{entry.nama_mapel || 'N/A'}</p>
                      <p>{entry.nama_kelas || 'Tanpa Kelas'}</p>
                      <p className="text-blue-600 italic">{entry.tutor_id}</p> {/* Ganti dengan nama tutor jika tersedia */}
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}