import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
// import { users } from '../fetchAllUsers';
import Sidebar from '../Sidebar/Sidebar';
// import Profile from './Profile';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [error, setError] = useState('');

  // const findUserById = () => {
  //   let requestURL = `${process.env.REACT_APP_SERVER}/users/${userId}`;
  //   axios.get(requestURL)
  //     .then(response => {
  //       // console.log(response.data);
  //       setError('');
  //       setUser(response.data);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       setError('Could not load user');
  //     });
  // }

  useEffect(() => {
    const findUserById = () => {
      let requestURL = `${process.env.REACT_APP_SERVER}/users/${userId}`;
      axios.get(requestURL)
        .then(response => {
          // console.log(response.data);
          setError('');
          setUser(response.data);
        })
        .catch(err => {
          console.error(err);
          setError('Could not load user');
        });
    }
    return findUserById;
  }, [userId]);

  console.log('user', userId);
  if (user !== {}) {
    console.log(user);
  }
  return (
    <div className='user-profile dashboard text-center row'>
      <Sidebar />
      <div className='col-lg-10 col-sm-12'>
        {error && <Alert variant='danger'>{error}</Alert>}
        {user !== {} && (
          <Profile user={user}/>
        )}
      </div>
    </div>
  );
}

const Profile = (props) => {
  const { user } = props;
  return (
    <div className='profile'>
      <p>{user.displayName}</p>
    </div>
  );
}

export default UserProfile;
