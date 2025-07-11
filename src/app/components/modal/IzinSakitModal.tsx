'use client';

import { useState, FormEvent } from 'react';

interface IzinSakitModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Fungsi ini akan menerima status dan catatan dari modal
  onSubmit: (status: 'izin' | 'sakit', catatan: string) => Promise<void>;
}

export const IzinSakitModal = ({ isOpen, onClose, onSubmit }: IzinSakitModalProps) => {
  const [status, setStatus] = useState<'izin' | 'sakit'>('izin');
  const [catatan, setCatatan] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!catatan) {
      alert('Catatan atau keterangan wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(status, catatan);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold text-[#18355E] mb-4">Ajukan Izin / Sakit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="status-select" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'izin' | 'sakit')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-[#18355E]"
            >
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
            </select>
          </div>
          <div>
            <label htmlFor="catatan-izin" className="block text-sm font-medium text-gray-700">Catatan / Keterangan</label>
            <textarea
              id="catatan-izin"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Tuliskan alasan atau keterangan Anda di sini..."
              className="mt-1 w-full p-2 border border-gray-300 rounded-md min-h-[100px] text-[#18355E]"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-[#18355E] rounded-md hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !catatan}
              className="px-4 py-2 bg-[#18355E] text-white rounded-md hover:bg-[#0F2850] disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
