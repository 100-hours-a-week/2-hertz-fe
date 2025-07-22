'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function InvitationCodeInputSection({ onVerified }: { onVerified: () => void }) {
  const {
    register,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const code = watch('invitationCode');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async () => {
    const codeStr = String(code);

    if (!/^\d{4}$/.test(String(code))) {
      setError('invitationCode', {
        type: 'manual',
        message: '초대코드는 4자리 숫자로 작성해주세요.',
      });
      return;
    }

    const kakaoTechCode = process.env.NEXT_PUBLIC_KAKAOTECH_INVITATION_CODE;
    const guestCode = process.env.NEXT_PUBLIC_GUEST_INVITATION_CODE;

    if (codeStr === kakaoTechCode) {
      toast.success('카카오테크 부트캠프 사용자로 인증되었습니다.');
    } else if (codeStr === guestCode) {
      toast.success('외부 사용자로 인증되었습니다.');
    } else {
      setError('invitationCode', {
        type: 'manual',
        message: '유효하지 않은 초대코드입니다.',
      });
      toast.error('유효하지 않은 초대코드입니다.');
      return;
    }

    setIsVerified(true);
    clearErrors('invitationCode');
    onVerified();
  };

  return (
    <section className="space-y-4 px-2">
      <p className="text-base font-semibold">초대코드를 입력해주세요</p>

      <div className="flex gap-2">
        <Input
          type="text"
          maxLength={4}
          disabled={isVerified}
          placeholder="1234"
          {...register('invitationCode', { valueAsNumber: true })}
          className="h-11 flex-1 rounded-[6px] border-none bg-[var(--gray-100)] text-sm"
        />
        <Button
          type="button"
          onClick={handleVerify}
          disabled={isVerified || !code}
          className={`h-11 rounded-[6px] px-4 text-sm transition-colors duration-200 ${
            isVerified
              ? 'bg-[var(--gray-200)] text-black'
              : 'bg-[var(--gray-400)] text-white hover:bg-[var(--gray-500)]'
          }`}
        >
          {isVerified ? '인증 완료' : '인증하기'}
        </Button>
      </div>

      {errors.invitationCode && (
        <p className="text-xs text-[var(--pink)]">* {errors.invitationCode.message?.toString()}</p>
      )}
    </section>
  );
}
