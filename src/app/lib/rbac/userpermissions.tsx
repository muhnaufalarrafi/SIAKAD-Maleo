// src\app\lib\rbac\userpermissions.tsx
// Mengakses variabel lingkungan dari process.env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type OverrideType = 'allow' | 'deny';

export interface UserPermission {
  user_id: string;
  permission_id: number;
  override_type: OverrideType;
}

// Helper untuk handle response
async function handleApiResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'API request failed');
  }
  return res.json();
}

// GET /user-permissions/
export async function getAllUserPermissions(): Promise<UserPermission[]> {
  const res = await fetch(`${API_BASE_URL}/user-permissions`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<UserPermission[]>(res);
}

// GET /user-permissions/user/:user_id
export async function getUserPermissionsByUserId(userId: string): Promise<UserPermission[]> {
  const res = await fetch(`${API_BASE_URL}/user-permissions/user/${userId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<UserPermission[]>(res);
}

// GET /user-permissions/permission/:permission_id
export async function getUsersByPermissionId(permissionId: number | string): Promise<UserPermission[]> {
  const res = await fetch(`${API_BASE_URL}/user-permissions/permission/${permissionId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleApiResponse<UserPermission[]>(res);
}

// POST /user-permissions/
export async function assignUserPermission(payload: UserPermission): Promise<UserPermission> {
  const res = await fetch(`${API_BASE_URL}/user-permissions`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<UserPermission>(res);
}

// DELETE /user-permissions/
export async function removeUserPermission(payload: {
  user_id: string;
  permission_id: number;
}): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/user-permissions`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<{ message: string }>(res);
}
