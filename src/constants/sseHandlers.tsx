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
import { postMatchingAccept } from '@/lib/api/matching';
import { useMatchingConfirmedStore } from '@/stores/matching/useMatchingConfirmedStore';

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
  waitingModalStore,
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

      const isChatIndividualPage = /^\/chat\/individual\/\d+$/.test(currentPathname);
      if (!isChatIndividualPage) return;

      const currentRoomId = getChannelRoomIdFromPath(currentPathname);
      const effectiveRoomId = currentRoomId ?? channelRoomId;

      const isAlreadyConfirmed = useMatchingConfirmedStore.getState().isConfirmed(channelRoomId);
      const hasAlreadyResponded = useMatchingResponseStore.getState().hasResponded;

      if (isAlreadyConfirmed || hasAlreadyResponded) return;
      if (effectiveRoomId !== channelRoomId) return;

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
        onConfirm: async () => {
          matchingResponseStore.setHasResponded(true);
          try {
            const response = await postMatchingAccept({ channelRoomId });
            console.log('response from postMatchingAccept:', response);
            useWaitingModalStore.getState().openModal(partnerNickname, channelRoomId);

            switch (response.code) {
              case 'MATCH_SUCCESS':
                await queryClient.invalidateQueries({
                  queryKey: ['channelRoomDetail', channelRoomId],
                });
                useWaitingModalStore.getState().reset();
                break;
              case 'MATCH_FAILED':
                toast.error('상대방이 이미 거절했어요');
                break;
              case 'MATCH_PENDING':
                toast('상대방의 응답을 기다리고 있어요.', { icon: '💬' });
                break;
              default:
                toast.error('알 수 없는 응답입니다.');
            }
          } catch (error: any) {
            if (error.response?.data?.code === 'USER_DEACTIVATED') {
              toast.error('상대방이 탈퇴한 사용자입니다.');
            } else {
              toast.error('매칭 처리 중 오류가 발생했어요.');
            }
          } finally {
            confirmModalStore.closeModal();
          }
        },
        onCancel: () => {
          matchingResponseStore.setHasResponded(true);
          toast(`${partnerNickname}님과의 매칭을 거절했어요`, { icon: '🙅‍♀️' });
          handleReject(channelRoomId, partnerNickname);
          confirmModalStore.closeModal();
        },
      });
    },

    'matching-confirmed': async (data: unknown) => {
      const { partnerNickname, channelRoomId } = data as MatchingPayload;

      useMatchingConfirmedStore.getState().markConfirmed(channelRoomId);

      const hasAlreadyResponded = useMatchingResponseStore.getState().hasResponded;
      if (hasAlreadyResponded) return;

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
          onConfirm: async () => {
            matchingResponseStore.setHasResponded(true);

            if (relationType === 'UNMATCHED') {
              toast(`${partnerNickname}님과 매칭을 실패했어요`, { icon: '🥺' });
            } else {
              const response = await postMatchingAccept({ channelRoomId });
              waitingModalStore.openModal(partnerNickname, channelRoomId);
              handleAccept(channelRoomId, partnerNickname);

              if (response.code === 'MATCH_SUCCESS') {
                waitingModalStore.reset();
              }
            }
            confirmModalStore.closeModal();
          },
          onCancel: () => {
            matchingResponseStore.setHasResponded(true);
            toast(`${partnerNickname}님과의 매칭을 거절했어요`, { icon: '🙅‍♀️' });
            handleReject(channelRoomId, partnerNickname);
            confirmModalStore.closeModal();
          },
        });
      } catch (e) {
        toast.error('매칭 정보를 확인하는 데 실패했습니다.');
        confirmModalStore.closeModal();
      }
    },

    'matching-success': async (data: unknown) => {
      const { partnerNickname, channelRoomId } = data as MatchingPayload;
      useWaitingModalStore.getState().reset();
      toast.success(`🎉 ${partnerNickname}님과 매칭이 완료됐어요!`, { id: 'matching-success' });

      try {
        await queryClient.invalidateQueries({
          queryKey: ['channelRoomDetail', channelRoomId],
        });
      } catch (e) {
        console.error('채팅방 정보를 갱신하는 데 실패했습니다:', e);
      }
    },

    'matching-rejection': (data: unknown) => {
      const { partnerNickname } = data as MatchingPayload;
      useWaitingModalStore.getState().reset();
      toast(`${partnerNickname}님이 매칭을 거절했어요`, { icon: '🥲' });
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
