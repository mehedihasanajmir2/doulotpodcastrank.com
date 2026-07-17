import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const projectId = (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "podcast-ranking-hub";

const firebaseConfig = {
  projectId,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || "1:726780280943:web:5e9b71da96a05a52c8cd9a",
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "AIzaSyBfPHVHFwqKvGMWWKjG7YVsmYSyLRCQX7Y",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "podcast-ranking-hub.firebaseapp.com",
  firestoreDatabaseId: (import.meta as any).env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || (projectId === "podcast-ranking-hub" ? "" : "ai-studio-doulotali-3645692c-26a0-4df1-a411-4549148162cc"),
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "podcast-ranking-hub.firebasestorage.app",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "726780280943",
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if provided, otherwise default
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export default app;
