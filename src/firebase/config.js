import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_zKYRQN7MtNhVr-S_3l1lPi0TpzGRfMw",
  authDomain: "sai-project-3c364.firebaseapp.com",
  projectId: "sai-project-3c364",
  storageBucket: "sai-project-3c364.firebasestorage.app",
  messagingSenderId: "730539847180",
  appId: "1:730539847180:web:414037964280ea1a93c829",
  measurementId: "G-H1GYFC2WHB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
