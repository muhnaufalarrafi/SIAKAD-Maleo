// src/app/components/rekap-tutor/TutorFilterPanel.tsx
'use client';

import React from 'react';
import Select, { SingleValue } from 'react-select';
import { SelectOptionType } from '@/app/lib/types/types'; // Sesuaikan path jika perlu

interface TutorFilterPanelProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  selectedTutor: SingleValue<SelectOptionType>;
  setSelectedTutor: (option: SingleValue<SelectOptionType>) => void;
  tutorOptions: SelectOptionType[];
  isLoading: boolean;
  onResetFilters: () => void;
  onExportToExcel: () => void;
  isExportDisabled: boolean;
}

export const TutorFilterPanel = React.memo<TutorFilterPanelProps>(({
  startDate, setStartDate,
  endDate, setEndDate,
  selectedTutor, setSelectedTutor,
  tutorOptions,
  isLoading,
  onResetFilters,
  onExportToExcel,
  isExportDisabled
}) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="tutorFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter Tutor</label>
          <Select
            id="tutorFilter"
            options={tutorOptions}
            value={selectedTutor}
            onChange={setSelectedTutor}
            isClearable
            placeholder="Pilih Tutor..."
            isLoading={isLoading}
            noOptionsMessage={() => 'Tidak ada tutor'}
            styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onResetFilters}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Reset Filter
          </button>
          <button
            onClick={onExportToExcel}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
            disabled={isExportDisabled}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
});

TutorFilterPanel.displayName = 'TutorFilterPanel';