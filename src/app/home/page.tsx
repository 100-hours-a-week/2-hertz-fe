'use client';

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DynamicStaticPerformanceMonitor = dynamic(
  () => import('@/components/performance/StaticPerformanceMonitor'),
  {
    ssr: false,
  },
);

import BannerSection from '@/components/home/BannerSection';

import ClickWebPushBanner from '@/components/home/ClickWebPushBanner';

const MatchTypeSelector = dynamic(
  () =>
    import('@/components/home/MatchTypeSelector').then((mod) => ({
      default: mod.MatchTypeSelector,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex w-full flex-col items-center justify-center py-10">
        <div className="w-90 items-center rounded-2xl bg-gray-100 px-6 py-5">
          <div className="mb-4 h-5 w-48 animate-pulse rounded bg-gray-300" />
          <div className="flex items-center justify-around">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <div className="h-15 w-15 animate-pulse rounded-full bg-gray-200" />
                <div className="h-4 w-12 animate-pulse rounded bg-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
);

export default function HomePage() {
  const [shouldLoadMatchTypeSelector, setShouldLoadMatchTypeSelector] = useState(false);

  useEffect(() => {
    // MatchTypeSelector는 사용자 인터랙션 후 로딩
    const timer = setTimeout(() => {
      setShouldLoadMatchTypeSelector(true);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <DynamicStaticPerformanceMonitor pageName="/home (Dynamic Import)" />
      )}

      <main className="p-4">
        <ClickWebPushBanner />

        <BannerSection />

        {shouldLoadMatchTypeSelector ? (
          <Suspense
            fallback={
              <div className="flex w-full flex-col items-center justify-center py-10">
                <div className="w-90 items-center rounded-2xl bg-gray-100 px-6 py-5">
                  <div className="mb-4 h-5 w-48 animate-pulse rounded bg-gray-300" />
                  <div className="flex items-center justify-around">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex flex-col items-center space-y-1">
                        <div className="h-15 w-15 animate-pulse rounded-full bg-gray-200" />
                        <div className="h-4 w-12 animate-pulse rounded bg-gray-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <MatchTypeSelector />
          </Suspense>
        ) : (
          <div className="flex w-full flex-col items-center justify-center py-10">
            <div className="w-90 items-center rounded-2xl bg-gray-100 px-6 py-5">
              <div className="mb-4 h-5 w-48 animate-pulse rounded bg-gray-300" />
              <div className="flex items-center justify-around">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center space-y-1">
                    <div className="h-15 w-15 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-4 w-12 animate-pulse rounded bg-gray-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
