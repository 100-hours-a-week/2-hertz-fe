'use client';

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';

import ReceiverMessage from '@/components/chat/common/ReceiverMessage';
import SenderMessage from '@/components/chat/common/SenderMessage';
import ChatHeader from '@/components/layout/ChatHeader';
import ChatSignalInputBox from '@/components/chat/common/ChatSignalInputBox';
import UnavailableChannelBanner from '@/components/chat/UnavailableChannelBanner';

import {
  getChannelRoomDetail,
  deleteChannelRoom,
  postReportMessage,
  ChannelRoomDetailResponse,
} from '@/lib/api/chat';
import { formatKoreanDate } from '@/utils/format';
import { useSocketIO } from '@/hooks/useSocketIO';
import { WebSocketIncomingMessage } from '@/types/WebSocketType';
import { AxiosError } from 'axios';

import { useWaitingModalStore } from '@/stores/modal/useWaitingModalStore';
import { useConfirmModalStore } from '@/stores/modal/useConfirmModalStore';
import { useMatchingResponseStore } from '@/stores/modal/useMatchingResponseStore';
import { useChannelRoomStore } from '@/stores/modal/useChannelRoomStore';

export default function ChatsIndividualPage() {
  const { channelRoomId } = useParams();
  const parsedChannelRoomId = Number(channelRoomId);
  const isChannelRoomIdValid = !!channelRoomId && !isNaN(parsedChannelRoomId);
  const router = useRouter();
  const { inView } = useInView();
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState<ChannelRoomDetailResponse['data']['messages']['list']>(
    [],
  );
  const myUserIdRef = useRef<number | null>(null);

  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 0;

  const mountTimestamp = useMemo(() => Date.now(), []);

  const bottomRef = useRef<HTMLDivElement>(null);

  const isWaitingModalVisible = useWaitingModalStore((state) => state.shouldShowModal);
  const isMatchingResponseModalVisible = useMatchingResponseStore((state) => state.isModalOpen);

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery<ChannelRoomDetailResponse>({
      refetchOnMount: 'always',
      queryKey: ['channelRoom', parsedChannelRoomId, initialPage, mountTimestamp],
      queryFn: async ({ pageParam = 0 }) => {
        const page = pageParam as number;
        const response = await getChannelRoomDetail(parsedChannelRoomId, page, 20);
        if (response.code === 'ALREADY_EXITED_CHANNEL_ROOM')
          throw new Error('ALREADY_EXITED_CHANNEL_ROOM');
        if (response.code === 'USER_DEACTIVATED') throw new Error('USER_DEACTIVATED');
        return response;
      },
      getNextPageParam: (lastPage) => {
        const pagination = lastPage.data.messages.pageable;
        return pagination.isLast ? undefined : pagination.pageNumber + 1;
      },
      initialPageParam: 0,
      enabled: isChannelRoomIdValid,
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: false,
      retry: false,
    });

  const hasInitializedRef = useRef<{ [page: number]: boolean }>({});

  useEffect(() => {
    const initMessages = async () => {
      if (!data || hasInitializedRef.current[initialPage]) return;
      hasInitializedRef.current[initialPage] = true;
      let currentData = data;
      let fetchCount = 0;

      while (
        currentData.pages.length - 1 < initialPage &&
        !currentData.pages.at(-1)?.data.messages.pageable.isLast &&
        fetchCount < 10
      ) {
        const next = await fetchNextPage();
        if (!next.data) break;
        currentData = next.data;
        fetchCount++;
      }

      const allMessages = currentData.pages.flatMap((page) => page.data.messages.list);
      setMessages(allMessages);

      requestAnimationFrame(() => {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'auto' });
        }, 0);
      });
    };

    initMessages();
  }, [data, fetchNextPage, initialPage]);

  const { sendSocketMessage, sendMarkAsRead, isConnected, reconnect } = useSocketIO({
    channelRoomId: parsedChannelRoomId,
    onMessage: (data: WebSocketIncomingMessage) => {
      switch (data.event) {
        case 'init_user':
          myUserIdRef.current = data.data;
          break;
        case 'receive_message': {
          const { messageId, senderId, roomId, message, sendAt } = data.data;
          const isMine = senderId === myUserIdRef.current;

          if (!isMine && isConnected) {
            sendMarkAsRead({ roomId });
          } else if (!isMine && !isConnected) {
            console.log('⚠️ 읽음 처리 스킵 - 소켓 연결 없음:', { roomId });
          }
          const cleanedSendAt =
            typeof sendAt === 'string' ? sendAt.replace(/^(.+\.\d{3})\d*$/, '$1') : sendAt;

          setMessages((prev) => {
            // messageId가 있는 경우 messageId로 중복 체크
            if (messageId) {
              const alreadyExists = prev.some((msg) => msg.messageId === messageId);
              if (alreadyExists) return prev;
            } else {
              // messageId가 없는 경우 senderId, message, 시간으로 중복 체크
              const alreadyExists = prev.some(
                (msg) =>
                  msg.messageSenderId === senderId &&
                  msg.messageContents === message &&
                  Math.abs(
                    new Date(msg.messageSendAt).getTime() - new Date(cleanedSendAt).getTime(),
                  ) < 1000,
              );
              if (alreadyExists) return prev;
            }

            return [
              ...prev,
              {
                messageId,
                messageSenderId: senderId,
                messageContents: message,
                messageSendAt: cleanedSendAt,
              },
            ];
          });
          break;
        }
        case 'relation_type_changed': {
          const { channelRoomId, relationType } = data.data;

          console.log('🔄 소켓을 통한 관계 타입 변경 감지:', {
            channelRoomId,
            relationType,
            currentRoomId: parsedChannelRoomId,
          });

          if (channelRoomId === parsedChannelRoomId) {
            console.log('🎯 현재 채팅방의 관계 타입 변경 - 즉시 UI 업데이트');

            useChannelRoomStore.getState().setRelationType(channelRoomId, relationType);

            queryClient.invalidateQueries({
              predicate: (query) => {
                return query.queryKey[0] === 'channelRoom' && query.queryKey[1] === channelRoomId;
              },
            });

            if (relationType === 'MATCHING') {
              toast.success('🎉 매칭이 완료됐어요!', { id: 'socket-matching-success' });
            }
          }
          break;
        }
      }
    },
  });

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const timeout = setTimeout(() => scrollToBottom(), 0);
      return () => clearTimeout(timeout);
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isError && error instanceof Error) {
      if (error.message === 'ALREADY_EXITED_CHANNEL_ROOM') {
        toast.error('이미 나간 채팅방입니다.');
        router.back();
      } else if (error.message === 'USER_DEACTIVATED') {
        toast.error('상대방이 탈퇴한 사용자입니다.');
        router.back();
      } else {
        toast.error('채팅방 정보를 불러오는 중 오류가 발생했습니다.');
      }
    }
  }, [isError, error, router]);

  const partner = data?.pages?.[0]?.data;

  const relationTypeFromStore = useChannelRoomStore((state) =>
    state.getRelationType(parsedChannelRoomId),
  );
  const effectiveRelationType = relationTypeFromStore ?? partner?.relationType;
  const isUnmatched = effectiveRelationType === 'UNMATCHED';

  useEffect(() => {}, [
    relationTypeFromStore,
    partner?.relationType,
    effectiveRelationType,
    isUnmatched,
    isConnected,
    parsedChannelRoomId,
  ]);

  // 소켓 연결 상태 모니터링 및 재연결 시도
  useEffect(() => {
    if (!isConnected) {
      console.log('⚠️ 소켓 연결 끊김 감지:', { channelRoomId: parsedChannelRoomId });

      const reconnectTimer = setTimeout(() => {
        if (!isConnected) {
          console.log('🔄 자동 재연결 시도:', { channelRoomId: parsedChannelRoomId });
          toast('연결이 끊어졌습니다. 재연결 시도 중...', {
            icon: '🔄',
            id: 'socket-reconnect',
          });
          reconnect();
        }
      }, 3000);

      return () => {
        clearTimeout(reconnectTimer);
      };
    } else {
      console.log('✅ 소켓 연결 활성화:', { channelRoomId: parsedChannelRoomId });
      toast.dismiss('socket-reconnect');
    }
  }, [isConnected, parsedChannelRoomId, reconnect]);

  useEffect(() => {
    if (partner?.relationType) {
      useChannelRoomStore.getState().setRelationType(parsedChannelRoomId, partner.relationType);
    }
  }, [partner?.relationType, parsedChannelRoomId]);

  useEffect(() => {
    if (relationTypeFromStore === 'MATCHING' && partner?.relationType !== 'MATCHING') {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === 'channelRoom' && query.queryKey[1] === parsedChannelRoomId;
        },
      });
    }
  }, [relationTypeFromStore, partner?.relationType, parsedChannelRoomId, queryClient]);

  const isFetchingRef = useRef(false);
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingRef.current) {
      isFetchingRef.current = true;
      fetchNextPage().finally(() => {
        isFetchingRef.current = false;
      });
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const {
    shouldShowModal,
    channelRoomId: waitingModalChannelId,
    openModal,
  } = useWaitingModalStore();

  useEffect(() => {
    if (
      shouldShowModal &&
      partner?.partnerNickname &&
      waitingModalChannelId === parsedChannelRoomId &&
      partner?.relationType !== 'MATCHING'
    ) {
      openModal(partner.partnerNickname, parsedChannelRoomId);
    }
  }, [shouldShowModal, partner?.partnerNickname, parsedChannelRoomId, waitingModalChannelId]);

  const handleSend = (message: string, onSuccess: () => void) => {
    if (!isConnected) {
      toast.error('연결이 끊어져 메시지를 전송할 수 없습니다. 재연결을 시도하세요.', {
        id: 'message-send-failed',
      });
      console.log('❌ 메시지 전송 실패 - 소켓 연결 없음:', {
        channelRoomId: parsedChannelRoomId,
        message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
      });
      reconnect();
      return;
    }

    if (!partner?.partnerId) {
      toast.error('상대방 정보가 없습니다.');
      return;
    }

    const sendAt = new Date().toISOString();
    try {
      sendSocketMessage({
        roomId: parsedChannelRoomId,
        receiverUserId: partner.partnerId,
        message,
        sendAt,
      });
      console.log('✅ 메시지 전송 완료');
    } catch (e) {
      console.error('❌ 메시지 전송 오류:', e);
      toast.error('메세지 전송에 실패했어요');
      return;
    }
    onSuccess();
  };

  const handleReport = ({
    messageId,
    messageContent,
    reportedUserId,
  }: {
    messageId: number;
    messageContent: string;
    reportedUserId: number;
  }) => {
    useConfirmModalStore.getState().openModal({
      title: '부적절한 메시지로 신고하시겠어요?',
      description:
        '신고 내용은 운영진에게 전달되며, 신고된 메시지는 운영 정책에 따라 검토 후 조치됩니다.',
      confirmText: '신고하기',
      cancelText: '취소',
      variant: 'confirm',
      onConfirm: async () => {
        try {
          await postReportMessage({ messageId, messageContent, reportedUserId });
          toast.success('신고가 정상적으로 접수되었습니다.');
        } catch (error: unknown) {
          if (error instanceof AxiosError && error.response?.data?.code === 'USER_DEACTIVATED') {
            toast.error('상대방이 탈퇴한 사용자입니다.');
          } else {
            toast.error('신고 처리 중 오류가 발생했습니다.');
          }
        } finally {
          useConfirmModalStore.getState().closeModal();
        }
      },
      onCancel: () => {
        useConfirmModalStore.getState().closeModal();
      },
    });
  };

  const isWaitingInThisRoom =
    isWaitingModalVisible && waitingModalChannelId === parsedChannelRoomId;

  const isMatchingInThisRoom =
    isMatchingResponseModalVisible && waitingModalChannelId === parsedChannelRoomId;

  const handleLeaveChatRoom = (channelRoomId: number, partnerNickname: string) => {
    useConfirmModalStore.getState().openModal({
      title: '정말 채팅방을 나가시겠어요?',
      description: '채널을 나가면 메시지를 다시 확인할 수 없으며,\n상대와의 채팅이 종료됩니다',
      confirmText: '나가기',
      cancelText: '취소',
      variant: 'confirm',
      onConfirm: async () => {
        try {
          await deleteChannelRoom(channelRoomId);
          toast.success(`${partnerNickname}님과의 채팅방에서 나갔습니다.`);
          router.push('/chat');
        } catch (e) {
          toast.error('채팅방 나가기 중 문제가 발생했어요.');
        } finally {
          useConfirmModalStore.getState().closeModal();
        }
      },
      onCancel: () => {
        useConfirmModalStore.getState().closeModal();
      },
    });
  };

  if (!isChannelRoomIdValid) return toast.error('나간 채팅방에 다시 접속할 수 없습니다.');
  if (isLoading)
    return <p className="flex items-center justify-center text-sm font-medium">로딩 중...</p>;

  return (
    <>
      <main className="relative flex h-full w-full flex-col overflow-x-hidden px-6 pb-18">
        {typeof partner?.partnerId === 'number' && (
          <ChatHeader
            title={partner?.partnerNickname ?? ''}
            partnerId={partner?.partnerId}
            onLeave={() => handleLeaveChatRoom(parsedChannelRoomId, partner?.partnerNickname ?? '')}
          />
        )}
        <div className="flex flex-col gap-6">
          {messages.map((msg, index) => {
            const currentDate = formatKoreanDate(msg.messageSendAt);
            const prevDate = index > 0 ? formatKoreanDate(messages[index - 1].messageSendAt) : null;
            const isNewDate = currentDate !== prevDate;
            return (
              <div key={msg.messageId}>
                {isNewDate && (
                  <div className="mx-auto mt-2 mb-4 w-fit rounded-2xl bg-[var(--gray-100)] px-4 py-1 text-sm font-semibold text-[var(--gray-400)]">
                    {currentDate}
                  </div>
                )}
                {msg.messageSenderId === partner?.partnerId ? (
                  <ReceiverMessage
                    nickname={partner?.partnerNickname ?? ''}
                    profileImage={partner?.partnerProfileImage ?? '/images/default-profile.png'}
                    contents={msg.messageContents}
                    sentAt={msg.messageSendAt}
                    partnerId={partner?.partnerId ?? null}
                    relationType={partner?.relationType ?? null}
                    onLongPress={() => {
                      if (!msg.messageId || !msg.messageSenderId) return;
                      handleReport({
                        messageId: msg.messageId,
                        messageContent: msg.messageContents,
                        reportedUserId: msg.messageSenderId,
                      });
                    }}
                  />
                ) : (
                  <SenderMessage
                    contents={msg.messageContents}
                    sentAt={msg.messageSendAt}
                    relationType={partner?.relationType ?? null}
                  />
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </main>
      <div className="absolute bottom-14 w-full bg-white px-5 pt-2 pb-2">
        {isUnmatched && <UnavailableChannelBanner />}
        <ChatSignalInputBox
          onSend={handleSend}
          disabled={!isConnected || isUnmatched || isWaitingInThisRoom || isMatchingInThisRoom}
          placeholder={
            !isConnected
              ? '연결 중... 잠시만 기다려주세요'
              : isUnmatched
                ? '더 이상 메세지를 보낼 수 없습니다'
                : isWaitingModalVisible
                  ? '메세지를 입력해주세요'
                  : isMatchingResponseModalVisible
                    ? '메세지를 입력해주세요'
                    : '메세지를 입력해주세요'
          }
        />
      </div>
    </>
  );
}
