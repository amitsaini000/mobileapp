 import * as firebase from "firebase"; 
 require("firebase/firestore");

const config = {
    apiKey: "AIzaSyBWPuHk-8ZDjwlKsEsKdoSLCwTsV-YAEmw",
    authDomain: "test-8b5fa.firebaseapp.com",
    databaseURL: "https://test-8b5fa.firebaseio.com",
    projectId: "test-8b5fa",
    storageBucket: "test-8b5fa.appspot.com",
    messagingSenderId: "1085496847490",
    persistence:true
  };
   

  const fire = firebase.initializeApp(config);
  const db = fire.firestore();
  const settings = { timestampsInSnapshots: true };
  db.settings(settings);
        
  export {db,fire,firebase};  