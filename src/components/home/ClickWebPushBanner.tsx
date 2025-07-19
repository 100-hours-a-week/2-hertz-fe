'use client';

import { messaging, getToken, isSupported } from '@/lib/firebase';
import { postWebpushSubscribe } from '@/lib/api/user';
import toast from 'react-hot-toast';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;

export default function ClickWebPushBanner() {
  const handleClick = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    const isSupportedBrowser = await isSupported();
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
      const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
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
      className="cursor-pointer rounded-md bg-blue-500 p-4 text-white hover:bg-blue-600"
      onClick={handleClick}
    >
      <p>🔔 웹 푸시 알림을 받고 싶다면 여기를 클릭하세요</p>
    </div>
  );
}
