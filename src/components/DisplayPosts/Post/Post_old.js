import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { FiTrash2, FiEdit3 } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import './Post.scss';

const Post = (props) => {
  const {
    post,
    user,
    postWidth,
    setSelectedPost,
    setShowEditModal,
    setShowDeleteModal,
    postMargin,
    setPostType
  } = props;
  const { currentUser } = useAuth();
  const userProfileUrl = `/user-profile/${user.uid}`;

  /**
   * Formats the date/time the post was created into nice readable text.
   * @param {Date} date - A date in UTC time (the date/time the post was created).
   * @returns {String} - The date/time the post was created.
   */
  const formatDate = (date) => {
    let timeElapsed = new Date(date);
    let formattedDate = timeElapsed.toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" });
    let formattedTime = timeElapsed.toLocaleTimeString('en-US', { hour: "numeric", minute: "2-digit" });
    return formattedDate + ' - ' + formattedTime;
  }

  // Opens the edit modal.
  const openEdit = () => {
    setSelectedPost(post);
    setPostType('textPost');
    setShowEditModal(true);
  }

  // opens the delete post modal
  const openDelete = () => {
    setSelectedPost(post);
    setPostType('textPost');
    setShowDeleteModal(true);
  }

  return (
    <Card className='post post-card' style={{ width: postWidth, margin: postMargin }}>
      <Card.Header className='card-user-info'>
        <Link to={userProfileUrl}>
          <img src={user.photoURL} alt='user-pfp' />
          {user.displayName}
        </Link>
      </Card.Header>
      <Card.Body>
        <div className='card-title-container'>
          <Card.Title>{post.title}</Card.Title>
          <div>
            {post.uid === currentUser.uid && <FiEdit3 className='edit-icon' onClick={() => openEdit()} />}
            {post.uid === currentUser.uid && <FiTrash2 className='trash-icon' onClick={() => openDelete()} />}
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
