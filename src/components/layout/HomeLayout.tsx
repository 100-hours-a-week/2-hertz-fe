import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const router = useRouter();

  const navItems = [
    { path: '/home', label: '홈', isActive: true },
    { path: '/report', label: '리포트', isActive: false },
    { path: '/chat', label: '채널', isActive: false },
    { path: '/mypage', label: '마이페이지', isActive: false },
  ];

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-[430px] flex-col bg-white">
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
          <div className="relative mr-5 cursor-pointer p-1" onClick={() => router.push('/alarm')}>
            <Image
              src="/images/notification-normal.png"
              width={18}
              height={18}
              alt="alarm"
              className="mr-0.8"
            />
          </div>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto pt-[56px] pb-[56px] shadow-lg">{children}</div>

      <nav className="fixed bottom-0 z-50 flex h-[3.5rem] w-full max-w-[430px] items-center justify-around bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] before:absolute before:top-0 before:h-2 before:w-full before:bg-gradient-to-t before:from-white before:to-transparent">
        {navItems.map(({ path, label, isActive }) => (
          <button
            key={path}
            onClick={() => router.push(path)}
            className={`relative flex flex-col items-center gap-1 text-xs transition-colors duration-200 ${
              isActive ? 'font-semibold text-[var(--gray-400)]' : 'text-[var(--gray-300)]'
            }`}
          >
            <div
              className={`relative flex h-5 w-5 items-center justify-center text-sm ${isActive ? 'scale-100' : 'scale-90'}`}
            >
              {path === '/home' && '🏠'}
              {path === '/report' && '📊'}
              {path === '/chat' && '💬'}
              {path === '/mypage' && '👤'}
            </div>
            <p className="text-[0.7rem] font-semibold">{label}</p>
          </button>
        ))}
      </nav>
    </div>
  );
}
