// src/app/components/ClassTabs.tsx
'use client';

import React from 'react';

interface ClassTabsProps {
  activeTab: 'kelas' | 'assignment';
  onTabChange: (tab: 'kelas' | 'assignment') => void;
}

const ClassTabs: React.FC<ClassTabsProps> = ({ activeTab, onTabChange }) => (
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto flex space-x-4">
      <button
        onClick={() => onTabChange('kelas')}
        className={`
          flex-1 text-center py-3 text-sm font-medium
          ${
            activeTab === 'kelas'
              ? 'text-[#18355E] border-b-2 border-[#18355E]'
              : 'text-gray-500 hover:text-[#18355E] border-b-2 border-transparent'
          }
        `}
      >
        Data Kelas
      </button>
      <button
        onClick={() => onTabChange('assignment')}
        className={`
          flex-1 text-center py-3 text-sm font-medium
          ${
            activeTab === 'assignment'
              ? 'text-[#18355E] border-b-2 border-[#18355E]'
              : 'text-gray-500 hover:text-[#18355E] border-b-2 border-transparent'
          }
        `}
      >
        Penugasan Siswa
      </button>
    </div>
  </div>
);

export default ClassTabs;
