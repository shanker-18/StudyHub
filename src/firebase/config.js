import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDQYF5db2CUW72vqhTMAttzsFc_SF8aynQ",
  authDomain: "studyhub-95465.firebaseapp.com",
  projectId: "studyhub-95465",
  storageBucket: "studyhub-95465.firebasestorage.app",
  messagingSenderId: "607657480785",
  appId: "1:607657480785:web:85b0dc0e72a7e3a611de70",
  measurementId: "G-DS71JJLWPS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app;
