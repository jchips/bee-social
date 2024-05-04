import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import AddPostButton from '../components/DisplayPosts/AddPostButton';
import DisplayPosts from '../components/DisplayPosts/DisplayPosts';

const Dashboard = (props) => {
  const [posts, setPosts] = useState([]);
  const [textPosts, setTextPosts] = useState([]);
  const [error, setError] = useState('');
  const { users, currentUser } = useAuth();
  // const [postWidth, setPostWidth] = useState('17rem');
  // const [postMargin, setPostMargin] = useState('5px 3px');
  // const [rowConfig, setRowConfig] = useState('auto');
  const { setGridView, setStackedView, postWidth, postMargin, rowConfig } = props;

  useEffect(() => {
    fetchAllTextPosts();
  }, []);

  // Fetches all posts from Firestore database
  useEffect(() => {
    const q = query(collection(db, 'files'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => formatDoc(doc)).reverse());
    })
    return unsubscribe;
  }, [currentUser]);

  // Fetches all text posts from MongoDB
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

  // // Sets the page view so that the posts are displayed in stacks
  // const setStackedView = () => {
  //   setPostWidth('30rem');
  //   setRowConfig(1);
  //   setPostMargin('5px auto');
  // }

  // // Sets the page view so that posts are displayed in a grid
  // const setGridView = () => {
  //   setPostWidth('17rem');
  //   setRowConfig('auto');
  //   setPostMargin('5px 3px');
  // }

  return (
    <div className='dashboard text-center row'>
      {error && <Alert>{error}</Alert>}
      <Sidebar />
      <div className='col-sm-10 col-12'>
        <Header setGridView={setGridView} setStackedView={setStackedView} />
        {(users) && (
          <div className='text-center add-button-container'>
            <AddPostButton setError={setError} />
          </div>
        )}
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
      </div>
    </div>
  )
}

export default Dashboard;
