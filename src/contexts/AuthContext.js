// Code assisted by WebDevSimplied
import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import axios from 'axios';
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
  const [users, setUsers] = useState([]);
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
      .then(() => updateUserInDatabase(user))
      .then(response => console.log('testing', response.data))
      .then(() => console.log('profile updated'))
      .catch(error => console.error(error));
  }

  /**
   * Fetches all users from MongoDB database so that I can find the user
   * who is updating their profile.
   */
  const fetchAllUsers = () => {
    let requestURL = `${process.env.REACT_APP_SERVER}/users`;
    axios.get(requestURL)
      .then(response => {
        // setError('');
        setUsers(response.data);
      })
      .catch(err => {
        // setError('Could not fetch users');
        console.error(err);
      })
  }

  /**
   * Finds user in MongoBD database based on their uid.
   * Updates user information in MongoDB database
   */
  const updateUserInDatabase = (updatedUser) => {
    let mongoUser = users.find(user => user.uid === updatedUser.uid);
    console.log('mongoUser', mongoUser);
    let requestURL = `${process.env.REACT_APP_SERVER}/users/${mongoUser._id}`;
    let updateUser = {
      displayName: updatedUser.displayName,
      photoURL: updatedUser.photoURL
    }
    return axios.patch(requestURL, updateUser)
      .then(response => {
        // setError('')
        let usersCopy = [...users];
        usersCopy.splice(usersCopy.indexOf(mongoUser), 1, response.data);
        setUsers(usersCopy);
        return response;
      })
      .catch(err => {
        // setError('Could not update user');
        console.error(err);
        return err;
      })
  }

  // componentDidMount -> things only happen once when the component is mounted
  // Whenever we unmount the component it will unsubscribe because onAuthStateChanged() returns a method
  useEffect(() => {
    fetchAllUsers();
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
