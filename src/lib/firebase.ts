import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "doulot-ali-gettop-growth",
  appId: "1:939959660821:web:2e48b101bfca7164ab391c",
  apiKey: "AIzaSyAQ2SLV5Q30PdZL14kwbbnuizBie3b5mwM",
  authDomain: "doulot-ali-gettop-growth.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-doulotali-3645692c-26a0-4df1-a411-4549148162cc",
  storageBucket: "doulot-ali-gettop-growth.firebasestorage.app",
  messagingSenderId: "939959660821",
  measurementId: ""
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if provided, otherwise default
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export default app;
