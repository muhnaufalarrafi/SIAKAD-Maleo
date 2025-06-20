// src/app/admin/role-permissions/page.tsx
'use client';

import Tabs from '@/app/components/Tabs';
import { useState } from 'react';
import { useRolePermissionsData } from './hooks/useRolePermissionsData';
import { RolePermissionPanel } from '../../components/RolePermissionPanel';
import { RolesPanel } from '../..//components/RolesPanel';
import { PermissionsPanel } from '../../components/PermissionsPanel';

export default function RolePermissionsPage() {
  const { rolePermissions, roles, permissions, loading, error } = useRolePermissionsData();
  const [activeTab, setActiveTab] = useState<'rolePermission'|'role'|'permission'>('rolePermission');

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F5F8FF] p-6">
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'rolePermission' && (
        <RolePermissionPanel
          data={rolePermissions}
          roles={roles}
          permissions={permissions}     
          onRefresh={() => location.reload()}
        />
      )}
      {activeTab === 'role' && (
        <RolesPanel roles={roles} onRefresh={() => location.reload()} />
      )}
      {activeTab === 'permission' && (
        <PermissionsPanel permissions={permissions} onRefresh={() => location.reload()} />
      )}
    </div>
  );
}
