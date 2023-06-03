import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './UpdateProfile.scss';

const UpdateProfile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  let [updateProfile] = useState({});
  const [profileImg, setProfileImg] = useState(currentUser.photoURL)
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
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

    updateProfile.displayName = formObj.displayName || currentUser.displayName;
    updateProfile.photoURL = profileImg;

    console.log('updateProfile', updateProfile);

    try {
      await updateUserProfile(currentUser, updateProfile);
      updateUserInDatabase();
      console.log(currentUser); // delete later
      navigate('/');
    } catch (err) {
      console.error(err)
      setError('Failed to update profile');
    }

    // navigate('/');
  }

  // Removes the profile pic (sets it back to default)
  const removePfp = () => {
    setProfileImg(defaultImage);
  }

  /**
   * Checks if photo URL is an active link, and if it is, updates the pfp to display the image
   * @param {Event} e - onChange event
   */
  const changePfp = (e) => {
    checkLink(e.target.value)
      .then(link => setProfileImg(link ? e.target.value : defaultImage))
      .catch(err => console.error(err));
  }

  /**
   * Checks to make sure link is active
   * Idea from: https://stackoverflow.com/questions/3915634/checking-if-a-url-is-broken-in-javascript
   * @param {String} url - the photo url it checks
   * @returns {Boolean} - Whether the link is active or not
   */
  const checkLink = async (url) => {
    try {
      let response = await fetch(url);
      if (response.url.includes('http://localhost')) {
        return false;
      }
      return response.ok;
    } catch (err) {
      console.error(err);
      return false;
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

  /**
   * Fetches all users from MongoDB database so that I can find the user
   * who is updating their profile.
   */
  const fetchAllUsers = () => {
    let requestURL = `${process.env.REACT_APP_SERVER}/users`;
    axios.get(requestURL)
      .then(response => {
        setError('');
        setUsers(response.data);
      })
      .catch(err => {
        setError('Could not fetch users');
        console.error(err);
      })
  }

  /**
   * Finds user in MongoBD database based on their uid.
   * Updates user information in MongoDB database
   */
  const updateUserInDatabase = () => {
    let user = users.find(user => user.uid === currentUser.uid);
    let requestURL = `${process.env.REACT_APP_SERVER}/users/${user._id}`;
    let updateUser = {
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL
    }
    axios.patch(requestURL, updateUser)
      .then(response => {
        setError('')
        let usersCopy = [...users];
        usersCopy.splice(usersCopy.indexOf(user), 1, response.data);
        setUsers(usersCopy);
      })
      .catch(err => {
        setError('Could not update user');
        console.error(err);
      })
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="update-profile">
      <Card className='auth-card' style={{ maxWidth: '30rem' }}>
        <Card.Title>Update Profile</Card.Title>
        <Card.Img src={profileImg} variant='top' alt='Profile image' />
        <Button className='remove-pfp' variant='link' type='button' onClick={removePfp}>Remove profile pic</Button>
        <Card.Body>
          {error && <Alert>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <InputGroup className='mb-3'>
              <InputGroup.Text id='display-name'>Display name:</InputGroup.Text>
              <Form.Control
                aria-label='Enter name'
                aria-describedby='display-name'
                // placeholder={currentUser.displayName || 'user-' + currentUser.uid.substring(0, 10)}
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
            <Button type='submit' className='button w-100 text-center mt-3'>Update profile</Button>
          </Form>
          <div className="text-center mt-3">
            <Link to='/'>Cancel</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UpdateProfile;
