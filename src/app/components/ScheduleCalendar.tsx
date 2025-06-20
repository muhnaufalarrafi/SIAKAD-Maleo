'use client';

import React from 'react';

export interface TimeSlot {
  time: string;
  schedule: Record<string, { subject: string; room: string } | null>;
}

export interface ScheduleCalendarProps {
  days: { key: string; label: string }[];
  timeSlots: TimeSlot[];
}

export default function ScheduleCalendar({
  days,
  timeSlots
}: ScheduleCalendarProps) {
  const todayKey = new Date().toLocaleDateString('id-ID', { weekday: 'long' });

  return (
    <div className="bg-white rounded-2xl shadow ring-1 ring-[#18355E]/20 overflow-x-auto">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="sticky top-0 bg-gradient-to-r from-[#18355E] to-[#0F2850] text-white">
          <tr>
            {/* Kolom waktu */}
            <th className="sticky left-0 z-10 px-6 py-3 text-left font-semibold uppercase text-xs">
              Waktu
            </th>
            {/* Header hari */}
            {days.map(d => (
              <th
                key={d.key}
                className={
                  `px-6 py-3 text-left font-semibold uppercase text-xs ` +
                  (d.label === todayKey ? 'bg-[#0F2850]/30' : '')
                }
              >
                {d.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {timeSlots.map((slot, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <tr
                key={slot.time}
                className={`
                  ${isEven ? 'bg-white' : 'bg-gray-50'}
                  hover:bg-[#F5F8FF]/50
                  transition-colors duration-150
                `}
              >
                {/* Cell waktu */}
                <td className="sticky left-0 z-0 bg-white px-6 py-3 font-medium text-[#0F2850] whitespace-nowrap border-r border-gray-200">
                  {slot.time}
                </td>

                {/* Cell mata pelajaran */}
                {days.map(d => {
                  const cell = slot.schedule[d.key];
                  return (
                    <td
                      key={d.key}
                      className="px-6 py-3 align-top border-r border-gray-200"
                    >
                      {cell ? (
                        <div className="bg-[#F6C443]/20 text-[#18355E] p-3 rounded-lg shadow-inner">
                          <div className="font-medium">{cell.subject}</div>
                          <div className="mt-1 text-xs text-gray-600">{cell.room}</div>
                        </div>
                      ) : (
                        <span className="text-gray-300">–</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
