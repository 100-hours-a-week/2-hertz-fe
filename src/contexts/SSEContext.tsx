'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useSSE } from '@/hooks/useSSE';
import { getSSEHandlers } from '@/constants/sseHandlers';

import { postMatchingAccept, postMatchingReject } from '@/lib/api/matching';
import { useConfirmModalStore } from '@/stores/modal/useConfirmModalStore';
import { useMatchingResponseStore } from '@/stores/modal/useMatchingResponseStore';
import { useWaitingModalStore } from '@/stores/modal/useWaitingModalStore';
import { useNavNewMessageStore } from '@/stores/chat/useNavNewMessageStore';
import { useNewAlarmStore } from '@/stores/chat/useNewAlarmStore';
import { useNewMessageStore } from '@/stores/modal/useNewMessageStore';
import toast from 'react-hot-toast';

type SSEContextValue = {
  reconnect: () => void;
};

const SSEContext = createContext<SSEContextValue | null>(null);

export const SSEProvider = ({ children }: { children: React.ReactNode }) => {
  const [reconnectKey, setReconnectKey] = useState(0);
  const pathname = usePathname();

  const reconnect = useCallback(() => {
    console.log('[SSE] 🔄 reconnect 요청됨');
    setReconnectKey((prev) => prev + 1);
  }, []);

  const confirmModalStore = useConfirmModalStore();
  const matchingResponseStore = useMatchingResponseStore();
  const waitingModalStore = useWaitingModalStore();
  const navNewMessageStore = useNavNewMessageStore();
  const newAlarmStore = useNewAlarmStore();
  const newMessageStore = useNewMessageStore();

  const handlers = useMemo(() => {
    return getSSEHandlers({
      handleAccept: async (channelRoomId, partnerNickname) => {
        await postMatchingAccept({ channelRoomId });
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
  }, [
    pathname,
    confirmModalStore,
    matchingResponseStore,
    waitingModalStore,
    navNewMessageStore,
    newAlarmStore,
    newMessageStore,
  ]);

  useSSE({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sse/subscribe`,
    handlers,
    enabled: true,
    channelRoomId: reconnectKey,
  });

  return <SSEContext.Provider value={{ reconnect }}>{children}</SSEContext.Provider>;
};

export const useSSEContext = () => {
  const ctx = useContext(SSEContext);
  if (!ctx) throw new Error('SSEContext 내부에서 사용해주세요');
  return ctx;
};
