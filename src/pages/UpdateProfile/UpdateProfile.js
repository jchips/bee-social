import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './UpdateProfile.scss';

const UpdateProfile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const pfp = useRef(null);
  let [updateProfile] = useState({});
  const [profileImg, setProfileImg] = useState(currentUser.photoURL)
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106';

  /**
   * Handles the create user profile form submit
   * .fromEntries() creates a Map.
   * .entries() creates 2D array of key/value pairs for all entries in list
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents instant refresh

    // Gets data from form
    const form = e.target;
    const formData = new FormData(form);
    const formObj = Object.fromEntries(formData.entries());

    // Either sets the display name and pfp to the newly submitted profile information
    // or keeps it as whatever it was before.
    updateProfile.displayName = formObj.displayName || currentUser.displayName;
    updateProfile.photoURL = profileImg;

    try {
      await updateUserProfile(currentUser, updateProfile);
      navigate('/');
      window.location.reload(); // can remove if I would rather refresh manually
    } catch (err) {
      console.error(err)
      setError('Failed to update profile');
    }
  }

  // Removes the profile pic (sets it back to default)
  const removePfp = () => {
    setProfileImg(defaultImage);
  }

  /**
   * Sets the profile pic (pfp) to the whatever the user inputs for their photo URL.
   * @param {Event} e - onChange event
   */
  const changePfp = (e) => {
    setProfileImg(e.target.value);
  }

  /**
   * Runs if the photo URL doesn't lead to an image or is broken.
   * Sets the profile pic (pfp) to the default image.
   */
  const handleImageError = () => {
    if (pfp.current) {
      pfp.current.src = defaultImage;
      setProfileImg(defaultImage);
    }
  }

  /**
   * Sets the placeholder for the photo url form control
   * @returns {String} - A placeholder for the photo url input
   */
  const imgPlaceholder = () => {
    if (profileImg === defaultImage) {
      return 'Default image';
    }
    return profileImg || 'https://photo-url-example.jpg';
  }

  return (
    <div className="update-profile">
      <Card className='auth-card' style={{ maxWidth: '30rem' }}>
        <Card.Title>Update Profile</Card.Title>
        <Card.Img
          src={profileImg}
          variant='top'
          alt='Profile image'
          ref={pfp}
          onError={handleImageError}
        />
        <Button className='remove-pfp' variant='link' type='button' onClick={removePfp}>Remove profile pic</Button>
        <Card.Body>
          {error && <Alert>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <InputGroup className='mb-3'>
              <InputGroup.Text id='display-name'>Display name:</InputGroup.Text>
              <Form.Control
                aria-label='Enter name'
                aria-describedby='display-name'
                placeholder={currentUser.displayName}
                maxLength={20}
                name='displayName'
              />
            </InputGroup>
            <InputGroup className='mb-3'>
              <InputGroup.Text id='photo-url'>Profile pic URL:</InputGroup.Text>
              <Form.Control
                aria-label='Enter photo url'
                aria-describedby='photo-url'
                placeholder={imgPlaceholder()}
                onChange={changePfp}
                name='photoUrl'
              />
            </InputGroup>
            <div className='text-center'>
              <Link to='/update-login' className='btn btn-outline-dark mt-3 mb-3'>Change email or password</Link>
            </div>
            <Button id='update-profile-btn' type='submit' className='button w-100 text-center mt-3'>Update profile</Button>
          </Form>
          <div className="text-center mt-3 cancel-button">
            <Link to='/'>Cancel</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UpdateProfile;
