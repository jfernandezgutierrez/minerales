import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9LvxKLbxSEab1euJ35uubB6Ihci_Iy_4",
  authDomain: "minerales-c70e6.firebaseapp.com",
  projectId: "minerales-c70e6",
  storageBucket: "minerales-c70e6.firebasestorage.app",
  messagingSenderId: "83656413547",
  appId: "1:83656413547:web:40e0d0cd60afb2f2587c2e",
  measurementId: "G-FXXGVSX2JL"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta servicios para usar en tu app
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };