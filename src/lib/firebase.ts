// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Thay thế config này bằng config từ Firebase Console
// 1. Vào https://console.firebase.google.com/
// 2. Tạo project mới hoặc chọn project có sẵn
// 3. Vào Project Settings → General → Your apps
// 4. Add app → Web app → Copy firebaseConfig object
const firebaseConfig = {
  // ⚠️ CẦN THAY ĐỔI: Copy từ Firebase Console
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
  
  // 📝 VÍ DỤ CONFIG THẬT:
  // apiKey: "AIzaSyC9X2Y3Z4...",
  // authDomain: "nhu-tam-todo.firebaseapp.com",
  // projectId: "nhu-tam-todo",
  // storageBucket: "nhu-tam-todo.appspot.com",
  // messagingSenderId: "123456789012",
  // appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
