// src/app/lib/rbac/programs.ts

const API_BASE_URL = 'http://localhost:3000/api'; // Update this with your actual backend URL

export async function getAllPrograms(token: string) {
  const response = await fetch(`${API_BASE_URL}/programs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to load programs');
  }

  const data = await response.json();
  return data;
}
