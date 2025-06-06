'use client';

import { usePathname } from 'next/navigation';
import BottomNavigationBar from '@/components/layout/BottomNavigationBar';
import Header from '@/components/layout/Header';
import { useState, useEffect, useMemo } from 'react';
import { useSSE } from '@/hooks/useSSE';
import toast from 'react-hot-toast';
import { useConfirmModalStore } from '@/stores/modal/useConfirmModalStore';
import { ConfirmModal } from '../common/ConfirmModal';
import WaitingModal from '../common/WaitingModal';
import { useWaitingModalStore } from '@/stores/modal/useWaitingModalStore';

const hiddenRoutes = ['/login', '/onboarding', '/not-found'];

const HEADER_HEIGHT = 56;
const BOTTOM_NAV_HEIGHT = 56;

export default function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [padding, setPadding] = useState({ top: 0, bottom: 0 });
  const [isHiddenUI, setIsHiddenUI] = useState(false);

  const sseHandlers = useMemo(
    () => ({
      'signal-matching-conversion': (data: unknown) => {
        const { partnerNickname } = data as { partnerNickname: string };
        toast.success(`🎉 ${partnerNickname}님과 매칭이 가능해졌어요!`);
      },
      'signal-matching-conversion-in-room': (data: unknown) => {
        const { partnerNickname } = data as { partnerNickname: string };

        useConfirmModalStore.getState().openModal({
          title: (
            <>
              {partnerNickname}님과의 매칭에
              <br />
              동의하시겠습니까?
            </>
          ),
          confirmText: '네',
          cancelText: '아니요',
          imageSrc: '/images/friends.png',
          variant: 'confirm',
          onConfirm: () => {
            useWaitingModalStore.getState().openModal(partnerNickname);
            // /api/v2/matching/acceptances 매칭 수락 api 연결
          },
          onCancel: () => {
            toast('매칭이 실패하였습니다', { icon: '🥺' });
            // /api/v2/matching/rejections 매칭 거절 api 연결
          },
        });
      },
    }),

    [],
  );

  useSSE({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sse/subscribe`,
    handlers: sseHandlers,
  });

  useEffect(() => {
    setMounted(true);
    setIsHiddenUI(hiddenRoutes.some((route) => pathname.startsWith(route)));
  }, [pathname]);

  useEffect(() => {
    if (mounted) {
      setPadding(
        isHiddenUI ? { top: 0, bottom: 0 } : { top: HEADER_HEIGHT, bottom: BOTTOM_NAV_HEIGHT },
      );
    }
  }, [mounted, isHiddenUI]);

  if (!mounted) {
    return <div className="relative flex min-h-[100dvh] w-full max-w-[430px] flex-col" />;
  }

  return (
    <div
      className={`relative flex min-h-[100dvh] w-full max-w-[430px] flex-col ${
        isHiddenUI ? '' : 'bg-white'
      }`}
    >
      {!isHiddenUI && <Header title="" showBackButton={false} showNotificationButton={false} />}
      <div
        className={`flex-grow overflow-y-auto shadow-lg ${isHiddenUI ? '' : 'pt-[56px] pb-[56px]'}`}
      >
        {children}
      </div>
      {!isHiddenUI && <BottomNavigationBar />}
      <ConfirmModal />
      <WaitingModal />
    </div>
  );
}
