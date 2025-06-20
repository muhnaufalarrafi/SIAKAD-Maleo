// src/app/page/absen-tutor/page.tsx
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

// Type‐guard untuk HTTP error dengan properti .status
interface HttpError { status?: number }
function isHttpError(err: unknown): err is HttpError {
  return typeof err === 'object'
      && err !== null
      && 'status' in err
      && typeof (err as Record<string, unknown>)['status'] === 'number';
}

// Type‐guard untuk error jarak
interface DistanceError { jarak_meter: number }
function isDistanceError(err: unknown): err is DistanceError {
  return typeof err === 'object'
      && err !== null
      && 'jarak_meter' in err
      && typeof (err as Record<string, unknown>)['jarak_meter'] === 'number';
}

export default function AbsenTutorPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Menunggu GPS...');
  const [disabledGps, setDisabledGps] = useState(true);
  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Menyimpan seluruh record hari ini
  const [todayRec, setTodayRec] = useState<AbsensiGuru | null>(null);

  // 1) Fetch absensi hari ini
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const rec = await getTodayAbsensiGuru(user.id);
        setTodayRec(rec);
        if (rec.checkout_time) {
          setStatus(`Sudah Check-Out pukul ${rec.checkout_time}`);
        } else {
          setStatus(`Sudah Check-In pukul ${rec.checkin_time}`);
        }
      } catch (err: unknown) {
        // Jika bukan 404 (belum ada), tampilkan error
        if (!isHttpError(err) || err.status !== 404) {
          console.error(err);
        }
      }
    })();
  }, [user]);

  // 2) Ambil GPS tiap kali todayRec berubah
  useEffect(() => {
    setDisabledGps(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoords({ lat: coords.latitude, lng: coords.longitude });
        setStatus(
          todayRec
            ? todayRec.checkout_time
              ? `Sudah Check-Out pukul ${todayRec.checkout_time}`
              : `Sudah Check-In pukul ${todayRec.checkin_time}`
            : `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
        );
        setDisabledGps(false);
      },
      () => {
        setStatus('Gagal mendapatkan lokasi');
        setDisabledGps(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [todayRec]);

  if (!user) return <div>Loading user...</div>;

  // 3) Handle Check-In / Check-Out
  const handleAction = async () => {
    if (!coords) return;
    setLoading(true);
    setDistanceError(null);

    // base payload common
    const base = {
      tutor_id: user.id,
      tanggal: new Date().toISOString(),
    };

    try {
      if (!todayRec) {
        // **CHECK-IN**
        const payload: AbsensiGuruInput = {
          ...base,
          checkin_time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
          checkin_lat: coords.lat,
          checkin_lng: coords.lng,
        };
        const result = await checkinGuru(payload);
        setTodayRec(result);
        setStatus(`Berhasil Check-In pukul ${result.checkin_time}`);
      } else if (!todayRec.checkout_time) {
        // **CHECK-OUT**
      const payload: AbsensiGuruInput = {
        ...base,
        // tambahkan kembali data Check-In yang sudah ada, karena tipe AbsensiGuruInput
        checkin_time:   todayRec.checkin_time,
        checkin_lat:    todayRec.checkin_lat!,
        checkin_lng:    todayRec.checkin_lng!,
        // kemudian data Check-Out
        checkout_time:  new Date().toLocaleTimeString('en-GB', { hour12: false }),
        checkout_lat:   coords.lat,
        checkout_lng:   coords.lng,
      };
        const result = await checkoutGuru(todayRec.id, payload);
        setTodayRec(result);
        setStatus(`Berhasil Check-Out pukul ${result.checkout_time}`);
      }
    } catch (err: unknown) {
      if (!todayRec && isDistanceError(err)) {
        setDistanceError(`Jarak terlalu jauh! Jarak Anda: ${err.jarak_meter} m.`);
      } else {
        setDistanceError(
          `Gagal ${!todayRec ? 'Check-In' : !todayRec.checkout_time ? 'Check-Out' : ''}. Coba lagi.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Label dan disabled state button
  const buttonLabel = todayRec
    ? todayRec.checkout_time
      ? 'Sudah Check-Out'
      : 'Check-Out'
    : 'Check-In';
  const buttonDisabled = disabledGps || loading || Boolean(todayRec?.checkout_time);

  return (
    <div className="min-h-screen bg-[#F5F8FF] flex items-center justify-center p-6">
      <section className="w-full max-w-2xl bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="h-64 sm:h-72 bg-gradient-to-r from-[#18355E] to-[#0F2850] flex items-center justify-center">
          <p className="text-xl font-semibold text-white">{status}</p>
        </div>
        <div className="p-8 space-y-6">
          {distanceError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
              {distanceError}
            </div>
          )}
          <div className="flex justify-center">
            <button
              onClick={handleAction}
              disabled={buttonDisabled}
              className="w-full sm:w-1/2 py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
            >
              {buttonLabel}
            </button>
          </div>
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <Clock className="w-4 h-4 mr-1 text-[#18355E]" />
            Radius valid 150 m dari titik sekolah
          </p>
        </div>
      </section>
    </div>
  );
}
