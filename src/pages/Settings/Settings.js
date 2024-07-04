import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeleteModal from '../../components/DisplayPosts/PostModals/DeleteModal';

const Settings = () => {
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const { currentUser } = useAuth();

  /**
   * Opens the reauthentication modal and resets its error message.
   * @param {Function} setReauthError - Set the reauthentication error message
   */
  const openReauthModal = (setReauthError) => {
    setReauthError('');
    setShowReauthModal(true);
  }

  return (
    <div className='settings'>
      <Card className='auth-card' style={{ maxWidth: '30rem' }}>
        <Card.Title>Account Settings</Card.Title>
        <Card.Body>
          {error && <Alert variant='danger'>{error}</Alert>}
          <p className='text-center' style={{ fontWeight: '600' }}>{currentUser.displayName}</p>
          <Button className='button delete-button w-100 text-center mt-3' onClick={() => setShowDeleteModal(true)}>Delete account</Button>
          <div className='w-100 text-center mt-3 cancel-button'>
            <Link to='/'>Cancel</Link>
          </div>
        </Card.Body>
      </Card>
      <DeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        showReauthModal={showReauthModal}
        openReauthModal={openReauthModal}
        setShowReauthModal={setShowReauthModal}
        error={error}
        setError={setError}
        deleteType='user'
      />
    </div>
  );
}

export default Settings;
