'use client';

import { useEffect } from 'react';

export default function StaticPerformanceMonitor({ pageName }: { pageName: string }) {
  useEffect(() => {
    const measureBasicPerformance = () => {
      const now = performance.now();
      console.log(`📊 ${pageName} - Initial render: ${now.toFixed(2)}ms`);

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log(`🎨 ${pageName} - FCP: ${entry.startTime.toFixed(2)}ms`);
            observer.disconnect();
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['paint'] });
      } catch {}
    };

    measureBasicPerformance();
  }, [pageName]);

  return null;
}
