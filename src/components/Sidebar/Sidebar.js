import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.scss';

const Sidebar = () => {
  const { currentUser } = useAuth();
  const photoUrl = currentUser.photoURL;
  // const photoUrl = currentUser.photoURL ? currentUser.photoURL : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106';

  return (
    <div className='sidebar col-lg-2 col-sm-12'>    
      <div className='profile'>
        <div className='pfp-container'>
          <img src={photoUrl} alt='Profile pic'/>
        </div>
        {/* <p>{currentUser.displayName || ('user-' + currentUser.uid.substring(0, 10))}</p> */}
        <p>{currentUser.displayName}</p>
        {/* <Link to='/update-profile' className='btn mt-3'>Update Profile</Link> */}
        <Link to='/update-profile' className='button mt-3'>Update Profile</Link>
      </div>
    </div>
  )
}

export default Sidebar;
