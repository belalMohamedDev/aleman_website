import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, type Messaging } from 'firebase/messaging';

// Firebase Web configuration from Google Services (Project: aleman-13b67)
export const firebaseConfig = {
  apiKey: 'AIzaSyByI3SXGc1pUpmrddlhPMVGhk8w0TIIELE',
  authDomain: 'aleman-13b67.firebaseapp.com',
  projectId: 'aleman-13b67',
  storageBucket: 'aleman-13b67.firebasestorage.app',
  messagingSenderId: '114086254897',
  appId: '1:114086254897:web:61bf30de7be52d5196f810',
};

// Initialize Firebase App singleton
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let messagingInstance: Messaging | null = null;

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;

  try {
    const supported = await isSupported().catch(() => false);
    if (!supported) {
      return null;
    }

    if (!messagingInstance) {
      messagingInstance = getMessaging(firebaseApp);
    }
    return messagingInstance;
  } catch (err) {
    return null;
  }
}

/**
 * Requests Notification permission and retrieves the FCM Web Token
 */
export async function requestFcmToken(): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return null;
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    // Register or get existing service worker
    let registration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      try {
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      } catch (swErr) {
      }
    }

    const token = await getToken(messaging, {
      serviceWorkerRegistration: registration,
    });

    return token || null;
  } catch (err) {
    return null;
  }
}

/**
 * Listens for incoming push messages while app is in foreground
 */
export async function onForegroundMessage(callback: (payload: any) => void): Promise<(() => void) | null> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  try {
    return onMessage(messaging, (payload) => {
      callback(payload);
    });
  } catch (err) {
    return null;
  }
}
