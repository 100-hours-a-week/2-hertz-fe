'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import CustomSwitch from './CustomSwitch';

export default function MatchingAgreementToggleGroup() {
  const pathname = usePathname();
  const isMyPage = pathname === '/mypage';

  const {
    control,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (errors.friendAllowed || errors.coupleAllowed) {
      toast.error('친구 또는 연인 중 하나 이상은 선택되어야 합니다.', {
        id: 'matching-toggle-disabled',
      });
    }
  }, [errors.friendAllowed, errors.coupleAllowed]);

  return (
    <section className="px-2">
      {!isMyPage && (
        <>
          <p className="font-semibold">다른 사용자와 매칭 기능을 활성화하시겠어요?</p>
          <p className="text-xs leading-[1.2rem] text-[var(--gray-300)]">
            * 동의하면 다른 사용자로부터 매칭 요청을 받을 수 있어요.
            <br /> 동의하지 않을 경우 일부 서비스 이용이 제한될 수 있습니다.
          </p>
        </>
      )}

      <div className="mt-4 flex items-center justify-center gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-black">친구</p>
          <Controller
            name="friendAllowed"
            control={control}
            render={({ field }) => <CustomSwitch checked={field.value} onChange={field.onChange} />}
          />
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-black">연인</p>
          <Controller
            name="coupleAllowed"
            control={control}
            render={({ field }) => <CustomSwitch checked={field.value} onChange={field.onChange} />}
          />
        </div>
      </div>
    </section>
  );
}
