// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBAtSiOQapf7SaTc9nvimNA8oZ_E9Rm7Q",
  authDomain: "virtual-study-buddy-9b44c.firebaseapp.com",
  projectId: "virtual-study-buddy-9b44c",
  storageBucket: "virtual-study-buddy-9b44c.appspot.com",
  messagingSenderId: "382373604978",
  appId: "1:382373604978:web:f071cfd3ea7eea9d769ceb"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;
