import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDd7RkOx-DN8Op7rU2NRpnaR3tghTr1Ec8",
    authDomain: "imessage-clone-54a5a.firebaseapp.com",
    projectId: "imessage-clone-54a5a",
    storageBucket: "imessage-clone-54a5a.appspot.com",
    messagingSenderId: "662929065374",
    appId: "1:662929065374:web:edec7a6203bc96d36c428f"
};

const firebaseApp=firebase.initializeApp(firebaseConfig);

const db=firebaseApp.firestore();
export const auth=firebase.auth();
export const provider=new firebase.auth.GoogleAuthProvider();

export default db;

