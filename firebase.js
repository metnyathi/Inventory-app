// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYA1gkD24h4AHvprXK95Y3tvC7AwsVdLw",
  authDomain: "pantrytracker-97712.firebaseapp.com",
  projectId: "pantrytracker-97712",
  storageBucket: "pantrytracker-97712.appspot.com",
  messagingSenderId: "608943234252",
  appId: "1:608943234252:web:3fb4e2501dc4ad19ce3669"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {firestore}
export {app, firebaseConfig}