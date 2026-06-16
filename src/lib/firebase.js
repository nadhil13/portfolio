// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAg6jR8q_Q7FK58Zq78MxNAUgTAp1kbCAQ",
    authDomain: "portfolio-comments-35ad8.firebaseapp.com",
    projectId: "portfolio-comments-35ad8",
    storageBucket: "portfolio-comments-35ad8.firebasestorage.app",
    messagingSenderId: "189892092974",
    appId: "1:189892092974:web:e9e53f5b49c363aab0ebbf",
    measurementId: "G-F630K5D7L3"
  };  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export default app;