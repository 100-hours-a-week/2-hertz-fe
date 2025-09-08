'use client';

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DynamicStaticPerformanceMonitor = dynamic(
  () => import('@/components/performance/StaticPerformanceMonitor'),
  {
    ssr: false,
  },
);

const BannerSection = dynamic(() => import('@/components/home/BannerSection'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto w-full max-w-md">
      <div className="relative aspect-[3/2] animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      <div className="mt-4 flex justify-center space-x-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-2 w-2 animate-pulse rounded-full bg-gray-300" />
        ))}
      </div>
    </div>
  ),
});

const ClickWebPushBanner = dynamic(() => import('@/components/home/ClickWebPushBanner'), {
  ssr: false,
  loading: () => <div className="h-12 animate-pulse rounded bg-gray-100" />,
});

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
  const [shouldLoadBelowFold, setShouldLoadBelowFold] = useState(false);
  const [shouldLoadMatchTypeSelector, setShouldLoadMatchTypeSelector] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadBelowFold(true);
    }, 300);

    const matchTypeSelectorTimer = setTimeout(() => {
      setShouldLoadMatchTypeSelector(true);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(matchTypeSelectorTimer);
    };
  }, []);

  return (
    <>
      <DynamicStaticPerformanceMonitor pageName="/home (Dynamic Import)" />

      <main className="p-4">
        <Suspense
          fallback={
            <div className="mt-4 flex items-center gap-2 rounded-md bg-gray-100 p-4 px-8 text-sm font-medium text-gray-400">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-300" />
              <div className="h-4 w-48 animate-pulse rounded bg-gray-300" />
            </div>
          }
        >
          <ClickWebPushBanner />
        </Suspense>

        {shouldLoadBelowFold ? (
          <Suspense
            fallback={
              <div className="mx-auto mt-6 w-full max-w-md">
                <div className="relative aspect-[3/2] animate-pulse rounded-lg bg-gray-200" />
                <div className="mt-4 flex justify-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-2 w-2 rounded-full bg-gray-300" />
                  ))}
                </div>
              </div>
            }
          >
            <BannerSection />
          </Suspense>
        ) : (
          <div className="mx-auto mt-6 w-full max-w-md">
            <div className="relative aspect-[3/2] animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-4 flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-gray-300" />
              ))}
            </div>
          </div>
        )}

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
