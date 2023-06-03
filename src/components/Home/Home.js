import React, { useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import Post from '../Post/Post';
import Header from '../Header/Header';
import EditPostModal from './PostModals/EditPostModal';
import './Feed.scss'; // Home.scss
import AddPostModal from './PostModals/AddPostModal';

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

  // TODO: try putting editPost() in a function component and using using the function in multiple components
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

  const getUserOfPost = (postUid) => {
    let user = users.find(user => user.uid === postUid);
    return user;
  }

  const setStackedView = () => {
    // setView('stack');
    setPostWidth('30rem');
    setRowConfig(1);
    setPostMargin('5px auto');
  }

  const setGridView = () => {
    // setView('grid');
    setPostWidth('17rem');
    setRowConfig('auto');
    setPostMargin('5px 3px');
  }

  return (
    <div className='feed col-lg-10 col-sm-12'>
      <Header setGridView={setGridView} setStackedView={setStackedView} />
      <div className="posts-container">
      <div className='add-post text-center'>
          <Button variant='dark' onClick={() => setShowAddModal(true)} className='mt-2 button' style={{backgroundColor: '#212529'}}>Add post</Button>
        </div>
        <Row lg={rowConfig} sm={1} className='posts-display justify-content-center'>
          {error && <Alert variant='danger'>{error}</Alert>}

          {/* Prevents no posts showing on initial mount */}
          {(posts.length > 0 && users.length > 0) && (posts.map(post =>
            <Col lg md sm key={post._id} className='post-column'>
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
        
      </div>
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
