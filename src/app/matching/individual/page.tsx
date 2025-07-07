'use client';

import KeywordTagGroup from '@/components/matching/individual/KeywordTagGroup';
import Header from '@/components/layout/Header';
import TuningProfileCard from '@components/matching/individual/TuningProfileCard';
import MatchingSignalInputBox from '@/components/matching/MatchingSignalInputBox';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTuningUser } from '@/lib/api/matching';
import Loading from './loading';
import { useTuningStore } from '@/stores/matching/useTuningStore';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

export default function IndividualMatchingPage() {
  const queryClient = useQueryClient();
  const setReceiverUserId = useTuningStore((state) => state.setReceiverUserId);
  const [resetInput, setResetInput] = useState(false);

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const category = categoryParam === 'couple' ? 'couple' : 'friend';

  const { data, isLoading } = useQuery({
    queryKey: ['tuningUser', category],
    queryFn: () => getTuningUser(category),
  });

  const matchedUser = data?.data;

  useEffect(() => {
    if (!data) return;

    const code = data.code as string;

    if (code === 'TUNING_SUCCESS') {
      toast.dismiss();
    }

    switch (code) {
      case 'NO_TUNING_CANDIDATE':
        toast.error('추천 가능한 상대가 없습니다.', { id: 'no-tuning-candidate' });
        break;
      case 'USER_INTERESTS_NOT_SELECTED':
        toast.error('취향 선택을 완료해야 매칭이 가능합니다.', { id: 'no-interests-not-selected' });
        break;
      case 'AI_SERVER_ERROR':
        toast.error('AI 서버 오류로 매칭을 불러올 수 없습니다.', { id: 'ai-server-error' });
        break;
      case 'TUNING_SUCCESS':
        if (matchedUser?.userId) {
          setReceiverUserId(matchedUser.userId);
        }
        break;
      default:
        toast.error('알 수 없는 오류가 발생했습니다.', { id: 'unknown-error' });
    }
  }, [data, matchedUser?.userId, setReceiverUserId]);

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['tuningUser'] });
    setResetInput((prev) => !prev);
  };

  if (isLoading || !matchedUser || !data) {
    return <Loading />;
  }

  return (
    <>
      <Header title="매칭된 TUNE" showBackButton={true} showNotificationButton={true} />
      <main className="pb-[calc(3.5rem + env(safe-area-inset-bottom))] flex-1 flex-col overflow-y-hidden px-4 pt-4">
        <div className="flex w-full flex-grow flex-col justify-between rounded-3xl border-2 border-[var(--gray-100)] px-5 py-4">
          <div className="space-y-4">
            <TuningProfileCard
              profileImage={matchedUser.profileImage}
              nickname={matchedUser.nickname}
              oneLineIntroduction={matchedUser.oneLineIntroduction}
              gender={matchedUser.gender}
              onRefresh={handleRefresh}
            />
            <KeywordTagGroup
              keywords={matchedUser.keywords}
              sameInterests={matchedUser.sameInterests}
              nickname={matchedUser.nickname}
            />
          </div>
          <div className="pt-8">
            <MatchingSignalInputBox
              onSend={(message) => console.log('보낸 메시지:', message)}
              reset={resetInput}
              onResetDone={() => setResetInput(false)}
            />
          </div>
        </div>
      </main>
    </>
  );
}
