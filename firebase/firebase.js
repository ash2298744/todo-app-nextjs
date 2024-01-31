import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHu8JdIf4lrk0dSjc7fCzsxMYB8AmdTio",
  authDomain: "todo-app-a8323.firebaseapp.com",
  projectId: "todo-app-a8323",
  storageBucket: "todo-app-a8323.appspot.com",
  messagingSenderId: "686545981587",
  appId: "1:686545981587:web:985e3c7cea006aaeebbd66"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);