'use client';

import ReceiverMessage from '@/components/chat/common/ReceiverMessage';
import SenderMessage from '@/components/chat/common/SenderMessage';
import ChatHeader from '@/components/layout/ChatHeader';
import ChatSignalInputBox from '@/components/chat/common/ChatSignalInputBox';
import {
  ChannelRoomDetailResponse,
  getChannelRoomDetail,
  postChannelMessage,
} from '@/lib/api/chat';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { formatKoreanDate } from '@/utils/format';
import UnavailableChannelBanner from '@/components/chat/UnavailableChannelBanner';

export default function ChatsIndividualPage() {
  const { channelRoomId } = useParams();
  const queryClient = useQueryClient();
  const { ref: scrollRef, inView } = useInView();

  const parsedChannelRoomId = Number(channelRoomId);
  const isChannelRoomIdValid = !!channelRoomId && !isNaN(parsedChannelRoomId);

  const { data, isLoading, fetchNextPage, hasNextPage } =
    useInfiniteQuery<ChannelRoomDetailResponse>({
      queryKey: ['channelRoom', parsedChannelRoomId],
      queryFn: ({ pageParam = 0 }) => {
        const page = pageParam as number;
        return getChannelRoomDetail(parsedChannelRoomId, page, 20);
      },
      getNextPageParam: (lastPage) => {
        const pagination = lastPage.data.messages.pageable;
        return pagination.isLast ? undefined : pagination.pageNumber + 1;
      },
      initialPageParam: 0,
      enabled: isChannelRoomIdValid,
    });

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data?.pages]);

  const partner = data?.pages?.[0]?.data;
  const messages = data?.pages.flatMap((page) => page.data.messages.list) || [];

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // polling
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['channelRoom', parsedChannelRoomId] });
    }, 3000);

    return () => clearInterval(interval);
  }, [parsedChannelRoomId, queryClient]);

  const handleSend = async (message: string, onSuccess: () => void) => {
    try {
      const response = await postChannelMessage(parsedChannelRoomId, { message });

      if (response.code === 'MESSAGE_CREATED') {
        onSuccess();
      } else if (response.code === 'USER_DEACTIVATED') {
        toast.error('상대방이 탈퇴한 사용자입니다.');
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      toast.error('메세지 전송에 실패했습니다.');
    }
  };

  if (!isChannelRoomIdValid)
    return (
      <p className="items-center justify-center text-sm font-medium">잘못된 채널 ID 입니다.</p>
    );
  if (isLoading)
    return <p className="flex items-center justify-center text-sm font-medium">로딩 중...</p>;

  const isUnmatched = partner?.relationType === 'UNMATCHED';

  return (
    <>
      <main className="relative flex h-full w-full flex-col overflow-x-hidden px-6 pb-18">
        {typeof partner?.partnerId === 'number' && (
          <ChatHeader
            title={partner?.partnerNickname ?? ''}
            partnerId={partner?.partnerId}
            onLeave={() => console.log('나가기')}
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
      {isUnmatched ? (
        <div className="absolute bottom-14 w-full bg-white px-5 pt-2 pb-2">
          <UnavailableChannelBanner />
          <ChatSignalInputBox
            onSend={handleSend}
            disabled={true}
            placeholder="더 이상 메세지를 보낼 수 없습니다"
          />
        </div>
      ) : (
        <div className="absolute bottom-14 w-full bg-white px-5 pt-2 pb-2">
          <ChatSignalInputBox onSend={handleSend} placeholder="메세지를 입력해주세요" />
        </div>
      )}
    </>
  );
}
