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
    if (typeof window === 'undefined') return;

    const measurePerformance = () => {
      try {
        const navigation = performance.getEntriesByType(
          'navigation',
        )[0] as PerformanceNavigationTiming;
        const paintEntries = performance.getEntriesByType('paint');

        const metrics: Partial<PerformanceMetrics> = {};

        // TTFB (Time to First Byte)
        if (navigation.responseStart && navigation.requestStart) {
          metrics.ttfb = navigation.responseStart - navigation.requestStart;
        }

        // FCP (First Contentful Paint)
        const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          metrics.fcp = fcpEntry.startTime;
        }

        // JavaScript execution time (approximate)
        if (navigation.loadEventEnd && navigation.domContentLoadedEventStart) {
          metrics.jsExecutionTime = navigation.loadEventEnd - navigation.domContentLoadedEventStart;
        }

        // Redirect count
        metrics.redirectCount = navigation.redirectCount || 0;

        // CLS (Cumulative Layout Shift) - requires Layout Instability API
        if ('PerformanceObserver' in window) {
          let cls = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const layoutShiftEntry = entry as PerformanceEntry & {
                hadRecentInput?: boolean;
                value?: number;
              };
              if (entry.entryType === 'layout-shift' && !layoutShiftEntry.hadRecentInput) {
                cls += layoutShiftEntry.value || 0;
              }
            }
            metrics.cls = cls;
          });

          try {
            observer.observe({ entryTypes: ['layout-shift'] });

            // Stop observing after 5 seconds
            setTimeout(() => observer.disconnect(), 5000);
          } catch {
            // Layout shift observer not supported - silently continue
          }
        }

        // Log metrics for analysis
        console.group(`🚀 Performance Metrics - ${pageName}`);
        console.log(
          'TTFB (Time to First Byte):',
          metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'N/A',
        );
        console.log(
          'FCP (First Contentful Paint):',
          metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'N/A',
        );
        console.log(
          'JavaScript Execution Time:',
          metrics.jsExecutionTime ? `${metrics.jsExecutionTime.toFixed(2)}ms` : 'N/A',
        );
        console.log('Redirect Count:', metrics.redirectCount || 0);
        console.log('CLS will be measured over 5 seconds...');
        console.groupEnd();

        // Send to analytics (you can replace this with your analytics service)
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            console.group(`📊 Final Performance Report - ${pageName}`);
            console.log('TTFB:', metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'N/A');
            console.log('FCP:', metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'N/A');
            console.log('CLS:', metrics.cls ? metrics.cls.toFixed(4) : 'N/A');
            console.log(
              'JS Execution Time:',
              metrics.jsExecutionTime ? `${metrics.jsExecutionTime.toFixed(2)}ms` : 'N/A',
            );
            console.log('Redirect Count:', metrics.redirectCount || 0);
            console.groupEnd();
          }, 5500);
        }
      } catch (error) {
        console.error('Performance measurement failed:', error);
      }
    };

    // Wait for page to be fully loaded
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, [pageName]);

  return null; // This component doesn't render anything
}
