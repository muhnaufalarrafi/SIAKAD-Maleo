// src/app/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import { navItems, NavItem } from './NavItems';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function userHasRole(userRoles: { name: string }[] = [], requiredRoles: string[] = []) {
  return requiredRoles.some(r => userRoles.some(u => u.name === r));
}

function userHasPermission(userPerms: { name: string }[] = [], requiredPerms: string[] = []) {
  return requiredPerms.some(p => userPerms.some(u => u.name === p));
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Tambahkan pengecekan untuk memastikan data user sudah ada
  if (!user) {
    return null;  // Tidak render Sidebar jika user belum ada
  }

  const filtered = navItems.filter(item => {
    const hasRole = item.requiredRoles && userHasRole(user?.roles || [], item.requiredRoles);
    const hasPerm = item.requiredPermissions && userHasPermission(user?.permissions || [], item.requiredPermissions);
    // Menyembunyikan item jika role atau permission tidak ada
    return Boolean(hasRole || hasPerm);
  });

  return (
    <aside className={clsx(
      'fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-[#18355E] to-[#0F2850] text-white shadow-lg transition-transform',
      { 'translate-x-0': isOpen, '-translate-x-full lg:translate-x-0': !isOpen }
    )}>
      <div className="h-16 flex items-center justify-between px-4 lg:justify-center">
        <span className="text-2xl font-bold">SIAKAD</span>
        <button onClick={onToggle} className="lg:hidden p-2 hover:bg-white/20 rounded">
          {/* tombol close */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="overflow-y-auto px-6 py-4 space-y-1 text-sm">
        {filtered.map((item: NavItem) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-4 py-2 rounded hover:bg-white/10 transition',
              pathname === item.href && 'bg-white/20'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
