'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useConfirmModalStore } from '@/stores/modal/useConfirmModalStore';
import { useMatchingResponseStore } from '@/stores/modal/useMatchingResponseStore';
import { useWaitingModalStore } from '@/stores/modal/useWaitingModalStore';
import { useNavNewMessageStore } from '@/stores/chat/useNavNewMessageStore';
import { useNewAlarmStore } from '@/stores/chat/useNewAlarmStore';
import { useNewMessageStore } from '@/stores/modal/useNewMessageStore';
import { useShallow } from 'zustand/react/shallow';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { postMatchingAccept, postMatchingReject } from '@/lib/api/matching';
import { useSSEStore } from '@/stores/useSSEStore';
import { useSSE } from '@/hooks/useSSE';
import { getSSEHandlers } from '@/constants/sseHandlers';
const DynamicBottomNavigationBar = dynamic(
  () => import('@/components/layout/BottomNavigationBar'),
  {
    ssr: false,
  },
);

const DynamicHeader = dynamic(() => import('@/components/layout/Header'), {
  ssr: false,
});

const DynamicPerformanceMonitor = dynamic(
  () => import('@/components/performance/PerformanceMonitor'),
  {
    ssr: false,
  },
);

const DynamicConfirmModal = dynamic(
  () => import('../common/ConfirmModal').then((mod) => ({ default: mod.ConfirmModal })),
  {
    ssr: false,
    loading: () => null,
  },
);

const DynamicWaitingModal = dynamic(() => import('../common/WaitingModal'), {
  ssr: false,
  loading: () => null,
});

const DynamicNewMessageToast = dynamic(() => import('../common/NewMessageToast'), {
  ssr: false,
  loading: () => null,
});

const EXCLUDE_PATHS = ['/login', '/onboarding', '/not-found'];

export default function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isHiddenUI, setIsHiddenUI] = useState(false);
  const setReconnect = useSSEStore((state) => state.setReconnect);
  const prevPathnameRef = useRef(pathname);

  const isConfirmModalOpen = useConfirmModalStore((state) => state.isOpen);
  const isWaitingModalOpen = useWaitingModalStore((state) => state.isOpen);
  const hasNewMessage = useNewMessageStore((state) => state.toast !== null);

  const { temporarilyHideModal: hideConfirmModal, restoreModal: restoreConfirmModal } =
    useConfirmModalStore(
      useShallow((state) => ({
        temporarilyHideModal: state.temporarilyHideModal,
        restoreModal: state.restoreModal,
      })),
    );

  const { temporarilyHideModal: hideMatchingModal, restoreModal: restoreMatchingModal } =
    useMatchingResponseStore(
      useShallow((state) => ({
        temporarilyHideModal: state.temporarilyHideModal,
        restoreModal: state.restoreModal,
      })),
    );

  const { temporarilyHideModal: hideWaitingModal, restoreModal: restoreWaitingModal } =
    useWaitingModalStore(
      useShallow((state) => ({
        temporarilyHideModal: state.temporarilyHideModal,
        restoreModal: state.restoreModal,
      })),
    );

  // 전역 페이지 이동 감지하여 매칭 응답 모달 관리
  useEffect(() => {
    const currentPath = pathname;
    const prevPath = prevPathnameRef.current;

    const chatRoomPattern = /^\/chat\/individual\/(\d+)/;
    const prevChatMatch = prevPath?.match(chatRoomPattern);
    const currentChatMatch = currentPath?.match(chatRoomPattern);

    if (prevChatMatch && !currentChatMatch) {
      const channelRoomId = Number(prevChatMatch[1]);

      const confirmModalState = useConfirmModalStore.getState();

      if (confirmModalState.isOpen) {
        hideConfirmModal(channelRoomId);
      }

      const waitingModalState = useWaitingModalStore.getState();

      if (waitingModalState.isOpen) {
        hideWaitingModal(channelRoomId);
      }
      const currentModalState = useMatchingResponseStore.getState();

      if (currentModalState.isModalOpen) {
        hideMatchingModal(channelRoomId);
      }
    } else if (!prevChatMatch && currentChatMatch) {
      const channelRoomId = Number(currentChatMatch[1]);

      const confirmModalState = useConfirmModalStore.getState();

      if (
        confirmModalState.isTemporarilyHidden &&
        confirmModalState.hiddenChannelRoomId === channelRoomId
      ) {
        restoreConfirmModal(channelRoomId);
      }

      const waitingModalState = useWaitingModalStore.getState();

      if (
        waitingModalState.isTemporarilyHidden &&
        waitingModalState.hiddenChannelRoomId === channelRoomId
      ) {
        restoreWaitingModal(channelRoomId);
      }

      const currentModalState = useMatchingResponseStore.getState();

      if (
        currentModalState.isModalTemporarilyHidden &&
        currentModalState.hiddenChannelRoomId === channelRoomId
      ) {
        restoreMatchingModal(channelRoomId);
      }
    }

    prevPathnameRef.current = currentPath;
  }, [
    pathname,
    hideConfirmModal,
    restoreConfirmModal,
    hideMatchingModal,
    restoreMatchingModal,
    hideWaitingModal,
    restoreWaitingModal,
  ]);

  const shouldConnectSSE =
    pathname && !EXCLUDE_PATHS.some((excludedPath) => pathname.startsWith(excludedPath));
  const isPathValid = typeof pathname === 'string' && pathname.length > 0;

  const handleAccept = useCallback(async (channelRoomId: number) => {
    await postMatchingAccept({ channelRoomId });
    const { toast } = await import('react-hot-toast');
    toast.success(`매칭이 완료됐어요!`, {
      icon: '🎉',
      id: 'matching-success',
    });
  }, []);

  const handleReject = useCallback(async (channelRoomId: number) => {
    await postMatchingReject({ channelRoomId });
    const { toast } = await import('react-hot-toast');
    toast('매칭을 거절했어요', { icon: '👋', id: 'matching-reject' });
  }, []);

  const getChannelRoomIdFromPath = useCallback((pathname: string) => {
    const match = pathname.match(/\/chat\/(?:individual|group)\/(\d+)/);
    return match ? Number(match[1]) : null;
  }, []);

  const handlers = getSSEHandlers({
    handleAccept,
    handleReject,
    getChannelRoomIdFromPath,
    confirmModalStore: useConfirmModalStore.getState(),
    matchingResponseStore: useMatchingResponseStore.getState(),
    waitingModalStore: useWaitingModalStore.getState(),
    navNewMessageStore: useNavNewMessageStore.getState(),
    newAlarmStore: useNewAlarmStore.getState(),
    newMessageStore: useNewMessageStore.getState(),
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
      <DynamicPerformanceMonitor pageName="ClientLayoutContent (Aggressive Dynamic Import)" />
      <div
        className={`relative flex min-h-[100dvh] w-full max-w-[430px] flex-col ${
          isHiddenUI ? '' : 'bg-white'
        }`}
      >
        {!isHiddenUI && (
          <DynamicHeader title="" showBackButton={false} showNotificationButton={false} />
        )}
        <div
          className={`flex-grow overflow-y-auto shadow-lg ${
            isHiddenUI ? '' : 'pt-[56px] pb-[56px]'
          }`}
        >
          {children}
        </div>
        {!isHiddenUI && <DynamicBottomNavigationBar />}
        {isWaitingModalOpen && <DynamicWaitingModal />}
        {isConfirmModalOpen && <DynamicConfirmModal />}
        {hasNewMessage && <DynamicNewMessageToast />}
      </div>
    </QueryClientProvider>
  );
}
