// src/app/components/UserTabs.tsx
'use client';

import React from 'react';

interface UserTabsProps {
  activeTab: 'siswa' | 'tutor';
  onTabChange: (tab: 'siswa' | 'tutor') => void;
}

const UserTabs: React.FC<UserTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex space-x-4">
        <button
          onClick={() => onTabChange('siswa')}
          className={`
            flex-1 text-center py-3 text-sm font-medium
            ${
              activeTab === 'siswa'
                ? 'text-[#18355E] border-b-2 border-[#18355E]'
                : 'text-gray-500 hover:text-[#18355E] border-b-2 border-transparent'
            }
          `}
        >
          Data Siswa
        </button>
        <button
          onClick={() => onTabChange('tutor')}
          className={`
            flex-1 text-center py-3 text-sm font-medium
            ${
              activeTab === 'tutor'
                ? 'text-[#18355E] border-b-2 border-[#18355E]'
                : 'text-gray-500 hover:text-[#18355E] border-b-2 border-transparent'
            }
          `}
        >
          Data Tutor
        </button>
      </div>
    </div>
  );
};

export default UserTabs;
