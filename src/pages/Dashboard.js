import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import axios from 'axios';
import Sidebar from '../components/Sidebar/Sidebar';
import DisplayPosts from '../components/DisplayPosts/DisplayPosts';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [imgPosts, setImgPosts] = useState([]);
  const [error, setError] = useState('');
  const { users, currentUser } = useAuth();

  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Fetches all posts from Firestore database
  useEffect(() => {
    const q = query(collection(db, 'files'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setImgPosts(snapshot.docs.map((doc) => formatDoc(doc)).reverse());
    })
    return unsubscribe;
  }, [currentUser]);

  // Fetches all text posts from MongoDB
  const fetchAllPosts = () => {
    let requestURL = `${process.env.REACT_APP_SERVER}/posts`;
    axios.get(requestURL)
      .then(response => {
        setError('');
        setPosts(response.data.reverse());
      })
      .catch(err => {
        setError('Could not load posts');
        console.error(err);
      });
  }

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
    <div className='dashboard text-center row'>
      {error && <Alert>{error}</Alert>}
      <Sidebar />
      {users.length > 0 &&
        <DisplayPosts posts={posts} users={users} setPosts={setPosts} imgPosts={imgPosts} setImgPosts={setImgPosts} />
      }
    </div>
  )
}

export default Dashboard;
