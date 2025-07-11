// src/app/page/jurnal-tutor/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext'; // BARU: Impor useAuth
import { getTeachingHistoryByTutor, TeachingHistory } from '@/app/lib/absence/siswa';
import { getTutorByUserId } from '@/app/lib/users/tutor'; // BARU: Fungsi untuk mendapat profil tutor

// Tipe data untuk riwayat yang sudah dikelompokkan
type GroupedHistory = {
  [mataPelajaran: string]: Omit<TeachingHistory, 'mata_pelajaran'>[];
};

export default function JurnalTutorPage() {
  // BARU: Gunakan hook useAuth untuk mendapatkan data user
  const { user } = useAuth();

  // DIUBAH: State tidak lagi memerlukan daftar tutor atau ID yang dipilih
  const [history, setHistory] = useState<GroupedHistory>({});
  
  // State untuk UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // DIUBAH: useEffect sekarang bergantung pada 'user' dari AuthContext
  useEffect(() => {
    // Jangan lakukan apa-apa jika data user belum ada
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Langkah 1: Dapatkan ID profil tutor dari ID user yang login
    getTutorByUserId(user.id)
      .then(tutorProfile => {
        if (!tutorProfile) {
          throw new Error("Profil tutor tidak ditemukan untuk pengguna ini.");
        }
        // Langkah 2: Gunakan ID profil tutor untuk mengambil riwayat mengajar
        return getTeachingHistoryByTutor(tutorProfile.id);
      })
      .then(data => {
        // Kelompokkan hasil berdasarkan mata pelajaran
        const grouped: GroupedHistory = data.reduce((acc, item) => {
          const { mata_pelajaran, ...rest } = item;
          if (!acc[mata_pelajaran]) {
            acc[mata_pelajaran] = [];
          }
          acc[mata_pelajaran].push(rest);
          return acc;
        }, {} as GroupedHistory);
        setHistory(grouped);
      })
      .catch(e => {
        console.error("Gagal memuat jurnal tutor:", e);
        setError(e.message || "Gagal memuat data jurnal.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]); // Efek ini berjalan setiap kali 'user' berubah

  // Fungsi untuk format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) return <div className="text-center p-6">Memuat data...</div>;

  return (
    <div className="p-8 bg-[#F5F8FF] min-h-screen">
      <h1 className="text-2xl font-semibold text-[#18355E] mb-8">
        Jurnal Mengajar Saya
      </h1>
      
      {/* Tampilan Konten */}
      <div>
        {error && <div className="text-center p-4 text-red-600 bg-red-100 rounded-lg">{error}</div>}
        
        {!loading && !error && Object.keys(history).length === 0 && (
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            Anda belum memiliki riwayat mengajar yang tercatat.
          </div>
        )}

        {!loading && !error && Object.keys(history).length > 0 && (
          <div className="space-y-6">
            {Object.entries(history).map(([mapel, records]) => (
              <div key={mapel} className="bg-white rounded-3xl shadow-lg ring-1 ring-[#18355E]/20 overflow-hidden">
                <h2 className="px-6 py-4 bg-[#18355E] text-white font-semibold text-lg">
                  {mapel}
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-[#18355E]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sub Materi yang Diajarkan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {records.map((rec, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap w-1/4">
                            {formatDate(rec.tanggal)}
                          </td>
                          <td className="px-6 py-4">
                            {rec.sub_materi}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
