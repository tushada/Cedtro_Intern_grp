import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyACoD3KdTEabrL4tv5k-KBRldeEhg5Mzzg",
  authDomain: "smart-home-ceb64.firebaseapp.com",
  projectId: "smart-home-ceb64",
  storageBucket: "smart-home-ceb64.firebasestorage.app",
  messagingSenderId: "525840124631",
  appId: "1:525840124631:web:a74e510fcd56b4aad93e92",
  measurementId: "G-4H83KJ1TXM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;
