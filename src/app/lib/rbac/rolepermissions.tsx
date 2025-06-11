const API_BASE_URL = 'http://localhost:3000/api'; // Ganti dengan URL API backend kamu

// Fungsi untuk mengambil semua role-permissions
export async function getRolePermissions(token: string) {
  const res = await fetch(`${API_BASE_URL}/role-permissions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil data role permissions');
  }

  const data = await res.json();
  return data;
}

// Fungsi untuk mengambil permissions berdasarkan roleId
export async function getPermissionsByRoleId(token: string, roleId: string) {
  const res = await fetch(`${API_BASE_URL}/rolepermissions/role/${roleId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Sertakan token untuk autentikasi
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil permissions untuk role');
  }

  const data = await res.json();
  return data;
}

// Fungsi untuk mengambil roles berdasarkan permissionId
export async function getRolesByPermissionId(token: string, permissionId: string) {
  const res = await fetch(`${API_BASE_URL}/rolepermissions/permission/${permissionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Sertakan token untuk autentikasi
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil roles untuk permission');
  }

  const data = await res.json();
  return data;
}

// Fungsi untuk menambahkan permission ke role
export async function assignRolePermission(token: string, roleId: string, permissionId: string) {
  const res = await fetch(`${API_BASE_URL}/rolepermissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Sertakan token untuk autentikasi
    },
    body: JSON.stringify({ role_id: roleId, permission_id: permissionId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal menambahkan permission ke role');
  }

  const data = await res.json();
  return data;
}

// Fungsi untuk menghapus permission dari role
export async function removeRolePermission(token: string, roleId: string, permissionId: string) {
  const res = await fetch(`${API_BASE_URL}/rolepermissions`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Sertakan token untuk autentikasi
    },
    body: JSON.stringify({ role_id: roleId, permission_id: permissionId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal menghapus permission dari role');
  }

  const data = await res.json();
  return data;
}
