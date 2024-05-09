import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, logout, emailVerification } = useAuth();
  const navigate = useNavigate();

  /**
   * Logs in user if they have an account.
   * Logs user out (if their email is not verified).
   * @param {Event} e - THe submit event when a user presses 'log in'
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;

    try {
      setError('');
      isLoading(true);
      let userCredential = await login(email, password);

      // If email is not verified, send them a email verification link.
      if (userCredential.user.emailVerified) {
        navigate('/');
      } else {
        setError('Email not verified. Check your email inbox to verify email.');
        verifyEmail(userCredential.user);
        logoutUser();
      }
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    }

    isLoading(false);
  }

  /**
   * Sends the recently signed up user a verification email
   * @param {Object} user - The info of the user who signed up
   */
  const verifyEmail = async (user) => {
    try {
      await emailVerification(user);
    } catch (err) {
      setError('Could not verify email');
    }
  }

  // Logs user out
  const logoutUser = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='login'>
      <Card className='auth-card'>
        <Card.Title>Log In</Card.Title>
        <Card.Body>
          {error && (
            <Alert variant='danger'>{error}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='email' className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' required />
            </Form.Group>
            <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' required />
            </Form.Group>
            <Button variant='primary' type='submit' className='w-100 mt-2 button' disabled={loading} style={{ border: '1px solid black' }}>Log in</Button>
          </Form>
          <div className='w-100 text-center mt-3'>
            <Link to='/forgot-password'>Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className='text-center mt-3'>
        Need an account? <Link to='/signup'>Sign Up</Link>
      </div>
    </div>
  );
}

export default Login;
