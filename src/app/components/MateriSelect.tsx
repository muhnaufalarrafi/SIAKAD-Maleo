// src\app\components\MateriSelect.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAllMateri, Materi } from '@/app/lib/curriculum/materi';
import FormSelect from './FormSelect';

interface MateriSelectProps {
  value: string;
  onChange: (v: string) => void;
}

export default function MateriSelect({ value, onChange }: MateriSelectProps) {
  const [opts, setOpts] = useState<Materi[]>([]);
  useEffect(() => {
    getAllMateri().then(setOpts).catch(console.error);
  }, []);
  return (
    <FormSelect
      value={value}
      onChange={onChange}
      placeholder="Materi"
      options={opts.map(m => ({ value: m.id, label: m.nama }))}
    />
  );
}
