// src/app/lib/curriculum/mataPelajaran.tsx

const API_BASE_URL = 'http://localhost:3000/api';

export interface Mapel {
  id: string;
  nama: string;
}

export interface MapelInput {
  nama: string;
}

export async function getAllMapel(token: string): Promise<Mapel[]> {
  const response = await fetch(`${API_BASE_URL}/mapel`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch mata pelajaran');
  }

  const data: Mapel[] = await response.json();
  return data;
}

export async function getMapelById(token: string, id: string): Promise<Mapel> {
  const response = await fetch(`${API_BASE_URL}/mapel/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 404) {
      throw new Error('Mapel not found');
    }
    throw new Error(error.error || 'Failed to fetch mata pelajaran');
  }

  const data: Mapel = await response.json();
  return data;
}

export async function createMapel(token: string, payload: MapelInput): Promise<Mapel> {
  const response = await fetch(`${API_BASE_URL}/mapel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create mata pelajaran');
  }

  const data: Mapel = await response.json();
  return data;
}

export async function updateMapel(
  token: string,
  id: string,
  payload: MapelInput
): Promise<Mapel> {
  const response = await fetch(`${API_BASE_URL}/mapel/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 404) {
      throw new Error('Mapel not found');
    }
    throw new Error(error.error || 'Failed to update mata pelajaran');
  }

  const data: Mapel = await response.json();
  return data;
}

export async function deleteMapel(token: string, id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/mapel/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 404) {
      throw new Error('Mapel not found');
    }
    throw new Error(error.error || 'Failed to delete mata pelajaran');
  }

  const data: { message: string } = await response.json();
  return data;
}
