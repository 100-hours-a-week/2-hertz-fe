'use client';

import { useEffect } from 'react';
import { messaging, getToken } from '@/lib/firebase';
import { postWebpushSubscribe } from '@/lib/api/user';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;

export const useRegisterPushToken = () => {
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    const registerPush = async () => {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      try {
        const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });

        if (fcmToken) {
          await postWebpushSubscribe(fcmToken);
          console.log('✅ FCM token 등록 완료');
        }
      } catch (err) {
        console.error('❌ FCM token 등록 실패:', err);
      }
    };

    registerPush();
  }, []);
};
