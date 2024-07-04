import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UpdateLogin = () => {
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [verifyEmailMsg, setVerifyEmailMsg] = useState('');
  const {
    currentUser,
    updateEmail,
    updatePassword,
    emailVerification,
  } = useAuth();

  /**
   * Handles the update email form submission.
   * @param {Event} e - The form submit event.
   * @returns - Possibly returns an error.
   */
  const handleEmailChange = (e) => {
    e.preventDefault(); // prevents instant refresh
    let email = e.target.email.value;
    isLoading(true);
    setError('');
    setSuccessMsg('');
    setVerifyEmailMsg('');

    if (email !== currentUser.email) {
      updateEmail(email)
        .then(() => emailVerification(currentUser))
        .then(() => {
          setSuccessMsg('Login info updated');
          setVerifyEmailMsg('Check your inbox to verify your new email address. Unverified accounts get deleted.');
        })
        .catch(err => setError(err.message))
        .finally(() => isLoading(false));
    }
  }

  /**
   * Handles the update password form submission.
   * @param {Event} e - The form submit event.
   * @returns - Possibly returns an error.
   */
  const handlePasswordChange = (e) => {
    e.preventDefault(); // prevents instant refresh
    isLoading(true);
    setError('');
    setSuccessMsg('');
    setVerifyEmailMsg('');
    let password = e.target.password.value;
    let confirmPassword = e.target.confirmPassword.value;

    // Checks to make sure passwords are the same
    if (password !== confirmPassword) {
      return setError('Passwords do not match'); // return to break out of the function
    }

    if (password) {
      updatePassword(password)
        .then(setSuccessMsg('Login info updated'))
        .catch(err => setError(err.message))
        .finally(() => isLoading(false));
    }
  }

  return (
    <div className='update-login'>
      <Card className='auth-card'>
        <Card.Title>Update Login</Card.Title>
        <Card.Body>
          {error && (
            <Alert variant='danger'>{error}</Alert>
          )}
          {successMsg && (
            <Alert variant='success'>{successMsg}</Alert>
          )}
          {verifyEmailMsg && (
            <Alert variant='info'>{verifyEmailMsg}</Alert>
          )}
          <Form onSubmit={handleEmailChange}>
            <Form.Group controlId='email' className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' defaultValue={currentUser.email} required />
            </Form.Group>
            <Button variant='primary' type='submit' className='w-100 mt-2 mb-3 button' disabled={loading}>Update email</Button>
          </Form>
          <Form onSubmit={handlePasswordChange}>
            <Form.Group controlId='password' className='mb-3'>
              <Form.Label>New Password</Form.Label>
              <Form.Control type='password' placeholder='Enter a password' />
            </Form.Group>
            <Form.Group controlId='confirmPassword' className='mb-3'>
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control type='password' placeholder='Re-enter the above password' />
            </Form.Group>
            <Button variant='primary' type='submit' className='w-100 mt-2 button' disabled={loading}>Update password</Button>
          </Form>
          <div className='w-100 text-center mt-3 cancel-button'>
            <Link to='/update-profile'>Cancel</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UpdateLogin;
