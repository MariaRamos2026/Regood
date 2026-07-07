import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiVxOZxcrCEIO-AYWcXpPSAGTZNXRpGn0",
  authDomain: "regood-1c824.firebaseapp.com",
  projectId: "regood-1c824",
  storageBucket: "regood-1c824.firebasestorage.app",
  messagingSenderId: "895316894578",
  appId: "1:895316894578:web:e96626fc5a5ee70a74f3eb"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);