'use client';

import Image from 'next/image';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';
import { oneLineIntroSchema } from '@/lib/schema/mypageValidation';
import TextareaAutosize from 'react-textarea-autosize';

interface UserProfileCardProps {
  profileImage: string;
  nickname: string;
  oneLineIntroduction: string;
  gender: string;
  onRefresh?: () => void;
  onSaveIntroduction?: (newIntro: string) => void;
}

const UserProfileCard = memo(function UserProfileCard({
  profileImage,
  nickname,
  oneLineIntroduction,
  gender,
  onSaveIntroduction,
}: UserProfileCardProps) {
  const pathname = usePathname();
  const isMyPage = useMemo(() => pathname === '/mypage', [pathname]);

  const [isEditing, setIsEditing] = useState(false);
  const [introValue, setIntroValue] = useState(oneLineIntroduction || '');
  const [errorMsg, setErrorMsg] = useState('');
  const safeImageSrc = useMemo(() => {
    if (!profileImage || profileImage.trim() === '') return '/images/default-profile.png';
    if (profileImage.startsWith('http') || profileImage.startsWith('/')) return profileImage;
    const cleaned = profileImage.replace(/^(\.\/|\.\.\/)+/, '');
    return `/${cleaned}`;
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

  const handleSave = useCallback(() => {
    const result = oneLineIntroSchema.safeParse(introValue);
    if (!result.success) {
      setErrorMsg(result.error.errors[0].message);
      return;
    }

    setErrorMsg('');
    if (onSaveIntroduction) onSaveIntroduction(introValue);
    setIsEditing(false);
  }, [introValue, onSaveIntroduction]);

  useEffect(() => {
    setIntroValue(oneLineIntroduction);
  }, [oneLineIntroduction]);

  return (
    <div className="mb-6 px-4">
      <div className="mx-auto flex w-full items-center justify-center gap-10">
        <div className="relative w-full max-w-[4rem] rounded-full p-2 ring-[var(--gray-100)]">
          <div className="relative h-14 w-14 rounded-full bg-gradient-to-tr from-[#7BA1FF] via-[#7BA1FF] to-transparent p-[2px]">
            <div className="h-full w-full rounded-full bg-white">
              <Image
                src={safeImageSrc}
                width={56}
                height={56}
                alt="상대 프로필"
                className="rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start justify-center">
          <p className="truncate text-lg font-semibold">{nickname}</p>
          <p className="truncate text-sm text-[var(--gray-300)]">{genderText}</p>
        </div>
      </div>

      <div className="mt-6 mb-6 max-w-[25rem] rounded-2xl border-[1.5px] px-4 py-2">
        {isEditing ? (
          <>
            <TextareaAutosize
              value={introValue}
              onChange={(e) => setIntroValue(e.target.value)}
              className="w-full resize-none rounded-md bg-transparent px-0 py-0 text-sm leading-relaxed font-light break-words focus:ring-0 focus:outline-none"
              placeholder="한 줄 소개를 입력해주세요."
              minRows={1}
              maxRows={4}
              autoFocus
            />
          </>
        ) : (
          <div className="w-full text-sm leading-relaxed font-light break-words">
            {introValue || '한 줄 소개가 없습니다.'}
          </div>
        )}
      </div>
      {errorMsg && <p className="ml-2 text-xs text-[var(--pink)]">{errorMsg}</p>}

      {isMyPage && (
        <div className="mt-2 flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                className="rounded-2xl bg-[var(--gray-300)] text-xs"
                onClick={handleSave}
              >
                저장
              </Button>
              <Button
                size="sm"
                className="rounded-2xl bg-[var(--gray-300)] text-xs"
                onClick={() => {
                  setIntroValue(oneLineIntroduction);
                  setIsEditing(false);
                  setErrorMsg('');
                }}
              >
                취소
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="rounded-2xl bg-[var(--gray-400)] text-xs"
              onClick={() => setIsEditing(true)}
            >
              수정하기
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

export default UserProfileCard;
