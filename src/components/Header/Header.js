import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsViewStacked } from 'react-icons/bs';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { MdOutlineGridView } from 'react-icons/md';
import './Header.scss';

const Header = (props) => {
  const { setGridView, setStackedView, user } = props;
  const navigate = useNavigate();

  return (
    <div className='header'>
      {user && <div>
        <RiArrowGoBackLine className='back-btn' title='Go back' onClick={() => navigate(-1)}>Back</RiArrowGoBackLine>
        <img src={user.photoURL} alt={`${user.displayName} pfp`}/>
      </div>}
      {/* <h1>{user ? 'Bee Social 🐝' : user.displayName}</h1> */}
      <h1>{user ? user.displayName + '\'s profile' : 'Bee Social 🐝'}</h1>
      <div className='options'>
        <BsViewStacked className='stacked-view-btn' title='stacked view' onClick={setStackedView}/>
        <MdOutlineGridView className='grid-view-btn' title='grid view' onClick={setGridView}/>
      </div>
    </div>
  );
}

export default Header;
