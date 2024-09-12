import { initializeApp } from "@firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyBTdr8CLXqeUAP0ydSc1rDQpd4i-d0iDoU",
  authDomain: "cs278-d092d.firebaseapp.com",
  projectId: "cs278-d092d",
  storageBucket: "cs278-d092d.appspot.com",
  messagingSenderId: "871863309526",
  appId: "1:871863309526:web:e3eb167f64529903a9e577",
  measurementId: "G-3RZGGV0WMX",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
