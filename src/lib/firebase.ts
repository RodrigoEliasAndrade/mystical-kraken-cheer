import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC034nd6mDpq8wAK_snVHg6nnbTvWSzNws",
  authDomain: "equipes-nossa-senhora.firebaseapp.com",
  projectId: "equipes-nossa-senhora",
  storageBucket: "equipes-nossa-senhora.firebasestorage.app",
  messagingSenderId: "814719609165",
  appId: "1:814719609165:web:c5776b1b28c43fe1b86f04"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);