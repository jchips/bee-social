import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import axios from 'axios';
import { db } from '../../firebase';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import DisplayPosts from '../../components/DisplayPosts/DisplayPosts';
import './UserProfile.scss';

const UserProfile = (props) => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [textPosts, setTextPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { setGridView, setStackedView, showStackBtn, postWidth, postMargin, rowConfig } = props;

  // Scroll to the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetches all the posts of whomever's profile was clicked on
  const getPosts = useCallback(async () => {
    if (user.uid) {
      let requestURL = `${process.env.REACT_APP_SERVER}/posts?uid=${user.uid}`;
      try {
        let response = await axios.get(requestURL);
        setTextPosts(response.data.reverse());
        const q = query(collection(db, 'files'), where('userID', '==', user.uid), orderBy('createdAt'));
        const querySnapshot = await getDocs(q);
        setPosts(querySnapshot.docs.map((doc) => formatDoc(doc)).reverse());
        setError('');
        setIsLoading(false);
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
          setUser(response.data[0]);
          setError('');
        })
        .then(getPosts())
        .catch(err => {
          console.error(err);
          setError('Could not load user');
        });
    }
    findUserById();
  }, [userId, getPosts, posts]);

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
    <div className='user-profile dashboard text-center'>
      <Header
        setGridView={setGridView}
        setStackedView={setStackedView}
        user={user}
        showStackBtn={showStackBtn}
        setError={setError}
        isLoading={isLoading}
      />
      <Sidebar />
      {!isLoading && <div className="main-content">
        {error && <Alert>{error}</Alert>}
        {(textPosts.length > 0 || posts.length > 0) && (user.uid) && (
          <DisplayPosts
            textPosts={textPosts}
            user={user}
            setTextPosts={setTextPosts}
            posts={posts}
            rowConfig={rowConfig}
            postWidth={postWidth}
            postMargin={postMargin}
          />
        )}
        {(textPosts.length === 0) && (posts.length === 0) &&
          <p className='mt-3 info-text'>No posts to display.</p>
        }
      </div>}
    </div>
  );
}

export default UserProfile;
