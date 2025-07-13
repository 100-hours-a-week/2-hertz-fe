import toast from 'react-hot-toast';
import { getChannelRoomDetail } from '@/lib/api/chat';
import { queryClient } from '@/lib/queryClient';

import { useConfirmModalStore } from '@/stores/modal/useConfirmModalStore';
import { useMatchingResponseStore } from '@/stores/modal/useMatchingResponseStore';
import { useNavNewMessageStore } from '@/stores/chat/useNavNewMessageStore';
import { useNewAlarmStore } from '@/stores/chat/useNewAlarmStore';
import { useNewMessageStore } from '@/stores/modal/useNewMessageStore';
import { useWaitingModalStore } from '@/stores/modal/useWaitingModalStore';
import type { NewMessageType } from '@/types/chat';

export type MatchingPayload = {
  partnerNickname: string;
  channelRoomId: number;
};

export type NewMessage = {
  partnerId: number;
  partnerNickname: string;
  message: string;
  messageSendAt: string;
  partnerProfileImage: string;
};

export type SSEEventHandlers = Record<string, (data: unknown) => void>;

export type HandlerParams = {
  pathname: string;
  handleAccept: (channelRoomId: number, partnerNickname: string) => void;
  handleReject: (channelRoomId: number, partnerNickname: string) => void;
  getChannelRoomIdFromPath: (pathname: string) => number | null;
  confirmModalStore: ReturnType<typeof useConfirmModalStore.getState>;
  matchingResponseStore: ReturnType<typeof useMatchingResponseStore.getState>;
  waitingModalStore: ReturnType<typeof useWaitingModalStore.getState>;
  navNewMessageStore: ReturnType<typeof useNavNewMessageStore.getState>;
  newAlarmStore: ReturnType<typeof useNewAlarmStore.getState>;
  newMessageStore: ReturnType<typeof useNewMessageStore.getState>;
};

export const getSSEHandlers = ({
  pathname,
  handleAccept,
  handleReject,
  getChannelRoomIdFromPath,
  confirmModalStore,
  matchingResponseStore,
  navNewMessageStore,
  newAlarmStore,
  newMessageStore,
}: HandlerParams): SSEEventHandlers => {
  return {
    'signal-matching-conversion': (data: unknown) => {
      const { partnerNickname } = data as MatchingPayload;
      toast.success(`🎉 ${partnerNickname}님과 매칭이 가능해졌어요!`);
    },

    'signal-matching-conversion-in-room': (data: unknown) => {
      const { partnerNickname, channelRoomId } = data as MatchingPayload;

      const currentPathname = window.location.pathname;
      const currentRoomId = getChannelRoomIdFromPath(currentPathname);
      const effectiveRoomId = currentRoomId ?? channelRoomId;

      if (effectiveRoomId !== channelRoomId) {
        console.log('[DEBUG] 이벤트 무시됨', { currentRoomId, eventRoomId: channelRoomId });
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[DEBUG] 매칭 모달 띄움 - signal-matching-conversion-in-room', {
          pathname: currentPathname,
          currentRoomId,
          channelRoomId,
        });
      }

      confirmModalStore.openModal({
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
          matchingResponseStore.setHasResponded(true);
          handleAccept(channelRoomId, partnerNickname);
          confirmModalStore.closeModal();
        },
        onCancel: () => {
          matchingResponseStore.setHasResponded(true);
          handleReject(channelRoomId, partnerNickname);
          confirmModalStore.closeModal();
        },
      });
    },

    'matching-confirmed': async (data: unknown) => {
      const { channelRoomId, partnerNickname } = data as MatchingPayload;

      try {
        const res = await getChannelRoomDetail(channelRoomId);
        const relationType = res.data.relationType;

        confirmModalStore.openModal({
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
            if (relationType === 'UNMATCHED') {
              toast(`${partnerNickname}님과 매칭을 실패했어요`, { icon: '🥺' });
            } else {
              handleAccept(channelRoomId, partnerNickname);
            }
            confirmModalStore.closeModal();
          },
          onCancel: () => {
            handleReject(channelRoomId, partnerNickname);
            confirmModalStore.closeModal();
          },
        });
      } catch (e) {
        toast.error('매칭 정보를 확인하는 데 실패했습니다.');
        confirmModalStore.closeModal();
      }
    },

    'nav-new-message': () => {
      navNewMessageStore.setHasNewMessage(true);
    },
    'nav-no-any-new-message': () => {
      navNewMessageStore.setHasNewMessage(false);
    },
    'new-alarm': () => {
      newAlarmStore.setHasNewAlarm(true);
      queryClient.invalidateQueries({ queryKey: ['channelRooms'] });
    },
    'no-any-new-alarm': () => {
      newAlarmStore.setHasNewAlarm(false);
    },
    'new-message-reception': (data: unknown) => {
      const message = data as NewMessageType;
      newMessageStore.showToast(message);
      queryClient.invalidateQueries({ queryKey: ['channelRooms'] });
    },
    'new-signal-reception': (data: unknown) => {
      const { partnerNickname } = data as { partnerNickname: string };
      toast(`${partnerNickname}님에게 첫 메세지가 도착했어요!`, {
        icon: '💬',
        duration: 4000,
      });
    },
  };
};
