import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsViewStacked } from 'react-icons/bs';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { MdOutlineGridView } from 'react-icons/md';
import { useAuth } from '../../contexts/AuthContext';
import AddPostButton from '../DisplayPosts/AddPostButton';
import './Header.scss';

const Header = (props) => {
  const { setGridView, setStackedView, showStackBtn, user, setError, users, isLoading } = props;
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='header'>
      {user && <div>
        <RiArrowGoBackLine className='back-btn' title='Go back' onClick={() => navigate(-1)}>Back</RiArrowGoBackLine>
        {!isLoading && <img src={user.photoURL} alt={`${user.displayName} pfp`} />}
      </div>}
      {!isLoading && <h1>{user ? user.displayName + '\'s profile' : 'Bee Social 🐝'}</h1>}
      <div className='options'>
        {(users || (currentUser.uid === user.uid)) && (
          <div className='text-center'>
            <AddPostButton setError={setError} />
          </div>
        )}
        {!showStackBtn ?
          <BsViewStacked className='stacked-view-btn' title='stacked view' onClick={setStackedView} /> :
          <MdOutlineGridView className='grid-view-btn' title='grid view' onClick={setGridView} />}
      </div>
    </div>
  );
}

export default Header;
