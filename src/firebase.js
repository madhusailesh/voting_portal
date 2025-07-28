
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAExXjHvl43wQhCwozYLSd0WxUx-aR-afk",
  authDomain: "ideapeachingportal.firebaseapp.com",
  projectId: "ideapeachingportal",
  storageBucket: "ideapeachingportal.firebasestorage.app",
  messagingSenderId: "617450334640",
  appId: "1:617450334640:web:1f58b4d24264a249d84e75",
  measurementId: "G-7X6YBEXW27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app)
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };