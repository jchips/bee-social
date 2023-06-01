import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import '../Footer/Footer.scss';

const Footer = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className='footer'>
      <Button variant='link' onClick={handleLogout}>Log Out</Button>
    </div>
  );
}

export default Footer;
