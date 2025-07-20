'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Header from '@/components/layout/Header';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getAlarmList } from '@/lib/api/alarm';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AlarmListNotFoundPage from '@/components/alarm/AlarmListNotFound';
import toast from 'react-hot-toast';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export default function AlarmPage() {
  const router = useRouter();
  const { ref, inView } = useInView();

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ['alarmLists'],
      queryFn: ({ pageParam = 0 }) => getAlarmList(pageParam, 10),
      getNextPageParam: (lastPage) => {
        return lastPage.data?.isLast ? undefined : (lastPage.data?.pageNumber ?? 0) + 1;
      },
      initialPageParam: 0,
    });

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['channelRooms'] });
    }, 5000);

    return () => clearInterval(interval);
  }, [queryClient]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) {
    return <AlarmListNotFoundPage />;
  }

  const alarms = data.pages.flatMap((page) => page.data?.list ?? []) ?? [];

  return (
    <>
      <Header title="알림" showBackButton={true} showNotificationButton={false} />
      <div className="space-y-3 px-4 py-2">
        <Accordion type="single" collapsible className="w-full">
          {alarms.map((alarm, index) => {
            if (alarm.type === 'REPORT') {
              return (
                <div
                  key={index}
                  onClick={() => router.push('/report')}
                  className="cursor-pointer rounded-xl border-b bg-white px-4 py-2 transition hover:bg-gray-50"
                >
                  <div className="mt-1 mb-1 flex items-center justify-between">
                    <span className="flex-shrink-0 rounded-2xl bg-[var(--light-blue)] px-2.5 py-1 text-xs font-semibold text-[var(--dark-blue)]">
                      튜닝
                    </span>
                    <span className="text-xs text-[var(--gray-300)]">
                      {dayjs(alarm.createdDate).fromNow()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 text-left text-sm font-medium">
                    <div className="flex flex-col gap-1 px-1">
                      <span className="text-black">💌 {alarm.title}</span>
                    </div>
                  </div>
                </div>
              );
            }
            if (alarm.type === 'ALERT') {
              return (
                <div
                  key={index}
                  className="cursor-pointer rounded-xl border-b bg-white px-4 py-2 transition hover:bg-gray-50"
                >
                  <div className="mt-1 mb-1 flex items-center justify-between">
                    <span className="flex-shrink-0 rounded-2xl bg-[var(--light-blue)] px-2.5 py-1 text-xs font-semibold text-[var(--dark-blue)]">
                      경고
                    </span>
                    <span className="text-xs text-[var(--gray-300)]">
                      {dayjs(alarm.createdDate).fromNow()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 text-left text-sm font-medium">
                    <div className="flex flex-col gap-1 px-1">
                      <span className="text-black">🚨 {alarm.title}</span>
                    </div>
                  </div>
                </div>
              );
            } else if (alarm.type === 'MATCHING') {
              const roomId = alarm.channelRoomId;
              const lastPageNumber = alarm.lastPageNumber ?? 0;

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (!roomId) {
                      toast.error('이미 나간 채팅방입니다.');
                    }
                    router.push(`/chat/individual/${roomId}?page=${lastPageNumber}&size=20`);
                  }}
                  className="cursor-pointer rounded-xl border-b bg-white px-4 py-2 transition hover:bg-gray-50"
                >
                  <div className="mt-1 mb-1 flex items-center justify-between">
                    <span className="flex-shrink-0 rounded-2xl bg-[var(--light-pink)] px-2.5 py-1 text-xs font-semibold text-[var(--pink)]">
                      매칭
                    </span>
                    <span className="text-xs text-[var(--gray-300)]">
                      {dayjs(alarm.createdDate).fromNow()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 text-left text-sm font-medium">
                    <div className="flex flex-col gap-1 px-1">
                      <span className="text-black">{alarm.title}</span>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="mt-1 rounded-xl border-b bg-white px-4 py-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="flex-shrink-0 rounded-2xl bg-[var(--gray-100)] px-2.5 py-1 text-xs font-semibold text-[var(--gray-300)]">
                    공지
                  </span>
                  <span className="text-xs text-gray-400">
                    {dayjs(alarm.createdDate).fromNow()}
                  </span>
                </div>
                <AccordionTrigger className="flex items-center justify-between text-left text-sm font-medium">
                  <div className="flex w-full flex-col gap-1">
                    <div className="inline-flex items-center gap-1">
                      <span className={`px-1 text-sm font-semibold text-black`}>
                        📢 {alarm.title}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-wrap-keep text-sm leading-6 text-[var(--gray-300)]">
                  {alarm.content}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </>
  );
}
