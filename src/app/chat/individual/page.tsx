'use client';

import dayjs from 'dayjs';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getChannelRooms } from '@/lib/api/chat';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ChatRoomNotFoundPage from '@/components/chat/ChatRoomNotFound';

export default function ChannelsIndividualPage() {
  const router = useRouter();
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ['channelRooms'],
      queryFn: ({ pageParam = 0 }) => getChannelRooms(pageParam, 10),
      getNextPageParam: (lastPage) => {
        return lastPage.data?.isLast ? undefined : (lastPage.data?.pageNumber ?? 0) + 1;
      },
      initialPageParam: 0,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data || data.pages[0].code === 'NO_CHANNEL_ROOM') {
    return <ChatRoomNotFoundPage />;
  }

  const rooms = data.pages.flatMap((page) => page.data?.list ?? []) ?? [];

  return (
    <>
      <Header title="채팅" showBackButton={false} showNotificationButton={true} />
      <div className="mt-2 space-y-6 overflow-hidden px-4">
        {rooms.map((room) => (
          <button
            key={room.channelRoomId}
            onClick={() => {
              router.push(
                `/chat/individual/${room.channelRoomId}?page=${room.lastPageNumber}&size=20`,
              );
            }}
            className="flex w-full appearance-none items-start gap-5 overflow-hidden border-none bg-transparent p-0 text-left"
          >
            <div className="flex w-full items-start gap-5 overflow-hidden">
              <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-blue-300">
                <Image
                  width={48}
                  height={48}
                  src={room.partnerProfileImage || '/images/default-profile.png'}
                  alt="프로필 이미지"
                  className="h-full w-full rounded-full object-cover"
                />
                {!room.isRead && (
                  <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--pink)]" />
                )}
              </div>

              <div className="w-full flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className={`rounded-2xl px-2 py-1 text-xs font-semibold ${
                        room.relationType === 'MATCHING'
                          ? 'bg-[var(--light-pink)] text-[var(--pink)]'
                          : 'bg-[var(--gray-100)] text-[var(--blue)]'
                      }`}
                    >
                      {room.category === 'FRIEND' ? '친구 / ' : '연인 / '}
                      {room.relationType === 'MATCHING' ? '매칭' : '시그널'}
                    </span>
                    <span className="text-sm font-semibold text-ellipsis">
                      {room.partnerNickname}
                    </span>
                  </div>
                  <span className="text-xs font-light text-[var(--gray-200)]">
                    {dayjs(room.lastMessageTime).format('A hh:mm')}
                  </span>
                </div>

                <p className="mt-1 line-clamp-2 text-sm font-light text-[var(--gray-400)]">
                  {room.lastMessage}
                </p>
              </div>
            </div>
          </button>
        ))}

        <div ref={ref} />
        {isFetchingNextPage && (
          <p className="text-center text-sm text-gray-400">채널을 불러오는 중...</p>
        )}
      </div>
    </>
  );
}
