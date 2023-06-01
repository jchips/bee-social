import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtjqcuD7Ru_bPkH2xVi4RcItro4RD9puY",
  authDomain: "auth-practice-dab55.firebaseapp.com",
  projectId: "auth-practice-dab55",
  storageBucket: "auth-practice-dab55.appspot.com",
  messagingSenderId: "403601643794",
  appId: "1:403601643794:web:ac17d71a58ab4604177bcb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = app.auth();
const auth = getAuth(app);

export {app as default, auth};