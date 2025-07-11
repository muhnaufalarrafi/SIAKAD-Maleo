'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Clock } from 'lucide-react';
import {
  checkinGuru,
  checkoutGuru,
  getTodayAbsensiGuru,
  AbsensiGuru,
  AbsensiGuruInput
} from '@/app/lib/absence/guru';
import { IzinSakitModal } from '@/app/components/modal/IzinSakitModal';

// Type-guard untuk HTTP error dengan properti .status
interface HttpError { status?: number }
function isHttpError(err: unknown): err is HttpError {
  return typeof err === 'object'
      && err !== null
      && 'status' in err
      && typeof (err as Record<string, unknown>)['status'] === 'number';
}

// Type-guard untuk error jarak dari backend
interface DistanceError { jarak_meter: number }
function isDistanceError(err: unknown): err is DistanceError {
  return typeof err === 'object'
      && err !== null
      && 'jarak_meter' in err
      && typeof (err as Record<string, unknown>)['jarak_meter'] === 'number';
}

export default function AbsenTutorPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Menunggu GPS...');
  const [disabledGps, setDisabledGps] = useState(true);
  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [todayRec, setTodayRec] = useState<AbsensiGuru | null>(null);
  const [isIzinModalOpen, setIzinModalOpen] = useState(false);

  // 1) Fetch absensi hari ini
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    (async () => {
      try {
        const rec = await getTodayAbsensiGuru(user.id);
        setTodayRec(rec);
        if (rec.status !== 'hadir') {
          setStatus(`Status hari ini: ${rec.status.toUpperCase()}`);
        } else if (rec.checkout_time) {
          setStatus(`Sudah Check-Out pukul ${rec.checkout_time}`);
        } else {
          setStatus(`Sudah Check-In pukul ${rec.checkin_time}`);
        }
      } catch (err: unknown) {
        if (!isHttpError(err) || err.status !== 404) {
          console.error(err);
          setStatus('Gagal memuat data absensi');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // 2) Ambil GPS
  useEffect(() => {
    if (todayRec) return; // Jika sudah ada rekam absensi, tidak perlu ambil GPS lagi
    
    setDisabledGps(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoords({ lat: coords.latitude, lng: coords.longitude });
        setStatus(`GPS Siap: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
        setDisabledGps(false);
      },
      () => {
        setStatus('Gagal mendapatkan lokasi. Aktifkan GPS dan refresh.');
        setDisabledGps(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [todayRec]);

  if (!user) return <div>Loading user...</div>;

  // 3) Handle Check-In (Hadir) / Check-Out
  const handleAction = async () => {
    if (!coords) {
        alert('Lokasi GPS tidak tersedia. Mohon aktifkan GPS dan coba lagi.');
        return;
    }
    setLoading(true);
    setDistanceError(null);

    const base = {
      tutor_id: user.id,
      tanggal: new Date().toISOString().split('T')[0],
    };

    try {
      if (!todayRec) {
        // **CHECK-IN (Hadir)**
        const payload: AbsensiGuruInput = {
          ...base,
          checkin_time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
          checkin_lat: coords.lat,
          checkin_lng: coords.lng,
          status: 'hadir',
        };
        const result = await checkinGuru(payload);
        setTodayRec(result);
        setStatus(`Berhasil Check-In pukul ${result.checkin_time}`);
      } else if (!todayRec.checkout_time && todayRec.status === 'hadir') {
        // **CHECK-OUT**
        const payload: AbsensiGuruInput = {
          ...base,
          checkin_time:   todayRec.checkin_time,
          checkin_lat:    todayRec.checkin_lat!,
          checkin_lng:    todayRec.checkin_lng!,
          checkout_time:  new Date().toLocaleTimeString('en-GB', { hour12: false }),
          checkout_lat:   coords.lat,
          checkout_lng:   coords.lng,
        };
        const result = await checkoutGuru(todayRec.id, payload);
        setTodayRec(result);
        setStatus(`Berhasil Check-Out pukul ${result.checkout_time}`);
      }
    } catch (err: unknown) {
      if (isDistanceError(err)) {
        setDistanceError(`Jarak terlalu jauh! Jarak Anda: ${err.jarak_meter} m.`);
      } else {
        const errorMessage = err instanceof Error ? err.message : `Gagal ${!todayRec ? 'Check-In' : 'Check-Out'}. Coba lagi.`;
        setDistanceError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // 4) Handle Izin / Sakit
  const handleIzinSubmit = async (status: 'izin' | 'sakit', catatan: string) => {
    if (!user) return;
    
    setLoading(true);
    setDistanceError(null);
    try {
      const payload: AbsensiGuruInput = {
        tutor_id: user.id,
        tanggal: new Date().toISOString().split('T')[0],
        // Untuk izin/sakit, checkin_time tetap dikirim, namun lat/lng tidak wajib
        checkin_time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        checkin_lat: coords?.lat ?? 0, // Kirim 0 atau koordinat jika ada
        checkin_lng: coords?.lng ?? 0,
        status: status,
        catatan: catatan,
      };
      const result = await checkinGuru(payload);
      setTodayRec(result);
      setStatus(`Berhasil mengajukan ${status}.`);
      setIzinModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengajukan izin. Coba lagi.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logika untuk label dan status disabled tombol
  const buttonLabel = todayRec ? (todayRec.status !== 'hadir' ? 'Sudah Absen' : (todayRec.checkout_time ? 'Sudah Check-Out' : 'Check-Out')) : 'Check-In';
  const checkinoutDisabled = disabledGps || loading || (todayRec && todayRec.status !== 'hadir') || !!todayRec?.checkout_time;
  const izinDisabled = loading || !!todayRec;

  return (
    <div className="min-h-screen bg-[#F5F8FF] flex items-center justify-center p-6">
      <section className="w-full max-w-2xl bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="h-64 sm:h-72 bg-gradient-to-r from-[#18355E] to-[#0F2850] flex items-center justify-center text-center px-4">
          <p className="text-xl font-semibold text-white">{status}</p>
        </div>
        <div className="p-8 space-y-6">
          {distanceError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
              {distanceError}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={handleAction} disabled={checkinoutDisabled} className="w-full py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95">
              {buttonLabel}
            </button>
            <button onClick={() => setIzinModalOpen(true)} disabled={izinDisabled} className="w-full py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95">
              Ajukan Izin / Sakit
            </button>
          </div>
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <Clock className="w-4 h-4 mr-1 text-[#18355E]" />
            Radius valid 150 m dari titik sekolah
          </p>
        </div>
      </section>
      <IzinSakitModal isOpen={isIzinModalOpen} onClose={() => setIzinModalOpen(false)} onSubmit={handleIzinSubmit} />
    </div>
  );
}
