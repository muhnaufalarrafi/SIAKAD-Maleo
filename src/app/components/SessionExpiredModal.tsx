// src/app/components/SessionExpiredModal.tsx
'use client';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export function SessionExpiredModal({ isOpen, onConfirm }: SessionExpiredModalProps) {
  if (!isOpen) return null;

  return (
    // Latar belakang overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      {/* Konten Modal */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800">Sesi Berakhir</h2>
        <p className="mt-2 text-gray-600">
          Sesi Anda telah berakhir karena akun ini telah login dari perangkat lain.
        </p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Ke Halaman Login
          </button>
        </div>
      </div>
    </div>
  );
}