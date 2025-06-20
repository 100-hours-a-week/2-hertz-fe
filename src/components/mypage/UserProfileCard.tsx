'use client';

import Image from 'next/image';

interface UserProfileCardProps {
  profileImage: string;
  nickname: string;
  oneLineIntroduction: string;
  gender: string;
  onRefresh?: () => void;
}

export default function UserProfileCard({
  profileImage,
  nickname,
  oneLineIntroduction,
  gender,
}: UserProfileCardProps) {
  const getSafeImageSrc = (src: string) => {
    if (!src || src.trim() === '') return '/images/default-profile.png';

    if (src.startsWith('http') || src.startsWith('/')) return src;

    const cleaned = src.replace(/^(\.\/|\.\.\/)+/, '');

    return `/${cleaned}`;
  };

  return (
    <div className="mb-10 px-4">
      <div className="mx-auto flex w-full items-center justify-center gap-10">
        <div className="relative w-full max-w-[4rem] rounded-full p-2 ring-[var(--gray-100)]">
          <div className="relative h-14 w-14 rounded-full bg-gradient-to-tr from-[#7BA1FF] via-[#7BA1FF] to-transparent p-[2px]">
            <div className="h-full w-full rounded-full bg-white">
              <Image
                src={getSafeImageSrc(profileImage) || '/images/default-profile.png'}
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
          <p className="truncate text-sm text-[var(--gray-300)]">
            {gender === 'MALE' ? '남성' : gender === 'FEMALE' ? '여성' : '성별 정보 없음'}
          </p>
        </div>
      </div>

      <div className="mt-6 mb-6 max-w-[25rem] rounded-2xl border-[1.5px] px-4 py-2">
        <div className="w-full text-sm leading-relaxed font-light">
          {oneLineIntroduction || '한 줄 소개가 없습니다.'}
        </div>
      </div>
    </div>
  );
}
