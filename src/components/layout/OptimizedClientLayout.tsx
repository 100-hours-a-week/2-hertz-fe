'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { ReactNode, ComponentType } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const ClientLayoutContent = dynamic(() => import('@/components/layout/ClientLayoutContent'), {
  ssr: false,
  loading: () => <div className="relative flex min-h-[100dvh] w-full max-w-[430px] flex-col" />,
}) as ComponentType<LayoutProps>;

const BasicLayout = dynamic(() => import('@/components/layout/BasicLayout'), {
  ssr: true,
  loading: () => <div className="relative flex min-h-[100dvh] w-full max-w-[430px] flex-col" />,
}) as ComponentType<LayoutProps>;

const HomeLayout = dynamic(() => import('@/components/layout/HomeLayout'), {
  ssr: true,
  loading: () => <div className="relative flex min-h-[100dvh] w-full max-w-[430px] flex-col" />,
}) as ComponentType<LayoutProps>;

interface OptimizedClientLayoutProps {
  children: ReactNode;
}

export default function OptimizedClientLayout({ children }: OptimizedClientLayoutProps) {
  const pathname = usePathname();

  const sseRequiredPaths = ['/chat', '/matching', '/alarm'];

  const needsSSE = sseRequiredPaths.some((path) => pathname?.startsWith(path));

  if (pathname === '/home') {
    return <HomeLayout>{children}</HomeLayout>;
  }

  if (needsSSE) {
    return <ClientLayoutContent>{children}</ClientLayoutContent>;
  }

  return <BasicLayout>{children}</BasicLayout>;
}
