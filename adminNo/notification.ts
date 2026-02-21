import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAu6ESeXPKxgjh7MjgYlXE-b-ZJIaY9Z2E',
  authDomain: 'andamanhum.firebaseapp.com',
  projectId: 'andamanhum',
  storageBucket: 'andamanhum.firebasestorage.app',
  messagingSenderId: '608897477479',
  appId: '1:608897477479:web:657919cc56d814d9261dc2',
  measurementId: 'G-4DJKGSWLZ6',
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Register service worker
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
      );

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey:
          'BJ9w5npvxRiNir4CjxB8KGyD9d-ICMPJZwYoJK51Nij-rmzKl_AaHziMZ-nroFvvPOo4mJkySpCnYRzW37dHQjc',
        serviceWorkerRegistration: registration,
      });

      return token;
    } else {
      console.warn('Notification permission denied');
    }
  } catch (error) {
    console.error('Error getting permission', error);
  }
};

export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    new Notification(payload.notification?.title || 'New Message', {
      body: payload.notification?.body,
      icon: '/firebase-logo.png',
    });
  });
};
