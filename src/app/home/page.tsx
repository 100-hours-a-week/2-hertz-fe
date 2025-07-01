import BannerSection from '@/components/home/BannerSection';
import { MatchTypeSelector } from '@/components/home/MatchTypeSelector';
import Header from '@/components/layout/Header';

export default function HomePage() {
  return (
    <>
      <Header showNotificationButton={true} />
      <BannerSection />
      <MatchTypeSelector />
    </>
  );
}
