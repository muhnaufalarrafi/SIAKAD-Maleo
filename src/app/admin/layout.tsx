'use client';

import { ReactNode, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import Footer from '@/app/components/Footer';
import { AuthProvider } from '@/app/context/AuthContext';  // Import AuthProvider

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>  {/* Bungkus seluruh aplikasi dengan AuthProvider */}
      <div className="min-h-screen flex bg-[#F5F8FF]">
        {/* SIDEBAR */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

        {/* BAGIAN KANAN: Topbar, Main, Footer */}
        <div className="flex-1 flex flex-col lg:pl-64">
          {/* Topbar */}
          <Topbar title="Kelola User" onToggle={() => setSidebarOpen((v) => !v)} />

          {/* Main: flex-1 agar mengisi ruang yang tersisa */}
          <main className="flex-1 px-6 pt-10 pb-10 lg:px-10 space-y-6 bg-[#F5F8FF]">
            {children}
          </main>

          {/* Footer: akan selalu berada di bawah karena main punya flex-1 */}
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}
