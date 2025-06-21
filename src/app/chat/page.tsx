'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import ChannelsIndividualPage from '@/app/chat/individual/page';

export default function ChannelsPage() {
  const [selectedTab, setSelectedTab] = useState<'individual' | 'group'>('individual');

  return (
    <>
      <Header title="채팅" showBackButton={false} showNotificationButton={true} />
      <main className="flex h-full flex-col overflow-y-auto px-4 py-2">
        <section key={selectedTab} className="animate-fade-slide-in mt-4">
          <ChannelsIndividualPage />
        </section>
      </main>
    </>
  );
}
