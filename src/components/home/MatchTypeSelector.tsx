'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const matchOptions = [
  { value: 'couple', label: '연인', emoji: '🩷' },
  { value: 'friend', label: '친구', emoji: '🤝🏼' },
];

export const MatchTypeSelector = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleSelect = (value: string) => {
    setSelected(value);
    router.push(`/matching/individual?category=${value}`);
  };

  return (
    <main className="flex w-full flex-col items-center justify-center py-10">
      <section className="w-90 items-center rounded-2xl bg-[var(--gray-100)] px-6 py-5">
        <h2 className="text-md mb-4 font-semibold text-[var(--gray-500)]">
          어떤 만남을 원하시나요?
        </h2>
        <div className="flex items-center justify-around">
          {matchOptions.map(({ value, label, emoji }) => {
            return (
              <button
                key={value}
                onClick={() => handleSelect(value)}
                className="flex flex-col items-center space-y-1 focus:outline-none"
              >
                <div
                  className={`mt-2 flex h-15 w-15 items-center justify-center rounded-full bg-white text-gray-800 transition hover:ring-1 hover:ring-gray-300`}
                >
                  <span className="text-xl">{emoji}</span>
                </div>
                <span className={`mt-2 text-sm font-medium text-gray-600`}>{label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};
