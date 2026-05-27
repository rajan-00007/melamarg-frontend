/**
 * firebase.ts
 * Firebase Cloud Messaging initialization for MelaMarg (Web Platform).
 * STRICTLY uses environment variables for configuration.
 */

import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Firebase config strictly read from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase App
export function getFirebaseApp() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
    throw new Error(
      "[Push] Firebase configuration environment variables are missing! " +
      "Make sure NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID, and NEXT_PUBLIC_FIREBASE_APP_ID are set in your .env file."
    );
  }
  return getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
}

/**
 * Fetch a valid FCM Web Push token for the browser.
 */
export async function getWebFcmToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("[Push] Web Push notifications are not supported in this browser.");
      return null;
    }

    if (Notification.permission === "default") {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("[Push] Web notification permission denied.");
          return null;
        }
      } catch (err) {
        console.error("[Push] Error requesting notification permission:", err);
        return null;
      }
    }

    if (Notification.permission !== "granted") {
      console.warn("[Push] Web notification permission was not granted.");
      return null;
    }

    const app = getFirebaseApp();
    const messaging = getMessaging(app);

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("[Push] NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing in your .env file!");
      return null;
    }

    const fcmToken = await getToken(messaging, { vapidKey });
    return fcmToken || null;
  } catch (err) {
    console.error("[Push] Failed to fetch FCM Web Token:", err);
    return null;
  }
}
