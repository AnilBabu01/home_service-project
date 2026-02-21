importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAufdgWPHPxbruibfTAioqcPbQP-M0RSYA",
  authDomain: "andmanhub.firebaseapp.com",
  projectId: "andmanhub",
  storageBucket: "andmanhub.firebasestorage.app",
  messagingSenderId: "739276178108",
  appId: "1:739276178108:web:ab803d35b7adfd9dac06b9",
  measurementId: "G-0RF3KJGWDB"
});




const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
  });
});
