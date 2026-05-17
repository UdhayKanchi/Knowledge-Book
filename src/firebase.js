import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvyMFtg-yMZdbZTYW-cxOF5p8DbN2F4Jo",
  authDomain: "knowledge-book-1d19e.firebaseapp.com",
  projectId: "knowledge-book-1d19e",
  storageBucket: "knowledge-book-1d19e.firebasestorage.app",
  messagingSenderId: "141969152479",
  appId: "1:141969152479:web:21cff15ee591a121f84c6a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
storage.maxUploadRetryTime = 8000;
storage.maxOperationRetryTime = 8000;
export const ADMIN_EMAIL = "knowledgebook@admin.in";
