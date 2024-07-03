import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.scss';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const photoUrl = currentUser.photoURL;

  // Logs user out
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='sidebar'>
      <div className='profile'>
        <div className='pfp-container'>
          <img src={photoUrl} alt='Profile pic' />
        </div>
        <Link to={`/user-profile/${currentUser.uid}`} className='username-container button'>
          <p>{currentUser.displayName}</p>
        </Link>
        <Link to='/update-profile' className='btn-container button'>Update Profile</Link>
        <Link to='/settings' className='btn-container button'>Settings</Link>
        <Button variant='link' className='btn-container button' onClick={handleLogout}>Log Out</Button>
      </div>
    </div>
  )
}

export default Sidebar;
