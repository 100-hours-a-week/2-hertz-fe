import Image from 'next/image';

interface StaticHeaderProps {
  showNotificationButton?: boolean;
}

export default function StaticHeader({ showNotificationButton = false }: StaticHeaderProps) {
  return (
    <header className="fixed top-0 left-1/2 z-50 box-border flex h-14 w-full max-w-[430px] -translate-x-1/2 items-center justify-between border-none bg-white px-4">
      <div className="flex min-w-[60px] items-center justify-center">
        <Image
          src="/icons/logo-blue.png"
          alt="로고"
          width={70}
          height={24}
          className="ml-5 object-contain"
          priority
        />
      </div>

      <div className="flex items-center justify-center">
        {showNotificationButton ? (
          <div className="relative mr-5 p-1">
            <Image
              src="/images/notification-normal.png"
              width={18}
              height={18}
              alt="alarm"
              className="mr-0.8"
            />
          </div>
        ) : (
          <div className="w-5" />
        )}
      </div>
    </header>
  );
}
