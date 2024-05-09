import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import './PostModal.scss';

const AddPostModal = (props) => {
  const { showAddModal, setShowAddModal, handleUpload } = props;

  // Handles submitting/adding the new post
  const handleSubmit = (e) => {
    e.preventDefault(); // prevents instant refresh
    handleUpload(e.target.img.files[0], e.target.title.value, e.target.text.value);
    handleClose();
  }

  // Closes the modal
  const handleClose = () => {
    setShowAddModal(false);
  }

  return (
    <Modal show={showAddModal} onHide={handleClose} className='add-post-modal'>
      <Modal.Header closeButton>
        <Modal.Title>New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control type='text' placeholder='Enter a title' maxLength={20} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="text">
            <Form.Label>Text</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder='Enter text' required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="img">
            <Form.Label>Post image <span className="side-note">(optional - only jpgs are supported)</span></Form.Label>
            <Form.Control type="file" />
          </Form.Group>
          <Button variant='primary' type='submit' className='button'>Post</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddPostModal;
