// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// ✅ Use environment variables for security and flexibility
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
};

// ✅ Prevent re-initialization during hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// ✅ Export auth instance (used for login/register/logout)
export const auth = getAuth(app)

// ✅ (Optional) analytics only on the client
export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const { getAnalytics, isSupported } = await import("firebase/analytics")
    if (await isSupported()) {
      return getAnalytics(app)
    }
  }
  return null
}

export default app