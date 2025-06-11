// frontend/src/app/components/Topbar.tsx
'use client';

interface TopbarProps {
  title?: string;
  onToggle: () => void;
}

export default function Topbar({ title, onToggle }: TopbarProps) {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6 lg:px-10">
      {/* Tombol burger (≡) hanya di mobile */}
      <button
        onClick={onToggle}
        className="lg:hidden rounded-md p-2 -ml-2 hover:bg-gray-100 text-[#0F2850]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="text-xl font-semibold text-[#0F2850]">{title}</h1>

      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-sm text-gray-500">Admin</span>
        <button className="rounded-full p-2 bg-[#18355E] hover:bg-[#0F2850] text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
