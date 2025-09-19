import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, unlikePost } from '../redux/postSlice';

const PostItem = ({ post, showDelete, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLike = () => {
    if (!user) return;
    if (post.likes && post.likes.includes(user._id)) {
      dispatch(unlikePost(post._id));
    } else {
      dispatch(likePost(post._id));
    }
  };

  return (
    <div className="post-item">
      {post.image && (
        <img src={`http://localhost:5000${post.image}`} alt="Post" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
      )}
      <h3>{post.title}</h3>
      <p>by {post.author.name}</p>
      <p>{post.content.substring(0, 100)}...</p>
      <Link to={`/posts/${post._id}`}>Read More</Link>
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={handleLike}
          style={{ background: post.likes && user && post.likes.includes(user._id) ? '#e67e22' : '#eee', color: post.likes && user && post.likes.includes(user._id) ? '#fff' : '#333', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer', fontSize: '1rem' }}
          disabled={!user}
        >
          {post.likes && user && post.likes.includes(user._id) ? 'Unlike' : 'Like'}
        </button>
        <span style={{ fontWeight: 500, fontSize: '1rem' }}>Likes: {post.likes ? post.likes.length : 0}</span>
      </div>
      {showDelete && (
        <button onClick={() => onDelete(post._id)} style={{ marginTop: '1rem', background: '#e74c3c', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
      )}
    </div>
  );
};

export default PostItem;