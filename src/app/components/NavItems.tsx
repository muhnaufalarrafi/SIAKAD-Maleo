// src/components/NavItems.tsx
import {
  HiHome,
  HiUserCircle,
  HiShieldCheck,
  HiViewGrid,
  HiAcademicCap,
  HiBookOpen,
  HiCollection,
  HiDocumentText,
  HiUserGroup,
  HiClipboardCheck,
  HiClipboardList,
  HiCalendar,
  HiUsers,
} from 'react-icons/hi'; // Gunakan hi saja seperti permintaan
import { ReactNode } from 'react';

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

export const navItems: NavItem[] = [
  {
    href: '/page/dashboard',
    label: 'Dashboard',
    icon: <HiHome className="h-6 w-6 text-gray-300" />,
    requiredRoles: ['superadmin', 'admin'],
  },
  {
    href: '/page/tutor',
    label: 'Dashboard',
    icon: <HiHome className="h-6 w-6 text-gray-300" />,
    requiredRoles: ['tutor'],
  },
  {
    href: '/page/users',
    label: 'Users',
    icon: <HiUserCircle className="h-6 w-6 text-gray-300" />, 
    requiredPermissions: ['users.create', 'users.read', 'users.update', 'users.delete'],
  },
  {
    href: '/page/role-permissions',
    label: 'Role & Permission',
    icon: <HiShieldCheck className="h-6 w-6 text-gray-300" />,
    requiredPermissions: [
      'user_roles.assign',
      'user_roles.delete',
      'role_permissions.assign',
      'role_permissions.delete',
      'user_permissions.override',
      'user_permissions.delete',
      'roles.create',
      'roles.read',
      'roles.update',
      'roles.delete',
      'permissions.create',
      'permissions.read',
      'permissions.update',
      'permissions.delete',
    ],
  },
  {
    href: '/page/program',
    label: 'Program',
    icon: <HiViewGrid className="h-6 w-6 text-gray-300" />,
    requiredPermissions: ['program.create', 'program.update', 'program.delete'],
  },
  {
    href: '/page/matapelajaran',
    label: 'Mata Pelajaran',
    icon: <HiAcademicCap className="h-6 w-6 text-gray-300" />,
    requiredPermissions: ['mata_pelajaran.create', 'mata_pelajaran.update', 'mata_pelajaran.delete'],
  },
  {
    href: '/page/materi',
    label: 'Materi',
    icon: <HiBookOpen className="h-6 w-6 text-gray-300" />,
    requiredPermissions: ['materi.create', 'materi.update', 'materi.delete'],
  },
  {
    href: '/page/sub-materi',
    label: 'Sub-Materi',
    icon: <HiCollection className="h-6 w-6 text-gray-300" />,
    requiredPermissions: ['sub-materi.create', 'sub-materi.update', 'sub-materi.delete'],
  },
  {
    href: '/page/modul',
    label: 'Modul',
    icon: <HiDocumentText className="h-6 w-6 text-gray-300" />,
    requiredPermissions: ['modul.create', 'modul.update', 'modul.delete'],
  },
  {
    href: '/page/siswa-tutor',
    label: 'Siswa & Tutor',
    icon: <HiUserGroup className="h-6 w-6 text-gray-300" />,
    requiredPermissions: ['siswa.create', 'siswa.update', 'siswa.delete', 'tutor.create', 'tutor.update', 'tutor.delete'],
  },
  {
    href: '/page/class',
    label: 'Kelas',
    icon: <HiUsers className="h-6 w-6 text-gray-300" />,
    requiredPermissions: ['class.create', 'class.update', 'class.delete', 'class-siswa.assign', 'class-siswa.update', 'class-siswa.delete' ],
  },
  {
    href: '/page/jadwal-kelas',
    label: 'Jadwal Kelas',
    icon: <HiCalendar className="h-6 w-6 text-gray-300" />,
    requiredPermissions: ['jadwal.create', 'jadwal.update', 'jadwal.delete'],
  },
  {
    href: '/page/tutor-schedule',
    label: 'Jadwal Tutor',
    icon: <HiUsers className="h-6 w-6 text-gray-300" />,
    requiredRoles: ['tutor'],
  },
  {
    href: '/page/kelas-siswa',
    label: 'Kelas Siswa',
    icon: <HiUsers className="h-6 w-6 text-gray-300" />,
    requiredRoles: ['tutor'],
  },
  {
    href: '/page/absen-tutor',
    label: 'Absen Tutor',
    icon: <HiClipboardCheck className="h-6 w-6 text-gray-300" />,
    requiredRoles: ['tutor'],
  },
  {
    href: '/page/absen-siswa',
    label: 'Absen Siswa',
    icon: <HiClipboardList className="h-6 w-6 text-gray-300" />,
    requiredRoles: ['tutor'],
  },
  {
    href: '/page/rekap-absen',
    label: 'Rekap Absen Siswa',
    icon: <HiClipboardList className="h-6 w-6 text-gray-300" />,
    requiredRoles: ['tutor','superadmin'],
  },
  {
    href: '/page/rekap-tutor',
    label: 'Rekap Absen Tutor',
    icon: <HiClipboardList className="h-6 w-6 text-gray-300" />,
    requiredRoles: ['admin','superadmin'],
  },
  {
    href: '/page/e-reference',
    label: 'E-Reference',
    icon: <HiBookOpen className="h-6 w-6 text-gray-300" />,
    requiredPermissions: ['e-reference.create', 'e-reference.update', 'e-reference.delete'],
  },
];