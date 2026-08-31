import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

import importedConfig from '../firebase-applet-config.json';

// Easy-to-update Firebase Configuration Object
export const firebaseConfig = {
  apiKey: importedConfig.apiKey || "YOUR_API_KEY",
  authDomain: importedConfig.authDomain || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: importedConfig.projectId || "YOUR_PROJECT_ID",
  storageBucket: importedConfig.storageBucket || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: importedConfig.messagingSenderId || "YOUR_MESSAGING_SENDER_ID",
  appId: importedConfig.appId || "YOUR_APP_ID",
  firestoreDatabaseId: importedConfig.firestoreDatabaseId || ""
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Cloud Firestore (support custom databaseId if configured)
export const db = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' && firebaseConfig.firestoreDatabaseId !== '')
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
};


