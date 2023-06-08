import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Home from '../Home/Home';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  const getPosts = useCallback(() => {
    if(user.uid) {
      let requestURL = `${process.env.REACT_APP_SERVER}/posts?uid=${user.uid}`;
      axios.get(requestURL)
        .then(response => {
          setError('');
          setPosts(response.data);
        })
        .catch(err => {
          console.error(err);
          setError('Could not fetch posts');
        });
    }
  }, [user.uid]);
  

  useEffect(() => {
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

  return (
    <div className='user-profile dashboard text-center row'>
      {error && <Alert>{error}</Alert>}
      <Sidebar />
      {(posts.length > 0 && user.uid) && <Home posts={posts} user={user} setPosts={setPosts}/>}
    </div>
  );
}

export default UserProfile;
