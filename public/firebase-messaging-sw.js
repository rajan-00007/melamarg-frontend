importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

// Firebase configuration for melamarg-5454f
firebase.initializeApp({
  apiKey: "AIzaSyD4cWY_C0V7Zq3BQPl6Gp3KI16Msep_IWY",
  authDomain: "melamarg-5454f.firebaseapp.com",
  projectId: "melamarg-5454f",
  storageBucket: "melamarg-5454f.firebasestorage.app",
  messagingSenderId: "63141160868",
  appId: "1:63141160868:web:26a8c5e3689741bf1c0331"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  const title = payload.notification?.title || payload.data?.title || "MelaMarg Broadcast";
  const body = payload.notification?.body || payload.data?.message || payload.data?.body || "";

  if (body) {
    self.registration.showNotification(title, {
      body: body,
      icon: "/icons/icon-192x192.png", // PWA icon path
      data: payload.data
    });
  }
});
