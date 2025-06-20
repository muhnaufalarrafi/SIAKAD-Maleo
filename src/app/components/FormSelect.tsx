// npm install @headlessui/react
// src/app/components/FormSelect.tsx
'use client';

import { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: FormSelectOption[];
}

export default function FormSelect({
  label,
  value,
  onChange,
  placeholder,
  options
}: FormSelectProps) {
  const [query, setQuery] = useState('');

  // filter options by label
  const filtered = query === ''
    ? options
    : options.filter(opt =>
        opt.label.toLowerCase().includes(query.toLowerCase())
      );

  // find current label for displayValue
  const selectedLabel =
    options.find(opt => opt.value === value)?.label || '';

  return (
    <div className="flex-1">
      {label && (
        <label className="block mb-1 text-sm font-medium text-[#0F2850]">
          {label}
        </label>
      )}

      <Combobox value={value} onChange={onChange}>
        <div className="relative">
          <Combobox.Input
            className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-[#18355E] text-[#18355E]"
            placeholder={placeholder}
            displayValue={() => selectedLabel}
            onChange={e => setQuery(e.target.value)}
          />

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options
              static
              className="absolute z-10 mt-1 w-full max-h-60 overflow-auto
                         bg-white border border-gray-200 rounded-xl py-1 shadow-lg"
            >
              {filtered.length === 0 && (
                <div className="px-4 py-2 text-gray-500">Tidak ada hasil</div>
              )}
              {filtered.map(opt => (
                <Combobox.Option
                  key={opt.value}
                  value={opt.value}
                  className={({ active }) =>
                    `cursor-pointer select-none px-4 py-2 ${
                      active ? 'bg-[#F5F8FF]' : ''
                    } text-[#18355E]`
                  }
                >
                  {opt.label}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
