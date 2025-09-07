'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MatchTypeSelector } from '@/components/home/MatchTypeSelector';

import StaticPerformanceMonitor from '@/components/performance/StaticPerformanceMonitor';

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

export default function HomePage() {
  return (
    <>
      <StaticPerformanceMonitor pageName="/home (Static SSR with Layout)" />

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
          <BannerSection /> <MatchTypeSelector />
        </Suspense>
      </main>
    </>
  );
}
