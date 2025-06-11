// src\app\admin\dashboard\page.tsx
'use client';

import { useAuth } from '../../context/AuthContext';  // Menggunakan context
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { user, token } = useAuth();  // Ambil data user dan token dari context
  const router = useRouter();

  if (!user || !user.roles?.some(role => role.name === 'admin'||'superadmin')) {
    return <div>Access Denied</div>;  // Akses hanya untuk role admin
  }

  const stats = [
    { title: 'Total User', value: 128, emoji: '👥' },
    { title: 'Program Aktif', value: 6, emoji: '📚' },
    { title: 'Tutor Terdaftar', value: 35, emoji: '👨‍🏫' },
    { title: 'Modul', value: 118, emoji: '📝' },
  ];

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ title, value, emoji }) => (
        <div
          key={title}
          className="relative overflow-hidden bg-white rounded-2xl shadow hover:shadow-lg transition"
        >
          <div className="absolute right-0 -top-2 opacity-10 text-[6rem]">
            {emoji}
          </div>
          <div className="p-6 space-y-1">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-[#0F2850]">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
