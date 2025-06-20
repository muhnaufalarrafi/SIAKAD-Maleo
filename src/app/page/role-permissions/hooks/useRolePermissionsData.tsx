// src/app/admin/role-permissions/hooks/useRolePermissionsData.tsx
import { useState, useEffect } from 'react';
import { getRolePermissions } from '@/app/lib/rbac/rolepermissions';
import { getAllRoles }        from '@/app/lib/rbac/roles';
import { getAllPermissions }  from '@/app/lib/rbac/permissions';
// import tipe‐tipenya
import type { RolePermission } from '@/app/lib/rbac/rolepermissions';
import type { Role }           from '@/app/lib/rbac/roles';
import type { Permission }     from '@/app/lib/rbac/permissions';


export function useRolePermissionsData() {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [roles, setRoles]             = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [rolesData, permsData, rpData] = await Promise.all([
          getAllRoles(),        // ← tanpa token
          getAllPermissions(),  // ← tanpa token
          getRolePermissions(), // ← tanpa token
        ]);
        setRoles(rolesData);
        setPermissions(permsData);
        setRolePermissions(rpData);
      } catch {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);  // hanya sekali di mount

  return { rolePermissions, roles, permissions, loading, error };
}
