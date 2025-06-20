// src\app\components\MapelSelect.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAllMapel, Mapel } from '@/app/lib/curriculum/mataPelajaran';
import FormSelect from './FormSelect';

interface MapelSelectProps {
  value: string;
  onChange: (v: string) => void;
}

export default function MapelSelect({ value, onChange }: MapelSelectProps) {
  const [opts, setOpts] = useState<Mapel[]>([]);
  useEffect(() => {
    getAllMapel().then(setOpts).catch(console.error);
  }, []);
  return (
    <FormSelect
      value={value}
      onChange={onChange}
      placeholder="Mata Pelajaran"
      options={opts.map(m => ({ value: m.id, label: m.nama }))}
    />
  );
}
