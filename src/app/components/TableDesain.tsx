// src/app/components/TableDesain.tsx
'use client';

import React from 'react';

export interface TableDesainColumn<T> {
  header: string;
  accessor: (row: T, rowIndex: number) => React.ReactNode;
  width?: string; // <--- TAMBAHKAN BARIS INI
}

export interface TableDesainProps<T> {
  columns: TableDesainColumn<T>[];
  data: T[];
}

export default function TableDesain<T>({ columns, data }: TableDesainProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm bg-white rounded-3xl shadow ring-1 ring-[#18355E]/20 overflow-hidden">
        <thead className="bg-[#18355E] text-white">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="py-3 px-4 text-left">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-[#F5F8FF]/60">
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="py-3 px-4 text-[#0F2850] whitespace-nowrap"
                >
                  {col.accessor(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}