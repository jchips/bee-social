import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import '../Footer/Footer.scss';

const Footer = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const footerRef = useRef();

  // Positions the footer at the bottom of the page once you scroll to the bottom
  useEffect(() => {
    const footer = footerRef.current;
    const footerHeight = footer.offsetHeight;

    window.addEventListener('scroll', () => {
      // const footer = document.querySelector('.footer');
      const windowHeight = window.innerHeight;

      if (window.scrollY + windowHeight >= window.clientHeight + footerHeight) {
        footer.style.bottom = '0'; // Makes the footer fixed at the bottom
      } else {
        footer.style.bottom = `-${footerHeight}px`; // Moves the footer below the sidebar
      }
    });
  }, []);

  // Logs user out of their account
  // TODO: error handle
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='footer' ref={footerRef}>
      <Button variant='link' onClick={handleLogout}>Log Out</Button>
    </div>
  );
};

export default Footer;
