import React from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import deleteUserData from '../util/deleteUserData';
import '../components/DisplayPosts/PostModals/PostModal.scss';

const Reauthenticate = (props) => {
  const { showReauthModal, setShowReauthModal, reauthError, setReauthError, reauthPurpose } = props;
  const { reauthenticateUser, deleteUserAccount, currentUser } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles the reauthentication differently depending on whether the user
   * wants to change their email and/or password or delete their account.
   * Also provides error messages.
   * @param {Event} e - Form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents instant refresh
    try {
      let reauth = await reauthenticateUser(e.target.password.value);
      if (reauth === 'reauthenticated successfully') {
        if (reauthPurpose === 'deletion') {
          await deleteAccount();
          setReauthError('');
        } else if (reauthPurpose === 'update') {
          navigate('/update-login');
        }
        closeModal();
      } else if (reauth.includes('auth/wrong-password)')) {
        setReauthError('Wrong password.');
      } else if (reauth.includes('auth/too-many-requests')) {
        setReauthError('There were too many failed attempts. Please try again later.');
      } else {
        setReauthError('Failed to reauthenticate user');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Deletes the current user's account and all their account data.
  const deleteAccount = async () => {
    try {
      setReauthError('');
      await deleteUserData(currentUser.uid);
      navigate('/login');
      await deleteUserAccount(currentUser);
    } catch (error) {
      console.error(error);
      setReauthError('Failed to delete account');
    }
  }

  // Closes the reauthentication modal.
  const closeModal = () => {
    setShowReauthModal(false);
  }

  return (
    <Modal show={showReauthModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Please confirm your password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {reauthError && <Alert variant='danger'>{reauthError}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>
              {
                reauthPurpose === 'deletion'
                  ? 'Type password to continue with deletion'
                  : 'Type your current password to continue'
              }
            </Form.Label>
            <Form.Control type='password' placeholder='Enter password' required />
          </Form.Group>
          <Button
            type='submit'
            className={`${reauthPurpose === 'deletion' ? 'delete-button' : null} button`}
          >
            {reauthPurpose === 'deletion' ? 'Delete My Account' : 'Continue to change email or password'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Reauthenticate;
