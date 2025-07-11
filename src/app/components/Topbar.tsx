// src/app/components/Topbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ProfileModal } from './modal/ProfileModal';

interface TopbarProps {
  title?: string;
  onToggle: () => void;
}

// Komponen Avatar sederhana
const UserAvatar = ({ name }: { name:string }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="h-9 w-9 rounded-full bg-[#0F2850] flex items-center justify-center text-white font-bold text-sm">
      {initials}
    </div>
  );
};

export default function Topbar({ title, onToggle }: TopbarProps) {
  const { logout, user } = useAuth();
  const router = useRouter();
  
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  // State untuk mengontrol dropdown menu kustom
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Efek untuk menutup dropdown saat mengklik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const displayName = user?.username || 'Pengguna';
  const displayRole = user?.roles?.[0]?.name || '';
  const displayEmail = user?.email || '';

  return (
    <>
      <header className="h-20 bg-white shadow-sm flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
        {/* Sisi Kiri: Tombol Burger & Judul */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggle}
            className="lg:hidden rounded-md p-2 -ml-2 hover:bg-gray-100 text-[#0F2850]"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="text-xl font-semibold text-[#0F2850] hidden sm:block">{title}</h1>
        </div>
        
        {/* Sisi Kanan: Menu Pengguna (Dropdown Kustom) */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-3 rounded-full p-1 hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18355E] focus-visible:ring-offset-2"
            aria-label="User menu"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <div className="hidden sm:block text-sm text-gray-600 text-right leading-tight">
              <div className="font-semibold text-[#18355E]">{displayName}</div>
              <div className="text-xs capitalize">{displayRole}</div>
            </div>
            <UserAvatar name={displayName} />
          </button>
          
          {/* Konten Dropdown */}
          {isDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 p-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
            >
              <div className="px-2 py-1.5 text-xs text-gray-500" role="none">
                {displayEmail}
              </div>
              <div className="h-[1px] bg-gray-200 m-1" role="none"></div>
              
              <button
                onClick={() => {
                  setProfileModalOpen(true);
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 rounded-md hover:bg-[#F5F8FF] hover:text-[#18355E] cursor-pointer focus:outline-none focus:bg-[#F5F8FF]"
                role="menuitem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                <span>Edit Profil</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 rounded-md hover:bg-red-50 cursor-pointer focus:outline-none focus:bg-red-50"
                role="menuitem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Modal profil tetap sama, akan muncul saat state-nya true */}
      {user && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          userId={user.id} 
        />
      )}
    </>
  );
}
