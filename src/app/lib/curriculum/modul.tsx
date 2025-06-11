// src/app/lib/curriculum/modul.tsx

const API_BASE_URL = 'http://localhost:3000/api';

export interface Modul {
  id: string;
  mata_pelajaran_id: string;
  nama: string;
  deskripsi?: string;
  e_reference_id?: string;
  mapel_nama: string;
  reference_judul?: string;
  reference_url?: string;
}

export interface ModulInput {
  mata_pelajaran_id: string;
  nama: string;
  deskripsi?: string;
  e_reference_id?: string;
}

export async function getAllModul(token: string): Promise<Modul[]> {
  const res = await fetch(`${API_BASE_URL}/modul`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch modul');
  }
  return await res.json();
}

export async function getModulById(token: string, id: string): Promise<Modul> {
  const res = await fetch(`${API_BASE_URL}/modul/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    if (res.status === 404) throw new Error('Modul not found');
    throw new Error(err.error || 'Failed to fetch modul');
  }
  return await res.json();
}

export async function createModul(token: string, payload: ModulInput): Promise<Modul> {
  const res = await fetch(`${API_BASE_URL}/modul`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create modul');
  }
  return await res.json();
}

export async function updateModul(
  token: string,
  id: string,
  payload: ModulInput
): Promise<Modul> {
  const res = await fetch(`${API_BASE_URL}/modul/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    if (res.status === 404) throw new Error('Modul not found');
    throw new Error(err.error || 'Failed to update modul');
  }
  return await res.json();
}

export async function deleteModul(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/modul/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    if (res.status === 404) throw new Error('Modul not found');
    throw new Error(err.error || 'Failed to delete modul');
  }
  return await res.json();
}
