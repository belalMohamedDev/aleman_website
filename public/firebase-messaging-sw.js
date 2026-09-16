/* eslint-disable no-undef */
// Scripts for firebase messaging in service worker
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Initialize Firebase App in service worker
firebase.initializeApp({
  apiKey: 'AIzaSyByI3SXGc1pUpmrddlhPMVGhk8w0TIIELE',
  authDomain: 'aleman-13b67.firebaseapp.com',
  projectId: 'aleman-13b67',
  storageBucket: 'aleman-13b67.firebasestorage.app',
  messagingSenderId: '114086254897',
  appId: '1:114086254897:web:61bf30de7be52d5196f810',
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);

  const notificationTitle = payload.notification?.title || 'مؤسسة الإيمان للأعلاف';
  const notificationOptions = {
    body: payload.notification?.body || 'لديك إشعار جديد بخصوص طلبك',
    icon: '/logo.png',
    badge: '/logo.png',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click to open or focus app window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window open
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // If not open, open a new window to profile
      if (clients.openWindow) {
        return clients.openWindow('/profile');
      }
    })
  );
});
