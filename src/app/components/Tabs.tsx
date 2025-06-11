// src/app/components/Tabs.tsx
import React from 'react';

interface TabsProps {
  activeTab: 'rolePermission' | 'role' | 'permission';
  onTabChange: (tab: 'rolePermission' | 'role' | 'permission') => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex space-x-4">
        {/* Tab Role & Permissions */}
        <button
          onClick={() => onTabChange('rolePermission')}
          className={`
            flex-1 text-center py-3 text-sm font-medium
            ${
              activeTab === 'rolePermission'
                ? 'text-[#18355E] border-b-2 border-[#18355E]'
                : 'text-gray-500 hover:text-[#18355E] border-b-2 border-transparent'
            }
          `}
        >
          Role &amp; Permissions
        </button>

        {/* Tab Roles */}
        <button
          onClick={() => onTabChange('role')}
          className={`
            flex-1 text-center py-3 text-sm font-medium
            ${
              activeTab === 'role'
                ? 'text-[#18355E] border-b-2 border-[#18355E]'
                : 'text-gray-500 hover:text-[#18355E] border-b-2 border-transparent'
            }
          `}
        >
          Roles
        </button>

        {/* Tab Permissions */}
        <button
          onClick={() => onTabChange('permission')}
          className={`
            flex-1 text-center py-3 text-sm font-medium
            ${
              activeTab === 'permission'
                ? 'text-[#18355E] border-b-2 border-[#18355E]'
                : 'text-gray-500 hover:text-[#18355E] border-b-2 border-transparent'
            }
          `}
        >
          Permissions
        </button>
      </div>
    </div>
  );
};

export default Tabs;
