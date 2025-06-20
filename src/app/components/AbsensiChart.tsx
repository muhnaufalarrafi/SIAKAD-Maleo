//src\app\components\AbsensiChart.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  getAllAbsensiGuru,
  AbsensiGuru
} from '@/app/lib/absence/guru';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const bulanIndo = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function AbsensiChart() {
  const [records, setRecords] = useState<AbsensiGuru[]>([]);

  useEffect(() => {
    getAllAbsensiGuru().then(setRecords);
  }, []);

  // Inisialisasi struktur count: { [monthKey]: { hadir: 0, izin: 0, sakit: 0, alfa: 0 } }
  const countsByMonth: Record<string, Record<string, number>> = {};

  for (const r of records) {
    const date = new Date(r.tanggal);
    const monthKey = `${bulanIndo[date.getMonth()]} ${date.getFullYear()}`;

    if (!countsByMonth[monthKey]) {
      countsByMonth[monthKey] = { hadir: 0, alfa: 0, izin: 0, sakit: 0 };
    }

    if (r.status in countsByMonth[monthKey]) {
      countsByMonth[monthKey][r.status]++;
    }
  }

  const labels = Object.keys(countsByMonth).sort((a, b) => {
    const [bulanA, tahunA] = a.split(' ');
    const [bulanB, tahunB] = b.split(' ');
    const dateA = new Date(`${tahunA}-${bulanIndo.indexOf(bulanA) + 1}-01`);
    const dateB = new Date(`${tahunB}-${bulanIndo.indexOf(bulanB) + 1}-01`);
    return dateA.getTime() - dateB.getTime();
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Hadir',
        data: labels.map(m => countsByMonth[m].hadir),
        borderColor: '#22c55e', // hijau
        fill: false,
        tension: 0.2
      },
      {
        label: 'Izin',
        data: labels.map(m => countsByMonth[m].izin),
        borderColor: '#3b82f6', // biru
        fill: false,
        tension: 0.2
      },
      {
        label: 'Sakit',
        data: labels.map(m => countsByMonth[m].sakit),
        borderColor: '#f59e0b', // kuning
        fill: false,
        tension: 0.2
      },
      {
        label: 'Alfa',
        data: labels.map(m => countsByMonth[m].alfa),
        borderColor: '#ef4444', // merah
        fill: false,
        tension: 0.2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Grafik Kehadiran per Bulan'
      }
    },
    scales: {
      x: { title: { display: true, text: 'Bulan' } },
      y: { title: { display: true, text: 'Jumlah' }, beginAtZero: true }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-6">
      <Line data={data} options={options} />
    </div>
  );
}
