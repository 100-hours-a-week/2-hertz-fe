'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  cls: number;
  jsExecutionTime: number;
  redirectCount: number;
}

export default function PerformanceMonitor({ pageName }: { pageName: string }) {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

    const timeoutId = setTimeout(() => {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      const fcpEntry = performance
        .getEntriesByType('paint')
        .find((entry) => entry.name === 'first-contentful-paint');

      console.log(`🚀 ${pageName} - FCP: ${fcpEntry?.startTime.toFixed(2)}ms`);
      console.log(
        `🚀 ${pageName} - Load Time: ${navigation.loadEventEnd - navigation.loadEventStart}ms`,
      );
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [pageName]);

  return null;
}
