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

      <div className="flex items-center justify-center">
        {showNotificationButton ? (
          <button className="relative mr-5 cursor-pointer p-1">
            {hasNewAlarm ? (
              <Image
                src="/images/notification-new.png"
                onClick={handleAlarm}
                width={18}
                height={18}
                alt="ring"
              />
            ) : (
              <Image
                className="mr-0.8"
                src="/images/notification-normal.png"
                onClick={handleAlarm}
                width={18}
                height={18}
                alt="alarm"
              />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}
      </div>
    </header>
  );
}
