import React from 'react';
import { Card } from 'react-bootstrap';
import { FiTrash2, FiEdit3 } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import './Post.scss';

const Post = (props) => {
  const { post, user, postWidth, deletePost, setSelectedPost, setShowEditModal, postMargin } = props;
  const { currentUser } = useAuth();

  const formatDate = (date) => {
    let timeElapsed = new Date(date);
    let formattedDate = timeElapsed.toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" });
    let formattedTime = timeElapsed.toLocaleTimeString('en-US', { hour: "numeric", minute: "2-digit" });
    return formattedDate + ' - ' + formattedTime;
  }

  const openModal = (post) => {
    setSelectedPost(post);
    setShowEditModal(true);
  }

  return (
    <Card className='post post-card' style={{ width: postWidth, margin: postMargin }}>
      <Card.Header className='card-user-info'>
        <img src={user.photoURL} alt='user-pfp' />
        <p>{user.displayName}</p> {/* TODO: Turn into a Link that navigates to user's profile*/}
      </Card.Header>
      <Card.Body>
        <div className='card-head'>
          <Card.Title>{post.title}</Card.Title>
          <div>
            {post.uid === currentUser.uid && <FiEdit3 className='edit-icon' onClick={() => openModal(post)}/>}
            {post.uid === currentUser.uid && <FiTrash2 className='trash-icon' onClick={() => deletePost(post)} />}
          </div>
        </div>
        <Card.Text>
          {post.text}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{formatDate(post.dateCreated)}</Card.Footer>
    </Card>
  );
}

export default Post;
