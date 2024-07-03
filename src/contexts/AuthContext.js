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
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider
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

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  // Whenever component is unmounted it will unsubscribe because onAuthStateChanged() returns a method
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchAllUsers();
      setCurrentUser(user);
      setLoading(false); // lets Firebase verify if there is a currentUser first
    })

    return unsubscribe;
  }, []);

  /**
   * Fetches all users from MongoDB database so that I can find the user
   * who is updating their profile.
   */
  const fetchAllUsers = () => {
    let requestURL = `${process.env.REACT_APP_SERVER}/users`;
    axios.get(requestURL)
      .then(response => {
        setUsers(response.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function emailVerification(currentUser) {
    console.log(currentUser); // delete later
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
    return updateEmailFirebase(currentUser, email);
  }

  function updatePassword(newPassword) {
    return updatePasswordFirebase(currentUser, newPassword);
  }

  function updateUserProfile(user, newProfile) {
    return updateProfile(user, newProfile)
      .then(() => updateUserInDatabase(user))
      .catch(err => console.error(err));
  }

  /**
   * Reauthenticates the user (required for changing password or deleting account).
   * @param {String} password - The password the user enters.
   * @returns - A response string indicating whether reauthentication was successful or not.
   */
  function reauthenticateUser(password) {
    let credential = EmailAuthProvider.credential(currentUser.email, password);
    return reauthenticateWithCredential(currentUser, credential).then(() => {
      console.log('user reauthenticated');
      return 'reauthenticated successfully';
    }).catch((err) => {
      console.error(err);
      return err.message;
    });
  }

  /**
   * Delete's the current user's account from Firebase auth and MongoDB.
   * @param {Object} user - The current user.
   * @returns A function deleting the user from Firebase and MongoDB.
   */
  function deleteUserAccount(user) {
    let mongoUser = users.find(mongoUser => mongoUser.uid === user.uid);

    return deleteUser(user)
      .then(() => {
        let requestURL = `${process.env.REACT_APP_SERVER}/users/${user.uid}`;
        axios.delete(requestURL)
          .then(() => {
            let usersCopy = [...users];
            usersCopy.splice(usersCopy.indexOf(mongoUser), 1);
            setUsers(usersCopy);
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }

  /**
   * Finds user in MongoBD database based on their uid.
   * Updates user information in MongoDB database
   */
  const updateUserInDatabase = (updatedUser) => {
    let mongoUser = users.find(user => user.uid === updatedUser.uid);
    let requestURL = `${process.env.REACT_APP_SERVER}/users/${mongoUser._id}`;
    let updateUser = {
      displayName: updatedUser.displayName,
      photoURL: updatedUser.photoURL
    }
    return axios.patch(requestURL, updateUser)
      .then(response => {
        let usersCopy = [...users];
        usersCopy.splice(usersCopy.indexOf(mongoUser), 1, response.data);
        setUsers(usersCopy);
        return response;
      })
      .catch(err => {
        console.error(err);
        return err;
      })
  }

  // Everything in this value obj can be used in other components
  const value = {
    users,
    currentUser,
    signup,
    emailVerification,
    login,
    logout,
    resetPassword,
    updateEmail,
    updateUserProfile,
    updatePassword,
    reauthenticateUser,
    deleteUserAccount
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
