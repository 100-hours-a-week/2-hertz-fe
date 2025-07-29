import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const getMessagingInstance = async () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const { getMessaging } = await import('firebase/messaging');
    return getMessaging(app);
  } catch (error) {
    console.error('Failed to initialize Firebase Messaging:', error);
    return null;
  }
};

export const getFirebaseToken = async (
  messaging: NonNullable<Awaited<ReturnType<typeof getMessagingInstance>>>,
  options: { vapidKey: string },
) => {
  if (typeof window === 'undefined') {
    throw new Error('getToken can only be called in browser environment');
  }

  const { getToken } = await import('firebase/messaging');
  return getToken(messaging, options);
};

export const onFirebaseMessage = async (
  messaging: NonNullable<Awaited<ReturnType<typeof getMessagingInstance>>>,
  callback: (payload: unknown) => void,
) => {
  if (typeof window === 'undefined') {
    throw new Error('onMessage can only be called in browser environment');
  }

  const { onMessage } = await import('firebase/messaging');
  return onMessage(messaging, callback);
};

export const isFirebaseSupported = async () => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const { isSupported } = await import('firebase/messaging');
    return await isSupported();
  } catch (error) {
    console.error('Failed to check Firebase messaging support:', error);
    return false;
  }
};

export const getVapidKey = () => process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
