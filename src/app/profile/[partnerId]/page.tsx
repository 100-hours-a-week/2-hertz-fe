'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Header from '@/components/layout/Header';
import KeywordTagGroup from '@/components/matching/individual/KeywordTagGroup';
import UserProfileCard from '@/components/mypage/UserProfileCard';
import { getUserInfo, GetUserInfoResponse } from '@/lib/api/user';

export default function ProfileDetailPage() {
  const { partnerId } = useParams() as { partnerId: string };
  const [userInfo, setUserInfo] = useState<GetUserInfoResponse['data'] | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!partnerId) {
          console.error('partnerId가 없습니다.');
          return;
        }
        const response = await getUserInfo(partnerId);
        setUserInfo(response.data);
      } catch (error) {
        console.error('유저 정보 불러오기 실패: ', error);
      }
    };

    fetchUserInfo();
  }, [partnerId]);

  if (!userInfo) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Header title="프로필 상세보기" showBackButton={true} showNotificationButton={true} />
      <main className="pb-[calc(3.5rem + env(safe-area-inset-bottom))] flex-1 flex-col overflow-y-hidden px-4 pt-4">
        <div className="flex w-full flex-grow flex-col justify-between rounded-3xl px-5 py-4">
          <div className="space-y-4">
            <UserProfileCard
              profileImage={userInfo.profileImage}
              nickname={userInfo.nickname}
              oneLineIntroduction={userInfo.oneLineIntroduction}
              gender={userInfo.gender}
            />
            <KeywordTagGroup
              keywords={userInfo.keywords}
              normalInterests={userInfo.interests}
              sameInterests={userInfo.sameInterests}
              nickname={userInfo.nickname}
              relationType={userInfo.relationType}
            />
          </div>
        </div>
      </main>
    </>
  );
}
