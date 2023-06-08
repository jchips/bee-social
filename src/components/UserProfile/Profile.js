import React from 'react';

const Profile = (props) => {
  const { user } = props;
  return (
    <div className='profile dashboard text-center row'>
      <p>{user.displayName}</p>
    </div>
  );
}

export default Profile;
