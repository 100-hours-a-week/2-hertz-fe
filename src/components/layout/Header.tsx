'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaAngleLeft } from 'react-icons/fa6';
import { FaRegBell } from 'react-icons/fa';
import { useNewAlarmStore } from '@/stores/chat/useNewAlarmStore';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showNotificationButton?: boolean;
}

export default function Header({
  title,
  showBackButton = false,
  showNotificationButton = false,
}: HeaderProps) {
  const router = useRouter();
  const hasNewAlarm = useNewAlarmStore((state) => state.hasNewAlarm);

  const handleBack = () => {
    router.back();
  };

  const handleAlarm = () => {
    router.replace('/alarm');
  };

  return (
    <header className="fixed top-0 left-1/2 z-50 box-border flex h-14 w-full max-w-[430px] -translate-x-1/2 items-center justify-between border-none bg-white px-4">
      <div className="flex min-w-[60px] items-center justify-center">
        {showBackButton ? (
          <button onClick={handleBack} className="p-1">
            <FaAngleLeft className="text-[clamp(1rem,2vw,1.2rem)]" />
          </button>
        ) : (
          <Image
            src="/icons/logo-blue.png"
            alt="로고"
            width={70}
            height={24}
            className="ml-5 object-contain"
          />
        )}
      </div>

      <h1
        className={`absolute left-1/2 -translate-x-1/2 text-lg font-bold text-black ${showBackButton ? '' : 'text-start'} `}
      >
        {title}
      </h1>

      <div>
        {showNotificationButton ? (
          <button className="relative mr-5 cursor-pointer p-1">
            <FaRegBell onClick={handleAlarm} className="text-[clamp(1rem,2vw,1.2rem)]" />
            {hasNewAlarm && (
              <span className="right-0.50 absolute top-0.5 z-10 h-1.5 w-1.5 rounded-full bg-[var(--pink)]" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}
      </div>
    </header>
  );
}
