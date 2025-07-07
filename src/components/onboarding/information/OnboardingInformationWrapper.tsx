'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { postKakaoLogin } from '@/lib/api/auth';
import Header from '@/components/layout/Header';
import UserInformationForm from '@components/onboarding/information/UserInformationForm';
import toast from 'react-hot-toast';

export default function OnboardingInformationWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const [isNewUser, setIsNewUser] = useState(false);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!code || !state || hasRequested.current) return;

    hasRequested.current = true;

    const handleLogin = async () => {
      try {
        const response = await postKakaoLogin({ code, state });
        if (response) {
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('hasLoggedIn', 'true');
        }

        if (response.code === 'USER_NOT_REGISTERED') {
          sessionStorage.setItem('providerId', response.data.providerId);
          setProviderId(response.data.providerId);
          setIsNewUser(true);
          return;
        } else if (response.code === 'USER_ALREADY_REGISTERED') {
          localStorage.setItem('accessToken', response.data.accessToken);
          router.replace('/home');
          return;
        } else if (response.code === 'USER_INTERESTS_NOT_SELECTED') {
          localStorage.setItem('accessToken', response.data.accessToken);
          router.replace('/onboarding/interests');
        } else if (response.code === 'OAUTH_STATE_INVALID') {
          toast.error('잘못된 접근입니다.');
          router.replace('/not-found');
        } else if (response.code === 'RATE_LIMIT') {
          toast.error('로그인 요청 제한에 걸렸습니다. 잠시 후 다시 시도해주세요.');
          router.replace('/login');
        } else {
          toast.error('알 수 없는 오류가 발생했습니다.');
          router.replace('/not-found');
        }
      } catch (error) {
        console.error('postKakaoLogin 오류:', error);
        toast.error('로그인 처리 중 문제가 발생했습니다.');
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    handleLogin();
  }, [code, state, router]);

  if (loading) return null;

  return (
    <>
      {isNewUser && providerId && (
        <div className="flex h-screen flex-1 flex-col">
          <Header title="개인정보 입력" showBackButton={true} showNotificationButton={false} />
          <main className="flex-grow overflow-y-auto p-4">
            <UserInformationForm providerId={providerId} />
          </main>
        </div>
      )}
    </>
  );
}
