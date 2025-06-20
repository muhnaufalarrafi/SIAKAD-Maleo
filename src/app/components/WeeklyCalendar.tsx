// src/app/components/WeeklyCalendar.tsx
'use client';

import React from 'react';

interface WeeklyCalendarProps {
  /** Label hari & tanggal, ex: [{ label: 'Mon', date: '10' }, …] */
  days: { label: string; date: string }[];
  /** Slot waktu, ex: ['12AM','1AM',…] */
  timeSlots: string[];
  /** Optional event render function per sel */
  renderEvent?: (dayIndex: number, time: string) => React.ReactNode;
}

export default function WeeklyCalendar({
  days,
  timeSlots,
  renderEvent
}: WeeklyCalendarProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">January 2022</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded hover:bg-gray-100">
            {/* Left arrow icon */}
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="px-4 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700">
            Today
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            {/* Right arrow icon */}
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <select className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50">
            <option>Week view</option>
            <option>Month view</option>
          </select>
          <button className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Add event
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-auto">
        <table className="min-w-full table-fixed border-collapse">
          <thead>
            <tr>
              {/* Waktu */}
              <th className="sticky top-0 left-0 z-10 bg-gray-50 px-4 py-2 text-left text-sm font-semibold border-b border-gray-200">
                Waktu
              </th>
              {/* Hari */}
              {days.map((d, i) => (
                <th
                  key={i}
                  className="sticky top-0 bg-gray-50 px-4 py-2 text-center text-sm font-semibold border-b border-gray-200"
                >
                  <div>{d.label}</div>
                  <div className="text-xs text-gray-500">{d.date}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {timeSlots.map((t, rowIdx) => (
              <tr
                key={t}
                className={`${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition`}
              >
                {/* Slot waktu */}
                <td className="sticky left-0 z-0 bg-white px-4 py-2 text-sm text-gray-600 whitespace-nowrap border-r border-gray-200">
                  {t}
                </td>
                {/* Cells per hari */}
                {days.map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-2 align-top">
                    <div className="h-12 relative">
                      {renderEvent?.(colIdx, t)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
