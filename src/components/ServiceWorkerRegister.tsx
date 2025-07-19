'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('✅ Service Worker 등록 성공: ', registration.scope);
        })
        .catch((error) => {
          console.error('❌ Service Worker 등록 실패: ', error);
        });
    }
  }, []);

  return null;
}
