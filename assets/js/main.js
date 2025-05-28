// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCac6MzHKA0C4UdfDAgEP7tEOyHmq1XIRU",
  authDomain: "ladopar-a1cc2.firebaseapp.com",
  projectId: "ladopar-a1cc2",
  storageBucket: "ladopar-a1cc2.firebasestorage.app",
  messagingSenderId: "1049911140994",
  appId: "1:1049911140994:web:3bc1faf0aec109188b4a9b",
  measurementId: "G-YVNCQQMR7Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other modules
export { app, analytics, auth, db };