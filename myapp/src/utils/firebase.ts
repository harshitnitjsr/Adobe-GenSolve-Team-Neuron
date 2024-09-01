import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC4srQhszr7FoCQss5o1rdDj2-_dlvMuVY",
  authDomain: "adobe-gensolve-26.firebaseapp.com",
  databaseURL:
    "https://adobe-gensolve-26-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "adobe-gensolve-26",
  storageBucket: "adobe-gensolve-26.appspot.com",
  messagingSenderId: "395033061315",
  appId: "1:395033061315:web:a76f0ddd4e0fc0d1e5bf76",
  measurementId: "G-9Z2SNVXSMH",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
