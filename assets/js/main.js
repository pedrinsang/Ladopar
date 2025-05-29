// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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