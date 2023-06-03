// Code assisted by WebDevSimplied
import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateEmail as updateEmailFirebase,
  updatePassword as updatePasswordFirebase,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = React.createContext();

// Enables user to use everything in context
export function useAuth() {
  return useContext(AuthContext);
}

// Enables user to use everything in context in a class component
export function useAuthInClass() {
  return AuthContext;
}

// Renders its children
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function emailVerification(currentUser) {
    console.log(currentUser);
    return sendEmailVerification(currentUser);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateEmail(email) {
    return updateEmailFirebase(auth, currentUser, email);
  }

  function updatePassword(newPassword) {
    return updatePasswordFirebase(currentUser, newPassword);
  }

  function updateUserProfile(user, newProfile) {
    console.log('currentUser in AuthContext', user);
    return updateProfile(user, newProfile)
      .then(() => console.log('profile updated'))
      .catch(error => console.error(error));
  }

  // componentDidMount -> things only happen once when the component is mounted
  // Whenever we unmount the component it will unsubscribe because onAuthStateChanged() returns a method
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // lets Firebase verify if there is a currentUser first
    })

    return unsubscribe;
  }, []);
  
  // Everything in this value obj can be used in other components
  const value = {
    currentUser,
    signup,
    emailVerification,
    login,
    logout,
    resetPassword,
    updateEmail,
    updateUserProfile,
    updatePassword
  }

  return (
    // If there is a currentUser, then render the children components.
    // All the children get everything in the context
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
