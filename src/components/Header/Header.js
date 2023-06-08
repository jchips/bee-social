import React from 'react';
import { BsViewStacked } from 'react-icons/bs';
import { MdOutlineGridView } from 'react-icons/md';
import './Header.scss';

const Header = (props) => {
  const { setGridView, setStackedView, user } = props;

  console.log('user(s): ', user); // delete later
  return (
    <div className='header'>
      {user && <img src={user.photoURL} alt={`${user.displayName} pfp`}/>}
      {/* <h1>{user ? 'Bee Social 🐝' : user.displayName}</h1> */}
      <h1>{user ? user.displayName : 'Bee Social 🐝'}</h1>
      <div className='options'>
        <BsViewStacked className='stacked-view-btn' title='stacked view' onClick={setStackedView}/>
        <MdOutlineGridView className='grid-view-btn' title='grid view' onClick={setGridView}/>
      </div>
    </div>
  );
}

export default Header;
