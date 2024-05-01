import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import Sidebar from '../../components/Sidebar/Sidebar';
import DisplayPosts from '../../components/DisplayPosts/DisplayPosts';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [imgPosts, setImgPosts] = useState([]);
  const [error, setError] = useState('');

  // Fetches all the posts of whomever's profile was clicked on
  const getPosts = useCallback(async () => {
    if (user.uid) {
      let requestURL = `${process.env.REACT_APP_SERVER}/posts?uid=${user.uid}`;
      try {
        let response = await axios.get(requestURL);
        setError('');
        setPosts(response.data.reverse());
        const q = query(collection(db, 'files'), where('userID', '==', user.uid), orderBy('createdAt'));
        const querySnapshot = await getDocs(q);
        setImgPosts(querySnapshot.docs.map((doc) => formatDoc(doc)).reverse());
      } catch (err) {
        console.error(err);
        setError('Could not fetch posts');
      }
    }
  }, [user.uid]);

  useEffect(() => {
    // Fetches the user of whoever's profile was clicked on
    const findUserById = () => {
      let requestURL = `${process.env.REACT_APP_SERVER}/users/${userId}`;
      axios.get(requestURL)
        .then(response => {
          setError('');
          setUser(response.data);
          getPosts();
        })
        .catch(err => {
          console.error(err);
          setError('Could not load user');
        });
    }
    findUserById();
  }, [userId, getPosts]);

  /**
   * Formats the document object
   * @param {Object} doc - The document in the collection
   * @returns {Object} - Formatted object
   */
  const formatDoc = (doc) => {
    let formattedDoc = {
      id: doc.id,
      ...doc.data()
    }
    return formattedDoc;
  }

  return (
    <div className='user-profile dashboard text-center row'>
      {error && <Alert>{error}</Alert>}
      <Sidebar />
      {(posts.length > 0 || imgPosts.length > 0) && (user.uid) && (
        <DisplayPosts posts={posts} user={user} setPosts={setPosts} imgPosts={imgPosts} />
      )}
    </div>
  );
}

export default UserProfile;
