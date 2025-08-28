'use client';

import Image from 'next/image';
import { IoRefreshCircle } from 'react-icons/io5';
import clsx from 'clsx';
import { useState, useMemo, useCallback, memo } from 'react';
import toast from 'react-hot-toast';

interface TuningProfileCardProps {
  profileImage: string;
  nickname: string;
  oneLineIntroduction: string;
  gender: string;
  onRefresh?: () => void;
}

const TuningProfileCard = memo(function TuningProfileCard({
  profileImage,
  nickname,
  oneLineIntroduction,
  gender,
  onRefresh,
}: TuningProfileCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const absoluteImageUrl = useMemo(() => {
    if (!profileImage) return '/images/default-profile.png';
    if (profileImage.startsWith('http') || profileImage.startsWith('/')) return profileImage;
    return `/${profileImage.replace(/^(\.\/|\.\.\/)+/, '')}`;
  }, [profileImage]);

  const genderText = useMemo(() => {
    switch (gender) {
      case 'MALE':
        return '남성';
      case 'FEMALE':
        return '여성';
      default:
        return '성별 정보 없음';
    }
  }, [gender]);

  const refreshIconClass = clsx(
    'text-[32px] text-[var(--gray-400)] transition-transform duration-300',
    isLoading && 'animate-spin',
  );

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await onRefresh?.();
    } catch (error) {
      toast.error('다시 요청하는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [onRefresh]);

  return (
    <>
      <button type="button" className="flex w-full justify-end" onClick={handleClick}>
        <IoRefreshCircle className={refreshIconClass} />
      </button>
      <div className="mx-auto flex w-full flex-col items-center">
        <div className="relative aspect-square w-full max-w-[6rem] rounded-full border border-[var(--gray-200)] p-2 ring-[var(--gray-100)]">
          <Image
            src={absoluteImageUrl}
            alt="프로필 이미지"
            fill
            className="rounded-full object-cover"
            draggable={false}
          />
        </div>

        <p className="mt-3 truncate text-center text-lg font-semibold">{nickname}</p>
        <p className="truncate text-center text-sm text-[var(--gray-300)]">{genderText}</p>
      </div>

      <div className="mt-6 mb-6 max-w-[25rem] rounded-2xl border-[1.5] px-4 py-2">
        <div className="w-full text-sm leading-relaxed font-light">
          {oneLineIntroduction || '한 줄 소개가 없습니다.'}
        </div>
      </div>
    </>
  );
});

export default TuningProfileCard;
