import React, { useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
// import Post from '../Post/Post';
import Header from '../Header/Header';
import EditPostModal from './PostModals/EditPostModal';
import './Feed.scss'; // Home.scss
import AddPostModal from './PostModals/AddPostModal';
import PostsContainer from '../PostsContainer';

const Home = (props) => {
  const { posts, setPosts, users } = props;
  const [error, setError] = useState('');
  // const [view, setView] = useState('grid');
  const [postWidth, setPostWidth] = useState('17rem');
  const [postMargin, setPostMargin] = useState('5px 3px');
  const [rowConfig, setRowConfig] = useState('auto');
  const [selectedPost, setSelectedPost] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  /**
   * Adds a new post to the front of database and then re-renders the page so that the new
   * post shows up for all users (at top of page).
   * @param {Object} newPost - The new post to be added.
   */
  const addPost = (newPost) => {
    let requestURL = `${process.env.REACT_APP_SERVER}/posts`;
    axios.post(requestURL, newPost)
      .then(response => {
        setError('');
        let postsCopy = [...posts];
        postsCopy.unshift(response.data);
        setPosts(postsCopy);
      })
      .catch(err => {
        setError('Failed to add post');
        console.error(err);
      });
  }

  /**
   * Updates the post in the database to reflect the new changes the user made.
   * Then re-renders the page so that the edits shows up on the page right away.
   * TODO: try putting editPost() in a function component and using using the 
   * function in multiple components.
   * @param {Object} newPost - Post to be updated (with it's updated contents).
   */
  const editPost = (newPost) => {
    let requestURL = `${process.env.REACT_APP_SERVER}/posts/${selectedPost._id}`;
    axios.patch(requestURL, newPost)
      .then(response => {
        setError('')
        let postsCopy = [...posts];
        postsCopy.splice(postsCopy.indexOf(selectedPost), 1, response.data);
        setPosts(postsCopy);
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
        let postsCopy = [...posts];
        postsCopy.splice(postsCopy.indexOf(post), 1);
        setPosts(postsCopy);
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
    let user = users.find(user => user.uid === postUid);
    return user;
  }

  // Sets the page view so that the posts are displayed in stacks
  const setStackedView = () => {
    // setView('stack');
    setPostWidth('30rem');
    setRowConfig(1);
    setPostMargin('5px auto');
  }

  // Sets the page view so that posts are displayed in a grid
  const setGridView = () => {
    // setView('grid');
    setPostWidth('17rem');
    setRowConfig('auto');
    setPostMargin('5px 3px');
  }

  return (
    <div className='feed col-lg-10 col-sm-12'>
      <Header setGridView={setGridView} setStackedView={setStackedView} />
        <div className='add-post text-center'>
          <Button variant='dark' onClick={() => setShowAddModal(true)} className='mt-2 button' style={{ backgroundColor: '#212529' }}>Add post</Button>
        </div>
      {/* <div className="posts-container">
        <Row lg={rowConfig} sm={1} className='posts-display justify-content-center'>
          {error && <Alert variant='danger'>{error}</Alert>}

          
          {(posts.length > 0 && users.length > 0) && (posts.map(post =>
            <Col lg md sm className='post-column' key={post._id}>
              <Post
                post={post}
                user={getUserOfPost(post.uid)}
                postWidth={postWidth}
                postMargin={postMargin}
                deletePost={deletePost}
                setSelectedPost={setSelectedPost}
                setShowEditModal={setShowEditModal}
              />
            </Col>
          ))}
        </Row>

      </div> */}
      <PostsContainer
        posts={posts}
        users={users}
        rowConfig={rowConfig}
        error={error}
        getUserOfPost={getUserOfPost}
        postWidth={postWidth}
        postMargin={postMargin}
        deletePost={deletePost}
        setSelectedPost={setSelectedPost}
        setShowEditModal={setShowEditModal}
      />
      <AddPostModal
        addPost={addPost}
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
      />
      <EditPostModal
        editPost={editPost}
        selectedPost={selectedPost}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
      />
    </div>
  );
}

export default Home;
