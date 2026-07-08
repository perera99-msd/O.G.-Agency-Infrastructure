// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// Firebase web config is not a secret — safe to keep as-is.
// Values pulled from teammate's Firebase Console web app registration.
const firebaseConfig = {
  apiKey: "AIzaSyBWj1w1LA3COVtn3jDUWo9wnd6gREAV46s",
  authDomain: "ogagency-5cc6a.firebaseapp.com",
  projectId: "ogagency-5cc6a",
  storageBucket: "ogagency-5cc6a.firebasestorage.app",
  messagingSenderId: "285505453873",
  appId: "1:285505453873:web:e386d51cd9f29bd266ba10",
  measurementId: "G-V63ZLKY8QE",
};

// Prevent re-initializing on Next.js hot reload
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);

// Analytics only works in the browser, and only if supported (e.g. not in SSR)
let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

export { app, auth, analytics };
