// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-state-dream-house.firebaseapp.com",
  projectId: "real-state-dream-house",
  storageBucket: "real-state-dream-house.appspot.com",
  messagingSenderId: "679105477290",
  appId: "1:679105477290:web:4d6f8782f8ad3712336ed3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);