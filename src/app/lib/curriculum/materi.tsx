// src/app/lib/curriculum/materi.tsx

const API_BASE_URL = 'http://localhost:3000/api';

export interface Materi {
  id: string;
  mata_pelajaran_id: string;
  nama: string;
  deskripsi?: string;
}

export interface MateriInput {
  mata_pelajaran_id: string;
  nama: string;
  deskripsi?: string;
}

export async function getAllMateri(token: string): Promise<Materi[]> {
  const res = await fetch(`${API_BASE_URL}/materi`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch materi');
  }
  return await res.json();
}

export async function getMateriById(token: string, id: string): Promise<Materi> {
  const res = await fetch(`${API_BASE_URL}/materi/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    if (res.status === 404) throw new Error('Materi not found');
    throw new Error(err.error || 'Failed to fetch materi');
  }
  return await res.json();
}

export async function createMateri(token: string, payload: MateriInput): Promise<Materi> {
  const res = await fetch(`${API_BASE_URL}/materi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create materi');
  }
  return await res.json();
}

export async function updateMateri(
  token: string,
  id: string,
  payload: MateriInput
): Promise<Materi> {
  const res = await fetch(`${API_BASE_URL}/materi/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    if (res.status === 404) throw new Error('Materi not found');
    throw new Error(err.error || 'Failed to update materi');
  }
  return await res.json();
}

export async function deleteMateri(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/materi/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    if (res.status === 404) throw new Error('Materi not found');
    throw new Error(err.error || 'Failed to delete materi');
  }
  return await res.json();
}
