// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCBJjfJM9GdahiZK4sS5XLwHVy3ro8X4gk",
  authDomain: "todolist-ca56c.firebaseapp.com",
  projectId: "todolist-ca56c",
  storageBucket: "todolist-ca56c.firebasestorage.app",
  messagingSenderId: "367089668581",
  appId: "1:367089668581:web:95143eccb9fa995796df0c",
  measurementId: "G-SWLJBXE56R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
