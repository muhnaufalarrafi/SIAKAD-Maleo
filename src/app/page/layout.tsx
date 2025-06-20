// src\app\page\layout.tsx
'use client';

import { ReactNode, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import Footer from '@/app/components/Footer';
import { AuthProvider } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation';
import { navItems } from '@/app/components/NavItems';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Ambil label dari nav berdasarkan path
  const currentNav = navItems.find(item => pathname === item.href);
  const dynamicTitle = currentNav?.label || 'SIAKAD';

  return (
    <AuthProvider>
      <div className="min-h-screen flex bg-[#F5F8FF] relative z-0">
        {/* Sidebar tetap fixed dan punya z-index tinggi */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(v => !v)} />

        {/* Konten utama */}
        <div className="flex-1 flex flex-col relative z-10 lg:pl-64 bg-[#F5F8FF]">
          {/* Topbar dinamis */}
          <Topbar title={dynamicTitle} onToggle={() => setSidebarOpen(v => !v)} />

          {/* Main content */}
          <main className="flex-1 px-6 pt-10 pb-10 lg:px-10 space-y-6">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}
