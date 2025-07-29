'use client';

import { useEffect } from 'react';
import { getMessagingInstance, getFirebaseToken, getVapidKey } from '@/lib/firebase';
import { postWebpushSubscribe } from '@/lib/api/user';

export const useRegisterPushToken = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    const registerPush = async () => {
      const messaging = await getMessagingInstance();
      if (!messaging) {
        console.warn('Firebase Messaging is not available');
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      try {
        const vapidKey = getVapidKey();
        if (!vapidKey) {
          console.error('VAPID key is not configured');
          return;
        }

        const fcmToken = await getFirebaseToken(messaging, { vapidKey });

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
