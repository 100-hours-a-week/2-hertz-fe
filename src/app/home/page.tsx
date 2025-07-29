'use client';

import BannerSection from '@/components/home/BannerSection';
import ClickWebPushBanner from '@/components/home/ClickWebPushBanner';
import { MatchTypeSelector } from '@/components/home/MatchTypeSelector';
import Header from '@/components/layout/Header';

export default function HomePage() {
  return (
    <>
      <Header showNotificationButton={true} />
      <ClickWebPushBanner />
      <BannerSection />
      <MatchTypeSelector />
    </>
  );
}
