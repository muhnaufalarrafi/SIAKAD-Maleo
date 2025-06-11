// src\app\components\Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';  // Menggunakan context

interface Role {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  name: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', 
    svg : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor">
    <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2"
    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>, 
    requiredRoles: ['superadmin', 'admin'] },
  { href: '/admin/users', label: 'User', 
    svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor">
          <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2"
           d="M17 20h5V10a3 3 0 00-3-3h-4M2 20h5V10a3 3 0 00-3-3H0m8 0a4 4 0 118 0 4 4 0 01-8 0z"/></svg>, 
    requiredPermissions: ['users.create', 'users.read', 'users.update', 'users.delete'] },
  { href: '/admin/role-permissions', label: 'Role & Permission', 
    svg:  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor">
          <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 1.343-3 3v1h6v-1c0-1.657-1.343-3-3-3z"/>
          <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 17h14v2H5z"/></svg>, 
    requiredPermissions: ['user_roles.assign','role_permissions.assign','user_permissions.override','role-permissions.create', 'role-permissions.read', 'role_permissions.update', 'role_permissions.delete','roles.create', 'roles.read', 'roles.update', 'roles.delete, permissions.create', 'permissions.read', 'permissions.update', 'permissions.delete'] },
  { href: '/admin/program', label: 'program', 
    svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor">
          <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6v6l4 2"/>
          <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 13h4l3-3 4 4 3-3h4"/></svg>, 
    requiredPermissions: ['permissions.create', 'permissions.read', 'permissions.update', 'permissions.delete'] },
  { href: '/admin/matapelajaran', label: 'mata_pelajaran', 
    svg:         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor">
          <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 16h8M8 12h8M8 8h8"/>
        </svg>, 
    requiredPermissions: ['user_roles.assign'] },
  { href: '/admin/materi', label: 'Materi', emoji: '🔑', requiredPermissions: ['role_permissions.assign'] },
  { href: '/admin/sub-materi', label: 'Sub-Materi', emoji: '🔄', requiredPermissions: ['user_permissions.override'] },
  { href: '/admin/modul', label: 'Modul', emoji: '🔄', requiredPermissions: ['user_permissions.override'] },
];

function userHasRole(userRoles: Role[] | undefined, requiredRoles: string[]) {
  if (!userRoles) return false;
  return requiredRoles.some(role => userRoles.some(r => r.name === role));
}

function userHasPermission(userPermissions: Permission[] | undefined, requiredPermissions: string[]) {
  if (!userPermissions) return false;
  return requiredPermissions.some(permission => userPermissions.some(p => p.name === permission));
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user } = useAuth();  // Ambil data user dari context
  const pathname = usePathname();

  // Filter navItems berdasarkan role dan permission user
  const filteredNavItems = navItems.filter((item) => {
    const roleCheck = userHasRole(user?.roles, item.requiredRoles || []);
    const permissionCheck = userHasPermission(user?.permissions, item.requiredPermissions || []);
    return roleCheck || permissionCheck;  // Jika salah satu role atau permission cocok, tampilkan menu
  });

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-40 w-64 text-white',
        'bg-gradient-to-b from-[#18355E] to-[#0F2850]',
        'transform transition-transform duration-200 ease-out',
        {
          'translate-x-0': isOpen,
          '-translate-x-full lg:translate-x-0': !isOpen,
        }
      )}
    >
      <div className="h-16 flex items-center px-4 lg:px-0 justify-between lg:justify-center">
        <span className="text-2xl font-extrabold tracking-wide">SIAKAD</span>
        <button onClick={onToggle} className="lg:hidden p-2 rounded-md hover:bg-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1 text-sm">
        {filteredNavItems.map(({ href, label, svg }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-white/10 transition',
              pathname === href && 'bg-white/20'
            )}
          >
            <span className="text-lg">{svg}</span>
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
