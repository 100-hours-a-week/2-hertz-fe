'use client';

import { cn } from '@/lib/utils';

interface CustomSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}

export default function CustomSwitch({ checked, onChange, className }: CustomSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-4.5 w-8 items-center rounded-full transition-colors duration-300',
        checked ? 'bg-[var(--gray-400)]' : 'bg-input',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300',
          checked ? 'translate-x-4' : 'translate-x-1',
        )}
      />
    </button>
  );
}
