import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAb1BkYkB18IgI7iBAARA4nd9cPi0cXaCU",
  authDomain: "rental-app-3f9e0.firebaseapp.com",
  projectId: "rental-app-3f9e0",
  storageBucket: "rental-app-3f9e0.firebasestorage.app",
  messagingSenderId: "263203922915",
  appId: "1:263203922915:web:be1aff88884162a96336d6",
  measurementId: "G-E6BSBCDWJK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 