// src/app/lib/curriculum/submateri.tsx

const API_BASE_URL = 'http://localhost:3000/api';

export interface SubMateri {
  id: string;
  materi_id: string;
  nama: string;
  ketercapaian?: string;
}

export interface SubMateriInput {
  materi_id: string;
  nama: string;
  ketercapaian?: string;
}

export async function getAllSubMateri(token: string): Promise<SubMateri[]> {
  const res = await fetch(`${API_BASE_URL}/sub-materi`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch sub materi');
  }
  return await res.json();
}

export async function getSubMateriById(token: string, id: string): Promise<SubMateri> {
  const res = await fetch(`${API_BASE_URL}/sub-materi/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    if (res.status === 404) throw new Error('Sub materi not found');
    throw new Error(err.error || 'Failed to fetch sub materi');
  }
  return await res.json();
}

export async function createSubMateri(
  token: string,
  payload: SubMateriInput
): Promise<SubMateri> {
  const res = await fetch(`${API_BASE_URL}/sub-materi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create sub materi');
  }
  return await res.json();
}

export async function updateSubMateri(
  token: string,
  id: string,
  payload: SubMateriInput
): Promise<SubMateri> {
  const res = await fetch(`${API_BASE_URL}/sub-materi/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    if (res.status === 404) throw new Error('Sub materi not found');
    throw new Error(err.error || 'Failed to update sub materi');
  }
  return await res.json();
}

export async function deleteSubMateri(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/sub-materi/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    if (res.status === 404) throw new Error('Sub materi not found');
    throw new Error(err.error || 'Failed to delete sub materi');
  }
  return await res.json();
}
