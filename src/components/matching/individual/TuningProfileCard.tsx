'use client';

import Image from 'next/image';
import { IoRefreshCircle } from 'react-icons/io5';
import clsx from 'clsx';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface TuningProfileCardProps {
  profileImage: string;
  nickname: string;
  oneLineIntroduction: string;
  gender: string;
  onRefresh?: () => void;
}

export default function TuningProfileCard({
  profileImage,
  nickname,
  oneLineIntroduction,
  gender,
  onRefresh,
}: TuningProfileCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onRefresh?.();
    } catch (error) {
      toast.error('다시 요청하는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAbsoluteUrl = (path: string) => {
    if (!path) return '/images/default-profile.png';
    if (path.startsWith('http') || path.startsWith('/')) return path;
    return `/${path.replace(/^(\.\/|\.\.\/)+/, '')}`;
  };

  return (
    <>
      <button type="button" className="flex w-full justify-end" onClick={handleClick}>
        <IoRefreshCircle
          className={clsx(
            'text-[32px] text-[var(--gray-400)] transition-transform duration-300',
            isLoading && 'animate-spin',
          )}
        />
      </button>
      <div className="mx-auto flex w-full flex-col items-center">
        <div className="relative aspect-square w-full max-w-[6rem] rounded-full border border-[var(--gray-200)] p-2 ring-[var(--gray-100)]">
          <Image
            src={getAbsoluteUrl(profileImage)}
            alt="프로필 이미지"
            fill
            className="rounded-full object-cover"
            draggable={false}
          />
        </div>

        <p className="mt-3 truncate text-center text-lg font-semibold">{nickname}</p>
        <p className="truncate text-center text-sm text-[var(--gray-300)]">
          {gender === 'MALE' ? '남성' : gender === 'FEMALE' ? '여성' : '성별 정보 없음'}
        </p>
      </div>

      <div className="mt-6 mb-6 max-w-[25rem] rounded-2xl border-[1.5] px-4 py-2">
        <div className="w-full text-sm leading-relaxed font-light">
          {oneLineIntroduction || '한 줄 소개가 없습니다.'}
        </div>
      </div>
    </>
  );
}
