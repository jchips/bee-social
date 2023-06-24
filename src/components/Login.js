import React, {useState} from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;

    try {
      setError('');
      isLoading(true);
      let userCredential = await login(email, password);
      console.log(userCredential); // delete later
      if (userCredential.user.emailVerified) {
        navigate('/');
      } else {
        setError('Email not verified');
        logoutUser();
      }
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    }

    isLoading(false);
  }

  const logoutUser = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div>
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
            <Button variant='primary' type='submit' className='w-100 mt-2' disabled={loading}>Log in</Button>
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
