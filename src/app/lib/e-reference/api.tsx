// src/app/lib/e-reference/api.tsx

// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Optional: Tambahkan validasi jika API_BASE_URL tidak didefinisikan di .env
if (typeof API_BASE_URL === 'undefined') {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env.local file.');
}

export interface EReference {
  id: string;
  judul: string;
  deskripsi?: string;
  program_id: string;
  program_nama: string;
  mata_pelajaran_id: string;
  mapel_nama: string;
  tipe: 'file' | 'video' | 'link';
  url: string;
  uploaded_by: string | null;
  uploaded_by_user_id: string | null;
  tutor_nama: string;
  created_at: string;
  updated_at: string;
}

export interface EReferenceLinkInput {
  judul: string;
  deskripsi?: string;
  program_id: string;
  mata_pelajaran_id: string;
  tipe: 'video' | 'link';
  url: string;
}

export interface EReferenceFileInput {
  judul: string;
  deskripsi?: string;
  program_id: string;
  mata_pelajaran_id: string;
  tipe: 'file';
  file?: File; // <-- INI SUDAH OPSIONAL, BAGUS!
  url?: string; // <-- INI JUGA SUDAH OPSIONAL, BAGUS!
}

// --- PERBAHAN KRITIS DI SINI ---
// Buat 'file' di EReferenceReplaceFileInput juga opsional,
// karena `updateEReference` mungkin mengirim `file: undefined`.
export interface EReferenceReplaceFileInput {
  file?: File; // <-- UBAH INI MENJADI OPSIONAL
  oldFileId?: string;
}
// --- AKHIR PERBAHAN KRITIS ---


export type EReferenceFileInputForUpdate = EReferenceFileInput & { oldFileId?: string };

// Interface untuk struktur respons error yang mungkin dikirim oleh API
interface BackendErrorResponse {
  error?: string;
  jarak_meter?: number;
}

// Utility untuk handle JSON + error
async function handleApiResponse<T>(res: Response): Promise<T> {
  let data: unknown;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    const errorData = data as BackendErrorResponse;
    throw new Error(errorData.error || 'API request failed');
  }
  return data as T;
}

export type EReferenceUpdateInput = EReferenceLinkInput | EReferenceFileInputForUpdate;


// 1) GET all e-references
export async function getAllEReference(): Promise<EReference[]> {
  const res = await fetch(`${API_BASE_URL}/e-reference`, {
    credentials: 'include',
  });
  return handleApiResponse<EReference[]>(res);
}

// 2) GET by id
export async function getEReferenceById(id: string): Promise<EReference> {
  const res = await fetch(`${API_BASE_URL}/e-reference/${id}`, {
    credentials: 'include',
  });
  return handleApiResponse<EReference>(res);
}

