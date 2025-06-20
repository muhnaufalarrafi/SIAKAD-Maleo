// src\app\page\dashboard
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers } from '@/app/lib/rbac/users';
import { getAllTutors } from '@/app/lib/users/tutor';
import { getAllSiswa } from '@/app/lib/users/siswa';
import { getAllEReference } from '@/app/lib/e-reference/api';
import AbsensiChart from '@/app/components/AbsensiChart'; // ✅ Tambahkan ini

interface StatItem {
  title: string;
  value: number;
  emoji: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.roles?.some(
    role => role.name === 'admin' || role.name === 'superadmin'
  );

  useEffect(() => {
    if (!isAdmin) return;

    const fetchStats = async () => {
      try {
        const [users, tutors, siswa, erefs] = await Promise.all([
          getAllUsers(),
          getAllTutors(),
          getAllSiswa(),
          getAllEReference(),
        ]);

        setStats([
          { title: 'Total Users', value: users.length, emoji: '👥' },
          { title: 'Total Tutor', value: tutors.length, emoji: '👨‍🏫' },
          { title: 'Total Siswa', value: siswa.length, emoji: '🧑‍🎓' },
          { title: 'Total E-Reference', value: erefs.length, emoji: '📁' },
        ]);
      } catch (err) {
        console.error('Gagal memuat statistik:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  if (!isAdmin) return <div className="text-red-600">Access Denied</div>;
  if (loading) return <div className="text-center py-10">Memuat statistik...</div>;

  return (
    <div className="space-y-6">
      {/* Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(({ title, value, emoji }) => (
          <div
            key={title}
            className="relative bg-white rounded-2xl shadow p-6 hover:shadow-md transition flex flex-col justify-between h-[130px]"
          >
            <div className="text-sm text-gray-500">{title}</div>
            <div className="flex justify-between items-center">
              <p className="text-4xl font-bold text-[#0F2850]">{value}</p>
              <div className="text-[2.5rem]">{emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Grafik Kehadiran Harian */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[#18355E]">Grafik Kehadiran</h2>
        <AbsensiChart />
      </section>
    </div>
  );
}
