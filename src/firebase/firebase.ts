import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDs2z0HIOOrPDHTWLkKWIargmrhub1ObIA",
  authDomain: "quizmagister.firebaseapp.com",
  projectId: "quizmagister",
  storageBucket: "quizmagister.appspot.com",
  messagingSenderId: "793936707427",
  appId: "1:793936707427:web:bd86e58659f89d31951d56",
  measurementId: "G-T6PVR8FVEZ"
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({ experimentalForceLongPolling: true });
}

export { firebase }