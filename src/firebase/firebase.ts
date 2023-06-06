import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRJ_2v3mjn7wEuIZWe4Qf1ANC_2kOVqHg",
  authDomain: "quizem-5d2d8.firebaseapp.com",
  projectId: "quizem-5d2d8",
  storageBucket: "quizem-5d2d8.appspot.com",
  messagingSenderId: "151750302624",
  appId: "1:151750302624:web:12bc2bbe13780f2906e2c5",
  measurementId: "G-B5076ZYPZ9"
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({ experimentalForceLongPolling: true });
}

export { firebase }