import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, deleteObject, listAll } from 'firebase/storage';
import { db } from '../firebase';
import axios from 'axios';

/**
 * Deletes all the current user's posts from Firestore, Storage, and MongoDB.
 * @param {String} userId - The current user's uid.
 */
async function deleteUserData(userId) {
  const q = query(collection(db, 'files'), where('userID', '==', userId));
  const storage = getStorage();
  const listRef = ref(storage, `files/${userId}`);

  // Deletes Firestore database documents
  try {
    if (q) {
      const querySnapshot = await getDocs(q);
      const deleteDocs = [];
      querySnapshot.forEach((document) => {
        const documentRef = doc(db, 'files', document.id);
        deleteDocs.push(deleteDoc(documentRef));
      });
      await Promise.all(deleteDocs);
      console.log('Post(s) deleted from firestore successfully'); // delete later
    }
  } catch (error) {
    console.error(error);
  }

  // Deletes Firebase Storage objects
  if (listRef) {
    listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          deleteObject(itemRef).then(() => {
            console.log('File deleted successfully');
          }).catch((error) => {
            console.error(error);
          });
        });
      }).catch((error) => {
        console.error(error);
      });
  }

  // Deletes MongoDB posts (only for original users)
  try {
    let mongoPosts = await fetchAllMongoPosts(userId);
    console.log('mongoPosts:', mongoPosts); // delete later
    if (mongoPosts.length > 0) {
      deleteMongoUserPosts(userId);
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Fetches all current user's posts from MongoDB (only for original users).
 * @param {String} userId - The current user's uid.
 * @returns - Array with all currentUser's posts that are stored in MongoDB.
 */
const fetchAllMongoPosts = (userId) => {
  let requestURL = `${process.env.REACT_APP_SERVER}/posts?uid=${userId}`;
  let mongoPosts = axios.get(requestURL)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error(error);
    });
  return mongoPosts;
}

/**
 * Deletes all the current user's posts stored in MongoDB.
 * @param {String} userId - The current user's uid.
 */
const deleteMongoUserPosts = (userId) => {
  let requestURL = `${process.env.REACT_APP_SERVER}/posts/delete-all/${userId}`;
  axios.delete(requestURL)
    .then(() => console.log('deleted posts from mongo'))
    .catch(error => console.log(error));
}

export default deleteUserData;