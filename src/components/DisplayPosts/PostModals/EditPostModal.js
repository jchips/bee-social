import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

class EditPostModal extends Component {

  // Handles when the user submits the edit form.
  handleSubmit = (e) => {
    e.preventDefault(); // prevents instant refresh

    // Create a object from the form data
    let form = e.target;
    let formData = new FormData(form);
    let updatedPost = Object.fromEntries(formData.entries());
    updatedPost.title = updatedPost.title || this.props.selectedPost.title;
    updatedPost.text = updatedPost.text || this.props.selectedPost.text;

    this.props.editPost(updatedPost);

    this.handleClose();
  }

  // Closes the modal
  handleClose = () => {
    this.props.setShowEditModal(false);
  }

  render() {
    const { showEditModal, selectedPost } = this.props;
    return (
      <Modal show={showEditModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type='text' name='title' placeholder={selectedPost.title} maxLength={20} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="text">
              <Form.Label>Post text</Form.Label>
              <Form.Control as="textarea" rows={3} name='text' defaultValue={selectedPost.text} />
            </Form.Group>
            <Button variant='primary' type='submit' onClick={this.handleClose}>Edit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

export default EditPostModal;