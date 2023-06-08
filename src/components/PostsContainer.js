import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
// import { getUser } from './findUserById';
import Post from './Post/Post';

const PostsContainer = (props) => {
  const { rowConfig, error, posts, users, getUserOfPost, postWidth, postMargin, deletePost, setSelectedPost, setShowEditModal } = props;
  // const [user, setUser] = useState({});
  
  // const getUserOfPost = (postUid) => {
  //   console.log('got user', getUser(postUid));
  //   setUser(getUser(postUid));
  // }

  // useEffect(() => {
  //   const getUserOfPost = (postUid) => {
  //     console.log('got user', getUser(postUid));
  //     setUser(getUser(postUid));
  //   }
  //   return getUserOfPost;
  // }, []);

  return (
    <div className='posts-container'>
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
