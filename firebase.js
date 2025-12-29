// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getStorage } from "firebase-storage";
import 'firebase/database'
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDg46tjkpLkKj6zVCsPZ6_lwQMFFTrnnQ",
  authDomain: "oxmetal-49832.firebaseapp.com",
  databaseURL: "https://oxmetal-49832-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "oxmetal-49832",
  storageBucket: "oxmetal-49832.appspot.com",
  messagingSenderId: "129065492158",
  appId: "1:129065492158:web:c360a12dfff8d6a0d988ef",
  measurementId: "G-4HV3KMMCDR"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
export const storage = getStorage(app);




