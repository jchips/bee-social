import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/Home';
import { Alert } from 'react-bootstrap';

const App = () => {
  const [posts, setPosts] = useState([]);
  // const [users, setUsers] = useState([]);
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

  // const fetchAllUsers = () => {
  //   let requestURL = `${process.env.REACT_APP_SERVER}/users`;
  //   axios.get(requestURL)
  //     .then(response => {
  //       setError('');
  //       setUsers(response.data);
  //     })
  //     .catch(err => {
  //       setError('Could not fetch users');
  //       console.error(err);
  //     })
  // }

  useEffect(() => {
   fetchAllPosts();
  //  fetchAllUsers();
  }, []);

  // console.log('posts:', posts); // delete later
  // console.log('users:', users); // delete later

  return (
    <div className='dashboard text-center row'>
      {error && <Alert>{error}</Alert>}
      <Sidebar />
      {users.length > 0 && 
        <Home posts={posts} users={users} setPosts={setPosts} />
      }
    </div>
  )
}

export default App;
