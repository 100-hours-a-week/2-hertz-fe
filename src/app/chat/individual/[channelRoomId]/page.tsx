'use client';

import ReceiverMessage from '@/components/chat/common/ReceiverMessage';
import SenderMessage from '@/components/chat/common/SenderMessage';
import ChatHeader from '@/components/layout/ChatHeader';
import ChatSignalInputBox from '@/components/chat/common/ChatSignalInputBox';
import {
  ChannelRoomDetailResponse,
  deleteChannelRoom,
  getChannelRoomDetail,
  postReportMessage,
} from '@/lib/api/chat';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, useCallback } from 'react';
import { formatKoreanDate } from '@/utils/format';
import UnavailableChannelBanner from '@/components/chat/UnavailableChannelBanner';
import { useWaitingModalStore } from '@/stores/modal/useWaitingModalStore';
import { useConfirmModalStore } from '@/stores/modal/useConfirmModalStore';
import { useMatchingResponseStore } from '@/stores/modal/useMatchingResponseStore';
import { WebSocketIncomingMessage } from '@/types/WebSocketType';
import { useSocketIO } from '@/hooks/useSocketIO';
import { AxiosError } from 'axios';

export default function ChatsIndividualPage() {
  const { channelRoomId } = useParams();
  const { ref: scrollRef, inView } = useInView();

  const parsedChannelRoomId = Number(channelRoomId);
  const isChannelRoomIdValid = !!channelRoomId && !isNaN(parsedChannelRoomId);

  const router = useRouter();

  const [messages, setMessages] = useState<ChannelRoomDetailResponse['data']['messages']['list']>(
    [],
  );

  const {
    shouldShowModal,
    channelRoomId: waitingModalChannelId,
    openModal,
  } = useWaitingModalStore();

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
          await postReportMessage({
            messageId,
            messageContent,
            reportedUserId,
          });
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

  const myUserIdRef = useRef<number | null>(null);
  const hasScrolledToBottomRef = useRef(false);

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery<ChannelRoomDetailResponse>({
      queryKey: ['channelRoom', parsedChannelRoomId],
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
    });

  const handleSocketMessage = (data: WebSocketIncomingMessage) => {
    switch (data.event) {
      case 'init_user':
        myUserIdRef.current = data.data;
        break;
      case 'receive_message': {
        const { messageId, senderId, roomId, message, sendAt } = data.data;
        const isMine = senderId === myUserIdRef.current;
        if (!isMine) sendMarkAsRead({ roomId });
        const cleanedSendAt =
          typeof sendAt === 'string' ? sendAt.replace(/^(.+\.\d{3})\d*$/, '$1') : sendAt;

        setMessages((prev) => {
          const alreadyExists = prev.some(
            (msg) =>
              msg.messageSenderId === senderId &&
              msg.messageContents === message &&
              msg.messageSendAt === cleanedSendAt,
          );
          if (alreadyExists) return prev;

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
    }
  };

  const { sendSocketMessage, sendMarkAsRead } = useSocketIO({
    channelRoomId: parsedChannelRoomId,
    onMessage: handleSocketMessage,
  });

  useEffect(() => {
    console.log('[DEBUG] sendSocketMessage:', sendSocketMessage);
  }, [sendSocketMessage]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const initMessages = async () => {
      if (!data || hasScrolledToBottomRef.current) return;

      let currentData = data;

      while (currentData && !currentData.pages.at(-1)?.data.messages.pageable.isLast) {
        const next = await fetchNextPage();
        if (!next.data) break;
        currentData = next.data;
      }

      const allMessages = currentData.pages.flatMap((page) => page.data.messages.list);
      setMessages(allMessages);

      scrollToBottom();
      hasScrolledToBottomRef.current = true;
    };

    initMessages();
  }, [data, fetchNextPage, scrollToBottom]);

  const bottomRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    scrollToBottom();
  }, [data?.pages, scrollToBottom]);

  const partner = data?.pages?.[0]?.data;
  const hasResponded = useMatchingResponseStore((state) => state.hasResponded);
  const isUnmatched = partner?.relationType === 'UNMATCHED' && hasResponded;
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingRef.current) {
      isFetchingRef.current = true;
      fetchNextPage().finally(() => {
        isFetchingRef.current = false;
      });
    }
  }, [inView, hasNextPage, fetchNextPage]);

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
    } catch (e) {
      toast.error('메세지 전송에 실패했어요');
    }

    onSuccess();
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
              <div key={msg.messageId} ref={index === messages.length - 1 ? scrollRef : null}>
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
        {isUnmatched ? (
          <>
            <UnavailableChannelBanner />
            <ChatSignalInputBox
              onSend={handleSend}
              disabled={true}
              placeholder="더 이상 메세지를 보낼 수 없습니다"
            />
          </>
        ) : (
          <ChatSignalInputBox onSend={handleSend} placeholder="메세지를 입력해주세요" />
        )}
      </div>
    </>
  );
}
