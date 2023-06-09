import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,

  authDomain: import.meta.env.VITE_FIREBASE_KEY_DOMAIN,

  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,

  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

  messagingSenderId: import.meta.env.VITE_FIREBASE_KEY_SENDER_ID,

  appId: import.meta.env.VITE_MESSAGING_APP_ID,
};

firebase.initializeApp(firebaseConfig);

export default firebase;
