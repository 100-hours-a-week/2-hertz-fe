'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/utils/auth';

const PUBLIC_PATHS = ['/login', '/signup', '/terms'];

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.includes(pathname);

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
