'use client';

import {
  getMessagingInstance,
  getFirebaseToken,
  isFirebaseSupported,
  getVapidKey,
} from '@/lib/firebase';
import { postWebpushSubscribe } from '@/lib/api/user';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ClickWebPushBanner() {
  const handleClick = async () => {
    if (typeof window === 'undefined') {
      toast.error('서버에서는 이용할 수 없습니다.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    const isSupportedBrowser = await isFirebaseSupported();
    if (!isSupportedBrowser) {
      toast.error('현재 브라우저는 웹 푸시를 지원하지 않습니다.');
      return;
    }

    if (Notification.permission === 'denied') {
      toast('알림 권한이 차단되어 있어요.\n브라우저 설정에서 알림을 허용해주세요.', {
        id: 'webpush-blocked',
      });
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      toast.error('알림 권한이 거부되었습니다.');
      return;
    }

    try {
      const messaging = await getMessagingInstance();
      if (!messaging) {
        toast.error('Firebase Messaging을 초기화할 수 없습니다.');
        return;
      }

      const vapidKey = getVapidKey();
      if (!vapidKey) {
        toast.error('VAPID 키가 설정되지 않았습니다.');
        return;
      }

      const fcmToken = await getFirebaseToken(messaging, { vapidKey });
      if (fcmToken) {
        await postWebpushSubscribe(fcmToken);
        console.log('✅ FCM token 등록 완료');
        toast.success('웹 푸시 등록이 완료되었습니다!', { id: 'webpush-subscribe' });
      }
    } catch (err) {
      console.error('❌ 웹 푸시 등록 실패:', err);
      toast.error('웹 푸시 등록에 실패했습니다.', { id: 'webpush-subscribe' });
    }
  };
  return (
    <div
      className="flex cursor-pointer items-center gap-2 rounded-md bg-[var(--gray-100)] p-4 px-8 text-sm font-medium text-[var(--gray-400)]"
      onClick={handleClick}
    >
      <Image src="/images/bell.png" alt="bell-icon" width={16} height={18} />
      <p> 웹 푸시 알림을 받고 싶다면 여기를 클릭하세요</p>
    </div>
  );
}
