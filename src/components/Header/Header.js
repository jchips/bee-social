import React from 'react';
import { BsViewStacked } from 'react-icons/bs';
import { MdOutlineGridView } from 'react-icons/md';
import './Header.scss';

const Header = (props) => {
  const { setGridView, setStackedView } = props;

  return (
    <div className='header'>
      <h1>Bee Social 🐝</h1>
      <div className='options'>
        <BsViewStacked className='stacked-view-btn' title='stacked view' onClick={setStackedView}/>
        <MdOutlineGridView className='grid-view-btn' title='grid view' onClick={setGridView}/>
      </div>
    </div>
  );
}

export default Header;
