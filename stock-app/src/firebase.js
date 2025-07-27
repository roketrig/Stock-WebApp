// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA0drmfnESdAHIXSWacwWP55EBDuFtjCdo",
  authDomain: "hugs-dondurma.firebaseapp.com",
  projectId: "hugs-dondurma",
  storageBucket: "hugs-dondurma.firebasestorage.app",
  messagingSenderId: "1043273333348",
  appId: "1:1043273333348:web:8e45207e640e1413f33d71"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig)

// Firestore veritabanını al
export const db = getFirestore(app)
