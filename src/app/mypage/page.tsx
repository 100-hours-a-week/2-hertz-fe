'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import KeywordTagGroup from '@/components/matching/individual/KeywordTagGroup';
import UserProfileCard from '@/components/mypage/UserProfileCard';
import { useConfirmModalStore } from '@/stores/modal/useConfirmModalStore';
import { getUserInfo, GetUserInfoResponse, patchUserIntroduction } from '@/lib/api/user';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { deleteLogout } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function MyPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<GetUserInfoResponse['data'] | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);

    try {
      const response = await deleteLogout();

      if (response.code === 'LOGOUT_SUCCESS') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('hasLoggedIn');
        router.push('/login');
      }
    } catch (error) {
      console.error('deleteLogout 오류: ', error);
      toast.error('로그아웃 처리 중 문제가 발생했습니다.');
    } finally {
    }
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const openModal = useConfirmModalStore((state) => state.openModal);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!userId) {
          console.error('userId가 없습니다.');
          return;
        }
        const response = await getUserInfo(userId);
        setUserInfo(response.data);
      } catch (error) {
        console.error('유저 정보 불러오기 실패: ', error);
      }
    };

    fetchUserInfo();
  }, [userId]);

  if (!userInfo) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Header title="마이페이지" showBackButton={false} showNotificationButton={true} />
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        <div className="flex w-full flex-grow flex-col justify-between rounded-3xl px-5 py-4">
          <div className="space-y-4">
            <UserProfileCard
              profileImage={userInfo.profileImage}
              nickname={userInfo.nickname}
              oneLineIntroduction={userInfo.oneLineIntroduction}
              gender={userInfo.gender}
              onSaveIntroduction={async (newIntro) => {
                if (!userId) return;

                const response = await patchUserIntroduction(userId, newIntro);
                if (response.code === 'PROFILE_UPDATED_SUCCESSFULLY') {
                  toast.success('한 줄 소개가 수정되었습니다', {
                    id: 'update-introduction-success',
                  });
                }
              }}
            />
            <KeywordTagGroup
              keywords={userInfo.keywords}
              sameInterests={userInfo.sameInterests}
              normalInterests={userInfo.interests}
              nickname={userInfo.nickname}
              relationType={userInfo.relationType}
            />
          </div>
        </div>

        <div className="mt-10 flex justify-center px-8">
          <button
            onClick={() =>
              openModal({
                title: '정말 로그아웃 하시겠어요?',
                description: (
                  <>
                    로그아웃 버튼 클릭 시, 계정은 유지되며
                    <br /> 언제든 다시 로그인 할 수 있어요.
                  </>
                ),
                confirmText: '로그아웃하기',
                cancelText: '취소',
                variant: 'quit',
                onConfirm: handleLogout,
                onCancel: cancelLogout,
              })
            }
            className="mb-10 border-b-1 border-[var(--gray-400)] text-xs font-semibold text-[var(--gray-400)]"
          >
            로그아웃
          </button>
        </div>
      </main>
    </>
  );
}
