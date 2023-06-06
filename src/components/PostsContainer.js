import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import Post from './Post/Post';

const PostsContainer = (props) => {
  const { rowConfig, error, posts, users, getUserOfPost, postWidth, postMargin, deletePost, setSelectedPost, setShowEditModal} = props;
  return (
    <div className="posts-container">
        <Row lg={rowConfig} sm={1} className='posts-display justify-content-center'>
          {error && <Alert variant='danger'>{error}</Alert>}

          {/* Prevents no posts showing on initial mount */}
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

      </div>
  );
}

export default PostsContainer;
