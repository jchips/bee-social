import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar/Sidebar';
import DisplayPosts from './components/DisplayPosts/DisplayPosts';
import { Alert } from 'react-bootstrap';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const { users } = useAuth();

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

  useEffect(() => {
   fetchAllPosts();
  }, []);

  return (
    <div className='dashboard text-center row'>
      {error && <Alert>{error}</Alert>}
      <Sidebar />
      {users.length > 0 && 
        <DisplayPosts posts={posts} users={users} setPosts={setPosts} />
      }
    </div>
  )
}

export default App;
