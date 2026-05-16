// firebase-config.js
// IMPORT FIREBASE MODULES FROM CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// YOUR FIREBASE CONFIGURATION GOES HERE
// Go to Firebase Console -> Project Settings -> Web App to get these values
const firebaseConfig = {
 apiKey: "AIzaSyAvyMFtg-yMZdbZTYW-cxOF5p8DbN2F4Jo",
  authDomain: "knowledge-book-1d19e.firebaseapp.com",
  projectId: "knowledge-book-1d19e",
  storageBucket: "knowledge-book-1d19e.firebasestorage.app",
  messagingSenderId: "141969152479",
  appId: "1:141969152479:web:21cff15ee591a121f84c6a",
  measurementId: "G-SD042YEXLC"
};
// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);

// EXPORT SERVICES TO USE IN OTHER FILES
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
