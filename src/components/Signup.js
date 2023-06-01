import React, {useState} from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup, emailVerification, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;
    let confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      return setError('Passwords do not match'); // return to break out of the function
    }

    try {
      setError('');
      isLoading(true);
      let userCredential = await signup(email, password);
      console.log(userCredential); // delete later
      verifyEmail(userCredential.user);
      await updateUserProfile(userCredential.user, {displayName: 'user-' + userCredential.user.uid.substring(0, 10), photoURL: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106'}); 
      console.log(userCredential.user); // delete later
      logoutUser();
      navigate('/verify-email');
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    }

    isLoading(false); // Occurs after the signup (so after the await)
  }

  /**
   * Sends the recently signed up user a verification email
   * @param {Object} user - The info of the user who signed up
   */
  const verifyEmail = async (user) => {
    try {
      await emailVerification(user);
      // logoutUser();
      console.log('verify email', user);
    } catch (err) {
      setError('Could not verify email');
    }
  }

  const logoutUser = async () =>  {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <Card className='auth-card'>
        <Card.Title>Sign Up</Card.Title>
        <Card.Body>
          {error && (
            <Alert variant='danger'>{error}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='email' className='mb-3'>
              <Form.Label>Enter Email</Form.Label>
              <Form.Control type='email' required />
            </Form.Group>
            <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Enter Password</Form.Label>
              <Form.Control type='password' required />
            </Form.Group>
            <Form.Group controlId='confirmPassword' className='mb-3'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type='password' required />
            </Form.Group>
            <Button variant='primary' type='submit' className='w-100 mt-2' disabled={loading}>Sign Up</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='text-center mt-3'>
        Already have an account? <Link to='/login'>Log In</Link>
      </div>
    </div>
  );
}

export default Signup;
