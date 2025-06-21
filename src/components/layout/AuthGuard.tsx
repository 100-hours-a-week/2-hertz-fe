'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/utils/auth';

const PUBLIC_PATH_PREFIXES = ['/login', '/onboarding', '/not-found'];

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const isPublic = PUBLIC_PATH_PREFIXES.some((publicPath) => pathname.startsWith(publicPath));

    if (isPublic) {
      setCanRender(true);
      return;
    }

    if (!isAuthenticated()) {
      router.replace('/login');
    } else {
      setCanRender(true);
    }
  }, [pathname, router]);

  if (!canRender) return null;

  return <>{children}</>;
};
