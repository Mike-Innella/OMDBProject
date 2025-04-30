// (directory path: /src/firebase.js)

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIQkW3u-Aby3c7u4IJkQQS13Ft5QR3afE",
  authDomain: "fesfinal.firebaseapp.com",
  projectId: "fesfinal",
  storageBucket: "fesfinal.firebasestorage.app",
  messagingSenderId: "277720695984",
  appId: "1:277720695984:web:af91f142407134096b2775",
  measurementId: "G-151FLMF70T",
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Export services for app-wide use
export { db, auth, analytics };
export default app;
