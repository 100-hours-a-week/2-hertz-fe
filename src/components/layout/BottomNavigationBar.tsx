'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useWaitingModalStore } from '@/stores/modal/useWaitingModalStore';
import { useNavNewMessageStore } from '@/stores/chat/useNavNewMessageStore';

const hiddenRoutes = ['/login', '/onboarding', '/not-found'];

const navItems = [
  { path: '/home', label: '홈', icon: '🏠' },
  { path: '/report', label: '리포트', icon: '📊' },
  { path: '/chat', label: '채널', icon: '💬' },
  { path: '/mypage', label: '마이페이지', icon: '👤' },
];
export default function BottomNavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const hasNewMessage = useNavNewMessageStore((state) => state.hasNewMessage);
  const shouldHide = hiddenRoutes.some((route) => pathname.startsWith(route));
  if (shouldHide) return null;

  return (
    <nav className="fixed bottom-0 z-50 flex h-[3.5rem] w-full max-w-[430px] items-center justify-around bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] before:absolute before:top-0 before:h-2 before:w-full before:bg-gradient-to-t before:from-white before:to-transparent">
      {navItems.map(({ path, label, icon }) => {
        const isActive = pathname === path;
        const isChatTab = path === '/chat';

        return (
          <button
            key={path}
            onClick={() => {
              setTimeout(() => {
                useWaitingModalStore.getState().closeModal();
              }, 0);
              router.push(path);
            }}
            className={`relative flex flex-col items-center gap-1 text-xs transition-colors duration-200 ${
              isActive ? 'font-semibold text-[var(--gray-400)]' : 'text-[var(--gray-300)]'
            }`}
          >
            <div className="relative">
              <div
                className={`relative flex h-5 w-5 items-center justify-center text-sm ${isActive ? 'scale-100' : 'scale-90'}`}
              >
                {icon}
              </div>
              {isChatTab && hasNewMessage && (
                <span className="absolute -top-[-2px] -right-[2px] h-2 w-2 rounded-full bg-[var(--pink)]" />
              )}
            </div>
            <p className="text-[0.7rem] font-semibold">{label}</p>
          </button>
        );
      })}
    </nav>
  );
}
