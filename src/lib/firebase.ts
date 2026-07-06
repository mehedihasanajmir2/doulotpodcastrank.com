import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "doulot-ali-gettop-growth",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || "1:939959660821:web:2e48b101bfca7164ab391c",
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "AIzaSyAQ2SLV5Q30PdZL14kwbbnuizBie3b5mwM",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "doulot-ali-gettop-growth.firebaseapp.com",
  firestoreDatabaseId: (import.meta as any).env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "ai-studio-doulotali-3645692c-26a0-4df1-a411-4549148162cc",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "doulot-ali-gettop-growth.firebasestorage.app",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "939959660821",
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if provided, otherwise default
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export default app;
