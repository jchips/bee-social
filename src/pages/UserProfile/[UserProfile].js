import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import DisplayPosts from '../../components/DisplayPosts/DisplayPosts';
import AddPostButton from '../../components/DisplayPosts/AddPostButton';

const UserProfile = (props) => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [textPosts, setTextPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  // const [postWidth, setPostWidth] = useState('17rem');
  // const [postMargin, setPostMargin] = useState('5px 3px');
  // const [rowConfig, setRowConfig] = useState('auto');
  const { setGridView, setStackedView, postWidth, postMargin, rowConfig } = props;

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
          setUser(response.data);
          getPosts();
          setError('');
        })
        .catch(err => {
          console.error(err);
          setError('Could not load user');
        });
    }
    findUserById();
  }, [userId, getPosts, posts]);

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
      <div className="col-sm-10 col-12">
        <Header setGridView={setGridView} setStackedView={setStackedView} user={user} />
        {(currentUser.uid === user.uid) && (
          <div className='text-center add-button-container'>
            <AddPostButton setError={setError} />
          </div>
        )}
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
      </div>
    </div>
  );
}

export default UserProfile;
