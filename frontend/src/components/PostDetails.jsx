// frontend/src/components/PostDetails.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchPostById, deletePost } from '../redux/postSlice';

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost, loading, error } = useSelector((state) => state.posts);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id)).then(() => {
        navigate('/'); // Redirect to the homepage after deletion
      });
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentPost) return <div>Post not found</div>;

  // Check if the current logged-in user is the author of the post
  const isAuthor = isAuthenticated && user && currentPost.author && (currentPost.author._id === user._id || currentPost.author._id === user.id);

  return (
    <div className="post-details">
      {currentPost.image && (
        <img src={`https://blog-platform-hexb.onrender.com${currentPost.image}`} alt="Post" style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1.5rem' }} />
      )}
      <h2>{currentPost.title}</h2>
      <p>by {currentPost.author.name}</p>
      <p>{currentPost.content}</p>

      {isAuthor && (
        <div className="post-actions">
          <Link to={`/edit-post/${currentPost._id}`} className="edit-btn">Edit</Link>
          <button onClick={handleDelete} className="delete-btn">Delete</button>
        </div>
      )}
    </div>
  );
};

export default PostDetails;