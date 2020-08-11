import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAOaraRH0c4ryzlTqSM34p4A6El5vwpx70",
    authDomain: "instagram-clone-reactjs-97d39.firebaseapp.com",
    databaseURL: "https://instagram-clone-reactjs-97d39.firebaseio.com",
    projectId: "instagram-clone-reactjs-97d39",
    storageBucket: "instagram-clone-reactjs-97d39.appspot.com",
    messagingSenderId: "392608813401",
    appId: "1:392608813401:web:41adc0eed45124a5473c48",
    measurementId: "G-NLGN4MV3DN"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
