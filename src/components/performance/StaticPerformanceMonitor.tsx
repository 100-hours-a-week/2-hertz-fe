'use client';

import { useEffect } from 'react';

export default function StaticPerformanceMonitor({ pageName }: { pageName: string }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const idleCallback = requestIdleCallback(
      () => {
        const now = performance.now();
        console.log(`📊 ${pageName} - Initial render: ${now.toFixed(2)}ms`);
      },
      { timeout: 2000 },
    );

    return () => cancelIdleCallback(idleCallback);
  }, [pageName]);

  return null;
}
