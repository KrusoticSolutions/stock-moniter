// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcIt7tuMd0OnqamftBUU6eEZkUKIWZlIw",
  authDomain: "test-project-147d0.firebaseapp.com",
  projectId: "test-project-147d0",
  storageBucket: "test-project-147d0.firebasestorage.app",
  messagingSenderId: "700169776593",
  appId: "1:700169776593:web:5452bf8b4079cafbe5c4f0",
  measurementId: "G-V6JD6GXM4J",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export default firebaseAuth;
