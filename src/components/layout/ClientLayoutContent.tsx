'use client';

import { usePathname } from 'next/navigation';
import BottomNavigationBar from '@/components/layout/BottomNavigationBar';
import Header from '@/components/layout/Header';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useConfirmModalStore } from '@/stores/modal/useConfirmModalStore';
import { useMatchingResponseStore } from '@/stores/modal/useMatchingResponseStore';
import { useWaitingModalStore } from '@/stores/modal/useWaitingModalStore';
import { useNavNewMessageStore } from '@/stores/chat/useNavNewMessageStore';
import { useNewAlarmStore } from '@/stores/chat/useNewAlarmStore';
import { useNewMessageStore } from '@/stores/modal/useNewMessageStore';
import { ConfirmModal } from '../common/ConfirmModal';
import WaitingModal from '../common/WaitingModal';
import NewMessageToast from '../common/NewMessageToast';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { postMatchingAccept, postMatchingReject } from '@/lib/api/matching';
import { useSSEStore } from '@/stores/useSSEStore';
import { useSSE } from '@/hooks/useSSE';
import { getSSEHandlers } from '@/constants/sseHandlers';

const EXCLUDE_PATHS = ['/login', '/onboarding', '/not-found'];

export default function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isHiddenUI, setIsHiddenUI] = useState(false);
  const { setReconnect } = useSSEStore();

  const confirmModalStore = useConfirmModalStore.getState();
  const matchingResponseStore = useMatchingResponseStore.getState();
  const waitingModalStore = useWaitingModalStore.getState();
  const navNewMessageStore = useNavNewMessageStore.getState();
  const newAlarmStore = useNewAlarmStore.getState();
  const newMessageStore = useNewMessageStore.getState();

  const shouldConnectSSE =
    pathname && !EXCLUDE_PATHS.some((excludedPath) => pathname.startsWith(excludedPath));
  const isPathValid = typeof pathname === 'string' && pathname.length > 0;

  const handlers = getSSEHandlers({
    handleAccept: async (channelRoomId, partnerNickname) => {
      await postMatchingAccept({ channelRoomId });
      toast.success(`${partnerNickname}님과 매칭이 완료됐어요!`, {
        icon: '🎉',
        id: 'matching-success',
      });
    },

    handleReject: async (channelRoomId, partnerNickname) => {
      await postMatchingReject({ channelRoomId });
      toast('매칭을 거절했어요', { icon: '👋', id: 'matching-reject' });
    },
    getChannelRoomIdFromPath: (pathname: string) => {
      const match = pathname.match(/\/chat\/(?:individual|group)\/(\d+)/);
      return match ? Number(match[1]) : null;
    },
    confirmModalStore,
    matchingResponseStore,
    waitingModalStore,
    navNewMessageStore,
    newAlarmStore,
    newMessageStore,
  });

  useSSE({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sse/subscribe`,
    handlers,
    enabled: Boolean(isPathValid && shouldConnectSSE),
  });

  useEffect(() => {
    setMounted(true);
    setIsHiddenUI(EXCLUDE_PATHS.some((route) => pathname.startsWith(route)));
  }, [pathname]);

  useEffect(() => {
    if (!shouldConnectSSE) return;

    const abortController = new AbortController();

    setReconnect(() => () => {
      abortController.abort();
    });

    return () => {
      abortController.abort();
    };
  }, [shouldConnectSSE, pathname, setReconnect]);

  if (!mounted) {
    return <div className="relative flex min-h-[100dvh] w-full max-w-[430px] flex-col" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`relative flex min-h-[100dvh] w-full max-w-[430px] flex-col ${
          isHiddenUI ? '' : 'bg-white'
        }`}
      >
        {!isHiddenUI && <Header title="" showBackButton={false} showNotificationButton={false} />}
        <div
          className={`flex-grow overflow-y-auto shadow-lg ${
            isHiddenUI ? '' : 'pt-[56px] pb-[56px]'
          }`}
        >
          {children}
        </div>
        {!isHiddenUI && <BottomNavigationBar />}
        <WaitingModal />
        <ConfirmModal />
        <NewMessageToast />
      </div>
    </QueryClientProvider>
  );
}
