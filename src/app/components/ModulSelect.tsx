// src\app\components\ModulSelect.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAllModul, Modul } from '@/app/lib/curriculum/modul';
import FormSelect from './FormSelect';

interface ModulSelectProps {
  value: string;
  onChange: (v: string) => void;
}

export default function ModulSelect({ value, onChange }: ModulSelectProps) {
  const [opts, setOpts] = useState<Modul[]>([]);
  useEffect(() => {
    getAllModul().then(setOpts).catch(console.error);
  }, []);
  return (
    <FormSelect
      value={value}
      onChange={onChange}
      placeholder="Modul"
      options={opts.map(m => ({
        value: m.id,
        label: m.nama
      }))}
    />
  );
}
