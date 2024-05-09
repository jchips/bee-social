import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { doc, deleteDoc } from "firebase/firestore";
import { deleteObject } from "firebase/storage";
import { useAuth } from '../../../contexts/AuthContext';
import { db, ref, storage } from '../../../firebase';

const DeletePostModal = (props) => {
  const { showDeleteModal, setShowDeleteModal, selectedPost, postType, deletePost, setError } = props;
  const { currentUser } = useAuth();

  // close the delete post modal
  const closeModal = () => {
    setShowDeleteModal(false);
  }

  // delete a post
  const handleDelete = async () => {
    if (postType === 'textPost') {
      deletePost(selectedPost);
    } else {
      try {
        await deleteDoc(doc(db, "files", selectedPost.id));
        if (selectedPost.url) {
          const storageRef = ref(storage, `/files/${currentUser.uid}/${selectedPost.name}`);
          await deleteObject(storageRef);
        }
        setError('');
      } catch (error) {
        console.error(error);
        setError('Failed to delete post')
      }
    }
    closeModal();
  }

  return (
    <Modal show={showDeleteModal} onHide={closeModal} className='delete-post-modal'>
      <Modal.Header closeButton>
        <Modal.Title>Delete post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this post?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' className='button' onClick={closeModal}>Close</Button>
        <Button className='delete-button button' onClick={() => handleDelete()}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeletePostModal;