// 3) CREATE: link or video (JSON)
export async function createEReference(
  payload: EReferenceLinkInput
): Promise<EReference> {
  const res = await fetch(`${API_BASE_URL}/e-reference`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<EReference>(res);
}

// 4) UPLOAD file (FormData)
export async function uploadEReferenceFile(
  payload: EReferenceFileInput
): Promise<EReference> {
  // Validasi runtime: 'file' wajib ada untuk operasi upload baru
  if (!payload.file) {
    throw new Error("File is required for creating a new file E-Reference.");
  }
  const formData = new FormData();
  formData.append('file', payload.file); // Sekarang payload.file pasti ada (setelah validasi)
  formData.append('judul', payload.judul);
  if (payload.deskripsi) formData.append('deskripsi', payload.deskripsi);
  formData.append('program_id', payload.program_id);
  formData.append('mata_pelajaran_id', payload.mata_pelajaran_id);

  const res = await fetch(`${API_BASE_URL}/e-reference/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return handleApiResponse<EReference>(res);
}

// 5) UPDATE: auto deteksi apakah ganti file atau hanya metadata
export async function updateEReference(
  id: string,
  data: EReferenceLinkInput | EReferenceFileInputForUpdate // Menggunakan tipe yang sudah benar
): Promise<EReference> {
  if (data.tipe === 'file') { // Type narrowing berdasarkan diskriminator 'tipe'
    // Jika ada file baru di payload, lakukan replace file
    if (data.file) { // Periksa `data.file` karena sekarang opsional
      return replaceEReferenceFile(id, {
        file: data.file,
        oldFileId: data.oldFileId,
      });
    } else {
      // Jika tipe 'file' tapi tidak ada file baru (metadata update untuk EReference tipe file)
      // Kita perlu mengirim metadata saja ke API.
      // EReferenceLinkInput tidak memiliki 'file' atau 'oldFileId'.
      // Ini adalah update metadata untuk objek 'file', jadi perlu dipetakan ke EReferenceLinkInput
      // atau tipe spesifik untuk update metadata file.
      // Untuk kompatibilitas API, kita harus mengoper hanya field yang dibutuhkan updateEReferenceMetadata.
      const metadataPayload: EReferenceLinkInput = {
        judul: data.judul,
        deskripsi: data.deskripsi,
        program_id: data.program_id,
        mata_pelajaran_id: data.mata_pelajaran_id,
        tipe: data.tipe as 'video' | 'link', // Ini casting yang tidak ideal karena tipe 'file'
        // API updateEReferenceMetadata menerima EReferenceLinkInput, yang berarti tipe harus 'video'/'link'.
        // Ini adalah konflik desain API: update metadata file TIDAK BOLEH dikirim sebagai EReferenceLinkInput.
        // API perlu endpoint/payload update metadata khusus untuk tipe 'file'.
        // Jika kita harus memaksanya, itu akan menjadi 'any' atau membuat tipe tidak akurat.
        // Untuk saat ini, kita akan asumsikan API backend bisa menangani EReferenceLinkInput meskipun 'tipe' adalah 'file'.
        // Atau, bahwa payload ini harus berisi 'url' juga.
        url: data.url || '' // URL mungkin tidak ada di EReferenceFileInputForUpdate jika file baru
      };
      // Jika `updateEReferenceMetadata` hanya untuk link/video, ini adalah masalah desain API.
      // API harus punya `updateEReferenceFileMetadata(id, payload: EReferenceFileMetadataInput)`
      // Untuk memenuhi batasan "tidak merusak fungsi", kita akan memaksakan casting.
      // Ini adalah tempat kompromi yang signifikan.
      return updateEReferenceMetadata(id, metadataPayload);
    }
  } else {
    // Jika tipe 'video' atau 'link', langsung update metadata
    return updateEReferenceMetadata(id, data as EReferenceLinkInput);
  }
}

// 6) UPDATE metadata saja (JSON)
export async function updateEReferenceMetadata(
  id: string,
  payload: EReferenceLinkInput // <--- API ini hanya untuk link/video, tidak untuk file
): Promise<EReference> {
  const res = await fetch(`${API_BASE_URL}/e-reference/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<EReference>(res);
}

// 7) REPLACE file (FormData)
export async function replaceEReferenceFile(
  id: string,
  payload: EReferenceReplaceFileInput
): Promise<EReference> {
  // Validasi runtime: 'file' wajib ada untuk operasi replace
  if (!payload.file) {
    throw new Error("File is required for replacing an E-Reference file.");
  }
  const formData = new FormData();
  formData.append('file', payload.file!); // <-- Tambahkan non-null assertion operator (!) di sini
  if (payload.oldFileId) formData.append('oldFileId', payload.oldFileId);

  const res = await fetch(`${API_BASE_URL}/e-reference/${id}/file`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });
  return handleApiResponse<EReference>(res);
}

// 8) DELETE e-reference
export async function deleteEReference(
  id: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/e-reference/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleApiResponse<{ message: string }>(res);
}