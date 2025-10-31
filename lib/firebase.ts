// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// ✅ Use environment variables for security and flexibility
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// }

const firebaseConfig = {
  apiKey: "****REDACTED****",
  authDomain: "syntaxsaga-7a308.firebaseapp.com",
  projectId: "syntaxsaga-7a308",
  storageBucket: "syntaxsaga-7a308.firebasestorage.app",
  messagingSenderId: "990882446237",
  appId: "1:990882446237:web:428835bb9323b8763f0d74",
  measurementId: "G-KEXVZQ4SVR"
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