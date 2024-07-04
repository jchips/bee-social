import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import DisplayPosts from '../components/DisplayPosts/DisplayPosts';

const Dashboard = (props) => {
  const [posts, setPosts] = useState([]);
  const [textPosts, setTextPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { users, currentUser } = useAuth();
  const { setGridView, setStackedView, showStackBtn, postWidth, postMargin, rowConfig } = props;

  useEffect(() => {
    fetchAllTextPosts();
  }, []);

  // Fetches all posts from Firestore database
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'files'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => formatDoc(doc)).reverse());
      setIsLoading(false);
    })
    return unsubscribe;
  }, [currentUser]);

  // Fetches all old text posts from MongoDB
  const fetchAllTextPosts = () => {
    let requestURL = `${process.env.REACT_APP_SERVER}/posts`;
    axios.get(requestURL)
      .then(response => {
        setError('');
        setTextPosts(response.data.reverse());
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
    <div className='dashboard text-center'>
      <Header
        setGridView={setGridView}
        setStackedView={setStackedView}
        showStackBtn={showStackBtn}
        setError={setError}
        users={users}
      />
      <Sidebar />
      {!isLoading && <div className='main-content'>
        {error && <Alert>{error}</Alert>}
        {users.length > 0 &&
          <DisplayPosts
            posts={posts}
            users={users}
            setTextPosts={setTextPosts}
            textPosts={textPosts}
            setPosts={setPosts}
            rowConfig={rowConfig}
            postWidth={postWidth}
            postMargin={postMargin}
          />
        }
      </div>}
    </div>
  )
}

export default Dashboard;
