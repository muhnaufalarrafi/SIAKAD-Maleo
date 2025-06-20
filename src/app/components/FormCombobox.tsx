// src/app/components/FormCombobox.tsx
'use client';

import { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface FormComboboxProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}

export default function FormCombobox({
  label,
  value,
  onChange,
  placeholder,
  options
}: FormComboboxProps) {
  const [query, setQuery] = useState('');

  // filter opsi berdasarkan query
  const filtered =
    query === ''
      ? options
      : options.filter(opt =>
          opt.label.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium text-[#18355E]">
          {label}
        </label>
      )}
      <Combobox value={value} onChange={onChange}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-xl bg-white text-left shadow-sm sm:text-sm">
            <Combobox.Input
              className="w-full border border-gray-200 rounded-xl py-2 pl-3 pr-10 text-[#18355E] focus:outline-none"
              displayValue={(val: string) =>
                options.find(o => o.value === val)?.label ?? ''
              }
              placeholder={placeholder}
              onChange={e => setQuery(e.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg sm:text-sm">
              {filtered.length === 0 && (
                <div className="relative cursor-default select-none py-2 px-3 text-gray-500">
                  Tidak ada hasil
                </div>
              )}
              {filtered.map(opt => (
                <Combobox.Option
                  key={opt.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-[#F5F8FF]' : ''
                    }`
                  }
                  value={opt.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-semibold' : ''
                        }`}
                      >
                        {opt.label}
                      </span>
                      {selected && (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-[#18355E]' : 'text-[#18355E]'
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
