'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from './Header';
import BottomNavigationBar from './BottomNavigationBar';
import { queryClient } from '@/lib/queryClient';

interface BasicLayoutProps {
  children: React.ReactNode;
}

export default function BasicLayout({ children }: BasicLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isHiddenUI, setIsHiddenUI] = useState(false);

  const EXCLUDE_PATHS = ['/login', '/onboarding', '/not-found'];

  useEffect(() => {
    setMounted(true);
    setIsHiddenUI(EXCLUDE_PATHS.some((route) => pathname.startsWith(route)));
  }, [pathname]);

  if (!mounted) {
    return <div className="relative flex min-h-[100dvh] w-full max-w-[430px] flex-col" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`relative flex min-h-[100dvh] w-full max-w-[430px] flex-col ${
          isHiddenUI ? '' : 'bg-white'
        }`}
      >
        {!isHiddenUI && (
          <Header title="" showBackButton={false} showNotificationButton={pathname === '/home'} />
        )}
        <div
          className={`flex-grow overflow-y-auto shadow-lg ${
            isHiddenUI ? '' : 'pt-[56px] pb-[56px]'
          }`}
        >
          {children}
        </div>
        {!isHiddenUI && <BottomNavigationBar />}
      </div>
    </QueryClientProvider>
  );
}
