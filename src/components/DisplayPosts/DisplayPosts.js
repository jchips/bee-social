import React, { useState } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Post from './Post/Post';
import TextPost from './Post/Post_old';
import EditPostModal from './PostModals/EditPostModal';
import DeletePostModal from './PostModals/DeletePostModal';
import './DisplayPosts.scss';

const DisplayPosts = (props) => {
  const { posts, setTextPosts, users, user, textPosts, rowConfig, postWidth, postMargin } = props;
  const [error, setError] = useState('');
  const [postType, setPostType] = useState('imgPost');
  const [selectedPost, setSelectedPost] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { currentUser } = useAuth();

  /**
   * Updates the post in the database to reflect the new changes the user made.
   * Then re-renders the page so that the edits shows up on the page right away.
   * @param {Object} newPost - Post to be updated (with it's updated contents).
   */
  const editPost = (newPost) => {
    let requestURL = `${process.env.REACT_APP_SERVER}/posts/${selectedPost._id}`;
    axios.patch(requestURL, newPost)
      .then(response => {
        setError('')
        let postsCopy = [...textPosts];
        postsCopy.splice(postsCopy.indexOf(selectedPost), 1, response.data);
        setTextPosts(postsCopy);
      })
      .catch(err => {
        setError('Failed to edit post');
        console.error(err);
      })
  }

  /**
   * Deletes the post from the database and then re-renders the page so that the
   * post doesn't show up anymore.
   * @param {Object} post - The post to be deleted
   */
  const deletePost = (post) => {
    let requestURL = `${process.env.REACT_APP_SERVER}/posts/${post._id}`;
    axios.delete(requestURL)
      .then(() => {
        setError('');
        let postsCopy = [...textPosts];
        postsCopy.splice(postsCopy.indexOf(post), 1);
        setTextPosts(postsCopy);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to delete post');
      });
  }

  /**
   * Gets the user of the post based on the uid that is attached to the post.
   * @param {String} postUid - The uid attached to the post (from the MongoDB database)
   * @returns {Object} - The user that the post belongs to.
   */
  const getUserOfPost = (postUid) => {
    let userOfPost = users.find(user => user.uid === postUid);
    return userOfPost || currentUser;
  }

  return (
    <div className='feed'>
      <div className="posts-container">
        <Row lg={rowConfig} sm={1} className='posts-display justify-content-center'>
          {error && <Alert variant='danger'>{error}</Alert>}

          {(posts.length > 0) && (posts.map(post =>
            <Col lg md sm className='post-column' key={post.id}>
              <Post
                post={post}
                user={users ? getUserOfPost(post.userID) : user}
                setPostType={setPostType}
                postWidth={postWidth}
                postMargin={postMargin}
                setSelectedPost={setSelectedPost}
                setShowEditModal={setShowEditModal}
                setShowDeleteModal={setShowDeleteModal}
              />
            </Col>
          ))}
          {(textPosts.length > 0) && (textPosts.map(post =>
            <Col lg md sm className='post-column' key={post._id}>
              <TextPost
                post={post}
                user={users ? getUserOfPost(post.uid) : user}
                setPostType={setPostType}
                postWidth={postWidth}
                postMargin={postMargin}
                deletePost={deletePost}
                setSelectedPost={setSelectedPost}
                setShowEditModal={setShowEditModal}
                setShowDeleteModal={setShowDeleteModal}
              />
            </Col>
          ))}
        </Row>
      </div>
      <EditPostModal
        editPost={editPost}
        selectedPost={selectedPost}
        postType={postType}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        setError={setError}
      />
      <DeletePostModal
        deletePost={deletePost}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        selectedPost={selectedPost}
        postType={postType}
        setError={setError}
      />
    </div>
  );
}

export default DisplayPosts;
