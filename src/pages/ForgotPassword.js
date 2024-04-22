import React, { useState }from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword = () => {
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let email = e.target.email.value;

    try {
      setError('');
      isLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for further instructions.');
    } catch (err) {
      console.error(err);
      setError(err);
    }
    isLoading(false);
  }

  return (
    <div>
      <Card className='auth-card'>
        <Card.Title>Password Reset</Card.Title>
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
              <Form.Control type='email' required />
            </Form.Group>
            <Button variant='primary' type='submit' className='w-100 mt-2' disabled={loading}>Reset Password</Button>
          </Form>
          <div className='w-100 text-center mt-3'>
            <Link to='/login'>Login</Link>
          </div>
        </Card.Body>
      </Card>
      <div className='text-center mt-3'>
        Need an account? <Link to='/signup'>Sign Up</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
