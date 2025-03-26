import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBpr4j_IDIkFrh6w6uxgiM_wgkiBJ1lI2o",
  authDomain: "ufc-fight-club.firebaseapp.com",
  projectId: "ufc-fight-club",
  storageBucket: "ufc-fight-club.firebasestorage.app",
  messagingSenderId: "642703500874",
  appId: "1:642703500874:web:7f23723ddf04369e48a8b3",
  measurementId: "G-VBBME59YSX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 