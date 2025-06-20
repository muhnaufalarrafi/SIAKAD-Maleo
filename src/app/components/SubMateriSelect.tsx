// src\app\components\SubMateriSelect.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAllSubMateri, SubMateri } from '@/app/lib/curriculum/submateri';
import FormSelect from './FormSelect';

interface SubMateriSelectProps {
  value: string;
  onChange: (v: string) => void;
}

export default function SubMateriSelect({ value, onChange }: SubMateriSelectProps) {
  const [opts, setOpts] = useState<SubMateri[]>([]);
  useEffect(() => {
    getAllSubMateri().then(setOpts).catch(console.error);
  }, []);
  return (
    <FormSelect
      value={value}
      onChange={onChange}
      placeholder="Sub Materi"
      options={opts.map(s => ({ value: s.id, label: s.nama }))}
    />
  );
}
