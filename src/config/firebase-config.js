// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword  } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKyrvvBilo6fD0YfwL0hCLP_cPPD9BHM4",
  authDomain: "fyp2-app-525c3.firebaseapp.com",
  projectId: "fyp2-app-525c3",
  storageBucket: "fyp2-app-525c3.appspot.com",
  messagingSenderId: "576650069717",
  appId: "1:576650069717:web:27a5149aeb583fc980445c"
};

// Initialize Firebase
export default firebaseConfig;
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);


export { auth, signInWithEmailAndPassword, signOut,db, storage, createUserWithEmailAndPassword }