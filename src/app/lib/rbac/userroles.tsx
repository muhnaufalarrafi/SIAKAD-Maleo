// src\app\lib\rbac\userroles.tsx
// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface UserRole {
  user_id: string;
  role_id: number;
}

// Helper untuk handle response
async function handleApiResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'API request failed');
  }
  return res.json();
}

// GET /user-roles/
export async function getAllUserRoles(): Promise<UserRole[]> {
  const res = await fetch(`${API_BASE_URL}/user-roles`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<UserRole[]>(res);
}

// GET /user-roles/user/:user_id
export async function getUserRolesByUserId(userId: string): Promise<UserRole[]> {
  const res = await fetch(`${API_BASE_URL}/user-roles/user/${userId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<UserRole[]>(res);
}

// GET /user-roles/role/:role_id
export async function getUserRolesByRoleId(roleId: string | number): Promise<UserRole[]> {
  const res = await fetch(`${API_BASE_URL}/user-roles/role/${roleId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<UserRole[]>(res);
}

// POST /user-roles/
export async function assignUserRole(payload: UserRole): Promise<UserRole> {
  const res = await fetch(`${API_BASE_URL}/user-roles`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<UserRole>(res);
}

// DELETE /user-roles/
export async function removeUserRole(payload: UserRole): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/user-roles`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<{ message: string }>(res);
}
