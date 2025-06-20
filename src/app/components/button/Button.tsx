// src/app/components/button/Button.tsx
'use client';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C443] hover:bg-[#E8B73B] text-[#18355E] font-semibold shadow active:scale-95 transition ${props.className || ''}`}
    >
      {children}
    </button>
  );
}
