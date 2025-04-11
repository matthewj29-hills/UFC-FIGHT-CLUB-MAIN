// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpr4j_IDIkFrh6w6uxgiM_wgkiBJ1lI2o",
  authDomain: "ufc-fight-club.firebaseapp.com",
  projectId: "ufc-fight-club",
  storageBucket: "ufc-fight-club.appspot.com",
  messagingSenderId: "642703500874",
  appId: "1:642703500874:web:7f23723ddf04369e48a8b3",
  measurementId: "G-VBBME59YSX"
};

// Initialize Firebase with a unique name for this project
const FIREBASE_APP_NAME = 'UFC-FIGHT-CLUB';

let firebaseApp: FirebaseApp;
try {
  firebaseApp = getApp(FIREBASE_APP_NAME);
} catch {
  firebaseApp = initializeApp(firebaseConfig, FIREBASE_APP_NAME);
}

// Initialize Firebase Authentication
export const auth = getAuth(firebaseApp);

// Initialize Cloud Firestore
export const db = getFirestore(firebaseApp);

export default firebaseApp; 