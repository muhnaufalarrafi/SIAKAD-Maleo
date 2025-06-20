// src\app\components\TipeTugasSelect.tsx
'use client';

import FormSelect from './FormSelect';

const choices = [
  { value: 'Mandiri', label: 'Mandiri' },
  { value: 'Kelompok', label: 'Kelompok' },
  { value: 'Gabungan', label: 'Gabungan' }
];

interface TipeTugasSelectProps {
  value: string;
  onChange: (v: string) => void;
}

export default function TipeTugasSelect({ value, onChange }: TipeTugasSelectProps) {
  return (
    <FormSelect
      value={value}
      onChange={onChange}
      placeholder="Tipe Tugas"
      options={choices}
    />
  );
}
