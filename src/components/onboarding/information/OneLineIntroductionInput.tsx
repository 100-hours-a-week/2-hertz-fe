'use client';

import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

export default function OneLineIntroductionInput() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch('oneLineIntroduction') || '';

  return (
    <main className="w-full space-y-4 px-2">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">한 줄 소개를 작성해주세요</p>
        <p className="text-xs text-[var(--gray-300)]"> {value.replace(/\s/g, '').length} / 100</p>
      </div>

      <div>
        <Textarea
          placeholder="당신을 소개하는 한 줄 소개를 작성해주세요"
          className="h-[6.5rem] w-80 overflow-x-hidden overflow-y-auto rounded-[6px] border-none bg-[var(--gray-100)] text-sm leading-[1.6rem] break-words whitespace-pre-wrap placeholder:text-[var(--gray-300)]"
          maxLength={100}
          {...register('oneLineIntroduction', { required: true })}
        />
      </div>
      {typeof errors.oneLineIntroduction?.message === 'string' && (
        <p className="text-xs font-medium text-[var(--pink)]">
          * {errors.oneLineIntroduction.message}
        </p>
      )}
    </main>
  );
}
