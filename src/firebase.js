import firebase from "firebase";
const config = {
  apiKey: "AIzaSyA5CVEpFnlsxXJ6ehtAr8JjwWVfvL8cCmw",
  authDomain: "secret-santa-add50",
  databaseURL: "https://secret-santa-add50.firebaseio.com/"
};
firebase.initializeApp(config);
export const auth = firebase.auth;

export const db = firebase.database();