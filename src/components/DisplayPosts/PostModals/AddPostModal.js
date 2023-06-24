import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuthInClass } from '../../../contexts/AuthContext';
// import { useAuth } from '../../../contexts/AuthContext';

class AddPostModal extends Component {
  static contextType = useAuthInClass();

  handleClose = () => {
    this.props.setShowAddModal(false);
  }

  handleSubmit = (e) => {
    e.preventDefault(); // prevents instant refresh
    const { currentUser } = this.context;
    let newPost = {
      title: e.target.title.value,
      text: e.target.text.value,
      uid: currentUser.uid,
      dateCreated: Date.now()
    }

    this.props.addPost(newPost);

     this.handleClose();
  }
  render() {
    const { showAddModal } = this.props;
    return (
      <Modal show={showAddModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type='text' placeholder='Enter a title' maxLength={20} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="text">
              <Form.Label>Post text</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder='Enter text' required />
            </Form.Group>
            <Button variant='primary' type='submit'>Post</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

export default AddPostModal;