// src/app/lib/users/tutor.ts

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Tutor {
  id: string;
  user_id: string | null;
  nama_lengkap: string;
  jenis_kelamin?: string;
  no_hp?: string;
  email_pribadi?: string;
  alamat?: string;
  jenis_tutor: "guru" | "relawan";
  nomor_identitas?: string;
  bidang_keahlian?: string;
}

// Hanya field yang di-input user; user_id di-assign di backend
export interface TutorInput {
  nama_lengkap: string;
  jenis_kelamin?: string;
  no_hp?: string;
  email_pribadi?: string;
  alamat?: string;
  jenis_tutor: string;
  nomor_identitas?: string;
  bidang_keahlian?: string;
}

// Interface untuk respons error dari API
interface ApiErrorResponse {
  error?: string;
  message?: string; // Beberapa API menggunakan 'message' untuk pesan error
}

// ====================================================================
// Utility untuk handle JSON + error (mengatasi masalah `any`)
// ====================================================================
async function handleApiResponse<T>(res: Response): Promise<T> {
  let data: unknown; // Lebih aman daripada 'any' di awal
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch { // Tanpa parameter untuk `catch` jika tidak digunakan
    data = {}; // Jika parsing gagal, set ke objek kosong
  }

  if (!res.ok) {
    // Asumsikan 'data' adalah ApiErrorResponse untuk mengakses properti error
    const errorData = data as ApiErrorResponse;
    // Menggunakan 'message' atau 'error' untuk pesan error
    throw new Error(errorData.message || errorData.error || 'API request failed');
  }
  return data as T; // Type assertion untuk mengembalikan tipe yang diharapkan
}

/** GET /api/tutors */
export async function getAllTutors(): Promise<Tutor[]> {
  const res = await fetch(`${API_BASE_URL}/tutors`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Tutor[]>(res);
}

/** GET /api/tutors/:id */
export async function getTutorById(id: string): Promise<Tutor> {
  const res = await fetch(`${API_BASE_URL}/tutors/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Tutor>(res);
}

/** GET /api/tutors/user/:user_id */
export async function getTutorByUserId(userId: string): Promise<Tutor> {
  const res = await fetch(`${API_BASE_URL}/tutors/user/${userId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<Tutor>(res);
}

/** POST /api/tutors */
export async function createTutor(payload: TutorInput): Promise<Tutor> {
  const res = await fetch(`${API_BASE_URL}/tutors`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<Tutor>(res);
}

/** PUT /api/tutors/:id */
export async function updateTutor(id: string, payload: TutorInput): Promise<Tutor> {
  const res = await fetch(`${API_BASE_URL}/tutors/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<Tutor>(res);
}

/** DELETE /api/tutors/:id */
export async function deleteTutor(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/tutors/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<{ message: string }>(res);
}
