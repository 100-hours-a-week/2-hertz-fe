'use client';

import clsx from 'clsx';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

interface ReceiverMessageProps {
  nickname: string;
  profileImage: string;
  contents: string;
  sentAt: string;
  partnerId: number;
  relationType: 'SIGNAL' | 'MATCHING' | 'UNMATCHED';
  onLongPress?: () => void;
}

export default function ReceiverMessage({
  nickname,
  profileImage,
  contents,
  sentAt,
  partnerId,
  relationType,
  onLongPress,
}: ReceiverMessageProps) {
  const router = useRouter();
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleProfileClick = () => {
    router.push(`/profile/${partnerId}`);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onLongPress?.();
  };

  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      onLongPress?.();
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const getSafeImageSrc = (src: string) => {
    if (!src || src.trim() === '') return '/images/default-profile.png';
    if (src.startsWith('http') || src.startsWith('/')) return src;

    const cleaned = src.replace(/^(\.\/|\.\.\/)+/, '');

    return `/${cleaned}`;
  };

  return (
    <div className="flex items-start justify-start gap-1.5">
      <div className="mr-2 flex flex-col items-center">
        <div
          className={clsx(
            'relative h-10 w-10 rounded-full bg-gradient-to-tr to-transparent p-[2px]',
            relationType === 'MATCHING'
              ? 'from-[var(--pink)] via-[#FF73B7]'
              : 'from-[#7BA1FF] via-[#7BA1FF]',
          )}
        >
          <div onClick={handleProfileClick} className="h-full w-full rounded-full bg-white">
            <Image
              src={getSafeImageSrc(profileImage) || '/images/default-profile.png'}
              width={36}
              height={36}
              alt="상대 프로필"
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      <div
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <p className="mt-1 text-sm font-semibold text-[var(--gray-400)]">{nickname}</p>
        <div className="mt-1.5 flex pr-4">
          <div className="flex max-w-[16rem] items-end gap-2">
            <div
              className={clsx(
                'inline-block rounded-3xl border bg-white px-4 py-2 text-xs leading-[1.4] break-all whitespace-pre-wrap text-black',
                relationType === 'MATCHING' ? 'border-[var(--pink)]' : 'border-[var(--blue)]',
              )}
            >
              {contents}
            </div>
            <p className="mt-1 text-xs text-[var(--gray-300)]">{dayjs(sentAt).format('HH:mm')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
