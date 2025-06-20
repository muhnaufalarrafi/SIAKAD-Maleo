// src\app\lib\absence\guru.tsx
// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Optional: Tambahkan validasi jika API_BASE_URL tidak didefinisikan di .env
if (typeof API_BASE_URL === 'undefined') {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env.local file.');
}

export interface AbsensiGuru {
  id: string;
  tutor_id: string;
  tanggal: string;
  checkin_time: string;
  checkout_time?: string;
  checkin_lat: number;
  checkin_lng: number;
  checkout_lat?: number;
  checkout_lng?: number;
  jarak_meter?: number;
  status: 'hadir' | 'izin' | 'sakit' | 'alfa';
  catatan?: string;
}

export interface AbsensiGuruInput {
  tutor_id: string;
  tanggal: string;
  checkin_time: string;
  checkin_lat: number;
  checkin_lng: number;
  checkout_time?: string;
  checkout_lat?: number;
  checkout_lng?: number;
  status?: 'hadir' | 'izin' | 'sakit' | 'alfa';
  catatan?: string;
}

// Interface untuk struktur respons error yang mungkin dikirim oleh API
// Digunakan untuk type-safety di handleApiResponse dan checkinGuru
interface BackendErrorResponse {
  error?: string;
  jarak_meter?: number; // Backend mengirim ini untuk error tertentu
  // Tambahkan properti lain yang mungkin dikirim server saat error
}

// Utility untuk handle JSON + error
// Mengatasi: "Unexpected any. Specify a different type." pada `(err as any).error`
// Mengatasi: "'parseError' is defined but never used." pada `catch (parseError)`
async function handleApiResponse<T>(res: Response): Promise<T> {
  let data: unknown; // Lebih aman daripada 'any' di awal
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch { // Tanpa parameter untuk `catch` jika tidak digunakan
    data = {}; // Jika parsing gagal, set ke objek kosong
  }

  if (!res.ok) {
    // Asumsikan 'data' adalah BackendErrorResponse untuk mengakses properti 'error'
    const errorData = data as BackendErrorResponse;
    throw new Error(errorData.error || 'API request failed');
  }
  return data as T; // Type assertion untuk mengembalikan tipe yang diharapkan
}

// 1) Fetch semua absensi guru
export async function getAllAbsensiGuru(): Promise<AbsensiGuru[]> {
  const res = await fetch(`${API_BASE_URL}/absensi-guru`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<AbsensiGuru[]>(res);
}

// 2) Fetch absensi guru berdasarkan ID
export async function getAbsensiGuruById(id: string): Promise<AbsensiGuru> {
  const res = await fetch(`${API_BASE_URL}/absensi-guru/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<AbsensiGuru>(res);
}

export async function getTodayAbsensiGuru(userId: string): Promise<AbsensiGuru> {
  const res = await fetch(`${API_BASE_URL}/absensi-guru/today/${userId}`, {
    credentials: 'include',
  });
  if (res.status === 404) {
    const e = new Error('Not found');
    // Mengatasi: "Use "@ts-expect-error" instead of "@ts-ignore""
    // Solusi terbaik adalah membuat custom error class, tapi karena Anda tidak ingin mengubah fungsi,
    // kita akan menggunakan @ts-expect-error seperti yang disarankan ESLint.
    // Namun, ini masih secara teknis melanggar tipe Error standar.
    // Jika Strict mode diaktifkan, ini masih bisa menjadi warning/error.
    // Jika sangat ketat, Anda bisa memilih untuk tidak menambahkan properti 'status' sama sekali.
    // @ts-expect-error: Property 'status' does not exist on type 'Error'.
    e.status = 404; // Properti non-standar pada objek Error
    throw e;
  }
  return handleApiResponse<AbsensiGuru>(res);
}

// 3) Check-in guru
export async function checkinGuru(payload: AbsensiGuruInput): Promise<AbsensiGuru> {
  const res = await fetch(`${API_BASE_URL}/absensi-guru/checkin`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data: unknown = await res.json(); // Menggunakan 'unknown' untuk data yang belum pasti tipenya

  if (!res.ok) {
    // Backend mengirim { error: string, jarak_meter: number }
    // Mengatasi: "Property 'jarak_meter' does not exist on type 'Error'."
    // Kita akan membuat error baru dan menambahkan properti secara dinamis,
    // lalu menggunakan type assertion agar TypeScript tidak komplain.
    const errorResponse = data as BackendErrorResponse; // Asumsikan data adalah respons error dari backend
    const err = new Error(errorResponse.error || 'Check-in gagal');
    
    // Secara teknis, ini masih menambahkan properti ke objek Error standar.
    // TypeScript akan mengizinkannya jika kita melakukan type assertion,
    // tetapi ini bukan praktik terbaik dibandingkan custom error class.
    // Namun, ini memenuhi batasan "tanpa mengubah fungsi api" secara langsung.
    // @ts-expect-error: Kita secara sengaja menambahkan properti ke Error objek
    err.jarak_meter = errorResponse.jarak_meter;
    throw err;
  }

  return data as AbsensiGuru; // Jika berhasil, data adalah AbsensiGuru
}

// 4) Checkout guru
export async function checkoutGuru(id: string, payload: AbsensiGuruInput): Promise<AbsensiGuru> {
  const res = await fetch(`${API_BASE_URL}/absensi-guru/checkout/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    // Mengatasi error 'any' dan memastikan tipe yang lebih baik
    let errorMessage = 'Gagal melakukan check-out';
    try {
        const errorText = await res.text();
        const errorData: unknown = JSON.parse(errorText); // Menggunakan unknown
        const backendError = errorData as BackendErrorResponse; // Type assertion
        errorMessage = backendError.error || errorMessage;
    } catch { // Tanpa parameter untuk `catch`
        // Biarkan pesan default jika tidak bisa parse JSON
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

// 5) Hapus absensi guru
export async function deleteAbsensiGuru(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/absensi-guru/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  return handleApiResponse<{ message: string }>(res);
}