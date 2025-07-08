'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/layout/Header';
import KeywordTagGroup from '@/components/matching/individual/KeywordTagGroup';
import UserProfileCard from '@/components/mypage/UserProfileCard';
import { useConfirmModalStore } from '@/stores/modal/useConfirmModalStore';
import { getUserInfo, GetUserInfoResponse, patchUserIntroduction } from '@/lib/api/user';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { deleteLogout } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import MatchingAgreementToggleGroup from '@/components/onboarding/information/MatchingAgreementToggleGroup';
import { FormProvider, useForm } from 'react-hook-form';
import { patchUserCategory } from '@/lib/api/matching';

export default function MyPage() {
  const methods = useForm({
    defaultValues: {
      friendAllowed: false,
      coupleAllowed: false,
    },
  });
  const { setValue, watch } = methods;

  const router = useRouter();
  const [userInfo, setUserInfo] = useState<GetUserInfoResponse['data'] | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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
      if (!userId) return;

      const response = await getUserInfo(userId);
      setUserInfo(response.data);

      setValue('friendAllowed', response.data.friendAllowed);
      setValue('coupleAllowed', response.data.coupleAllowed);

      setIsInitialized(true);
    };

    fetchUserInfo();
  }, [userId]);

  const friendAllowed = watch('friendAllowed');
  const coupleAllowed = watch('coupleAllowed');

  const prevFriendAllowedRef = useRef<boolean | undefined>(undefined);
  const prevCoupleAllowedRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (!isInitialized || friendAllowed === undefined) return;

    if (
      prevFriendAllowedRef.current !== undefined &&
      prevFriendAllowedRef.current !== friendAllowed
    ) {
      const update = async () => {
        try {
          await patchUserCategory({ flag: friendAllowed, category: 'FRIEND' });
          toast.success(`친구 수신 설정이 ${friendAllowed ? '활성화' : '비활성화'}되었어요`, {
            id: 'friend-toast',
          });
        } catch (error) {
          console.error('친구 카테고리 수정 실패:', error);
          toast.error('수신 설정 변경에 실패했습니다.', { id: 'friend-error-toast' });
        }
      };

      update();
    }

    prevFriendAllowedRef.current = friendAllowed;
  }, [friendAllowed, isInitialized]);

  useEffect(() => {
    if (!isInitialized || coupleAllowed === undefined) return;

    if (
      prevCoupleAllowedRef.current !== undefined &&
      prevCoupleAllowedRef.current !== coupleAllowed
    ) {
      const update = async () => {
        try {
          await patchUserCategory({ flag: coupleAllowed, category: 'COUPLE' });
          toast.success(`연인 수신 설정이 ${coupleAllowed ? '활성화' : '비활성화'}되었어요`, {
            id: 'couple-toast',
          });
        } catch (error) {
          console.error('연인 카테고리 수정 실패:', error);
          toast.error('수신 설정 변경에 실패했습니다.', { id: 'couple-error-toast' });
        }
      };

      update();
    }

    prevCoupleAllowedRef.current = coupleAllowed;
  }, [coupleAllowed, isInitialized]);

  return (
    <>
      <Header title="마이페이지" showBackButton={false} showNotificationButton={true} />
      <FormProvider {...methods}>
        <main className="flex-1 overflow-y-auto px-4 pt-4">
          <div className="flex w-full flex-grow flex-col justify-between rounded-3xl px-5 py-4">
            <div className="space-y-4">
              {userInfo ? (
                <>
                  <UserProfileCard
                    profileImage={userInfo.profileImage}
                    nickname={userInfo.nickname}
                    oneLineIntroduction={userInfo.oneLineIntroduction}
                    gender={userInfo.gender}
                    onSaveIntroduction={async (newIntro) => {
                      if (!userId) return;
                      const response = await patchUserIntroduction(userId, newIntro);
                      if (response.code === 'PROFILE_UPDATED_SUCCESSFULLY') {
                        toast.success('한 줄 소개가 수정되었습니다');
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
                  <p className="mt-8 px-4 font-semibold">다른 사용자의 매칭 요청 받기</p>
                  <MatchingAgreementToggleGroup />
                </>
              ) : (
                <LoadingSpinner />
              )}
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
      </FormProvider>
    </>
  );
}
