import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteObject } from 'firebase/storage';
import { useAuth } from '../../../contexts/AuthContext';
import { db, ref, storage } from '../../../firebase';
import Reauthenticate from '../../Reauthenticate';

const DeleteModal = (props) => {
  const {
    showDeleteModal,
    setShowDeleteModal,
    showReauthModal,
    setShowReauthModal,
    openReauthModal,
    selectedPost,
    postType,
    deletePost,
    setError,
    deleteType
  } = props;
  const { currentUser } = useAuth();
  const [reauthError, setReauthError] = useState('');

  // handles deletion for post or user depending on deleteType
  const handleDelete = async () => {
    try {
      if (deleteType === 'post') {
        await handlePost();
      } else {
        closeModal();
        openReauthModal(setReauthError);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // delete a post
  const handlePost = async () => {
    if (postType === 'textPost') {
      deletePost(selectedPost);
    } else {
      try {
        await deleteDoc(doc(db, 'files', selectedPost.id));
        if (selectedPost.url) {
          const storageRef = ref(storage, `/files/${currentUser.uid}/${selectedPost.name}`);
          await deleteObject(storageRef);
        }
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to delete post');
      }
    }
    closeModal();
  }

  // close the delete post modal
  const closeModal = () => {
    setShowDeleteModal(false);
  }

  return (
    <>
      <Modal show={showDeleteModal} onHide={closeModal} className='delete-post-modal'>
        <Modal.Header closeButton>
          <Modal.Title>Delete {deleteType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteType === 'post' ?
            (
              <p>Are you sure you want to delete this post?</p>
            ) : (
              <>
                <p><span style={{ fontWeight: '600' }}>{currentUser.displayName}</span>, are you sure you want to delete your account?</p>
                <p>This will remove all your user data from the Bee Social servers including your email address and all of your posts.</p>
                <p style={{ fontWeight: 'bold' }}>This Bee Social account will no longer exist.</p>
              </>
            )
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' className='button' onClick={closeModal}>Cancel</Button>
          <Button className='delete-button button' onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
      <Reauthenticate
        showReauthModal={showReauthModal}
        setShowReauthModal={setShowReauthModal}
        reauthError={reauthError}
        setReauthError={setReauthError}
        reauthPurpose='deletion'
      />
    </>
  );
}

export default DeleteModal;
