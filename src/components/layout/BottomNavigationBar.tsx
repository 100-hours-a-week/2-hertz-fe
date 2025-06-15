'use client';

import { usePathname, useRouter } from 'next/navigation';
import { HiOutlineHome } from 'react-icons/hi';
import { TbReportSearch } from 'react-icons/tb';
import { PiChatCircleDotsBold } from 'react-icons/pi';
import { FaRegUserCircle } from 'react-icons/fa';
import { useWaitingModalStore } from '@/stores/modal/useWaitingModalStore';
import { useNavNewMessageStore } from '@/stores/chat/useNavNewMessageStore';

const hiddenRoutes = ['/login', '/onboarding', '/not-found'];

const navItems = [
  { path: '/home', label: '홈', icon: HiOutlineHome },
  { path: '/report', label: '리포트', icon: TbReportSearch },
  { path: '/chat', label: '채널', icon: PiChatCircleDotsBold },
  { path: '/mypage', label: '마이페이지', icon: FaRegUserCircle },
];

export default function BottomNavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const hasNewMessage = useNavNewMessageStore((state) => state.hasNewMessage);
  const shouldHide = hiddenRoutes.some((route) => pathname.startsWith(route));
  if (shouldHide) return null;

  return (
    <nav className="fixed bottom-0 z-50 flex h-[3.5rem] w-full max-w-[430px] items-center justify-around bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] before:absolute before:top-0 before:h-2 before:w-full before:bg-gradient-to-t before:from-white before:to-transparent">
      {navItems.map(({ path, label, icon: Icon }) => {
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
              <Icon
                className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-100' : 'scale-90'}`}
              />
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
