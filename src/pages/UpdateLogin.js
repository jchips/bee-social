import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
  

const UpdateLogin = () => {
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { currentUser, updateEmail, updatePassword } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault(); // prevents instant refresh
    let email = e.target.email.value;
    let password = e.target.password.value;
    let confirmPassword = e.target.confirmPassword.value;

    // Checks to make sure passwords are the same
    if (password !== confirmPassword) {
      return setError('Passwords do not match'); // return to break out of the function
    }

    const promises = [];
    isLoading(true);
    setError('');

    // If the email addresses are changed, make sure to add the change to the promises[] array
    if(email !== currentUser.email) {
      promises.push(updateEmail(email));
    }

    // If a password is entered, adds the change to the promises[] array. 
    // If a password isn't entered, the password will not change.
    if (password) {
      promises.push(updatePassword(password));
    }

    // Runs async stuff simultaneously
    Promise.all(promises)
      .then(() => setMessage('Login info updated'))
      .catch(err => setError(err.message))
      .finally(() => isLoading(false));
  }

  return (
    <div>
      <Card className='auth-card'>
        <Card.Title>Update Login</Card.Title>
        <Card.Body>
          {error && (
            <Alert variant='danger'>{error}</Alert>
          )}
          {message && (
            <Alert variant='info'>{message}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='email' className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' defaultValue={currentUser.email} required />
            </Form.Group>
            <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Enter Password</Form.Label>
              <Form.Control type='password' placeholder='Leave blank to keep the same' />
            </Form.Group>
            <Form.Group controlId='confirmPassword' className='mb-3'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type='password' placeholder='Leave blank to keep the same' />
            </Form.Group>
            <Button variant='primary' type='submit' className='w-100 mt-2' disabled={loading}>Update</Button>
          </Form>
          <div className='w-100 text-center mt-3'>
            <Link to='/update-profile'>Cancel</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UpdateLogin;
