import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPosts, deletePost, likePost, unlikePost } from '../redux/postSlice';

const MyPosts = () => {
  const dispatch = useDispatch();
  const { myPosts, loading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMyPosts());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  const handleLike = (post) => {
    if (!user) return;
    if (post.likes && post.likes.includes(user._id)) {
      dispatch(unlikePost(post._id));
    } else {
      dispatch(likePost(post._id));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="my-posts">
      <h2>My Posts</h2>
      {myPosts && myPosts.length > 0 ? (
        myPosts.map((post) => {
          const isOwnPost = user && post.author && (
            (typeof post.author === 'object' && (post.author._id === user._id || post.author._id === user.id)) ||
            (typeof post.author === 'string' && (post.author === user._id || post.author === user.id))
          );
          return (
            <div key={post._id} className="post-item" style={{ position: 'relative', marginBottom: '2rem', border: '1px solid #eee', borderRadius: '8px', padding: '1rem' }}>
              {post.image && (
                <img src={`https://blog-platform-hexb.onrender.com${post.image}`} alt="Post" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
              )}
              <h3>{post.title}</h3>
              <p>by {typeof post.author === 'object' ? post.author.name : 'You'}</p>
              <p>{post.content.substring(0, 100)}...</p>
              <a href={`/posts/${post._id}`}>Read More</a>
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={() => handleLike(post)}
                  style={{ background: post.likes && user && post.likes.includes(user._id) ? '#e67e22' : '#eee', color: post.likes && user && post.likes.includes(user._id) ? '#fff' : '#333', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer', fontSize: '1rem' }}
                  disabled={!user}
                >
                  {post.likes && user && post.likes.includes(user._id) ? 'Unlike' : 'Like'}
                </button>
                <span style={{ fontWeight: 500, fontSize: '1rem' }}>Likes: {post.likes ? post.likes.length : 0}</span>
              </div>
              {isOwnPost && (
                <div style={{ display: 'flex', gap: '0.5rem', position: 'absolute', top: '1rem', right: '1rem' }}>
                  <a
                    href={`/edit-post/${post._id}`}
                    style={{ background: '#3498db', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer', textDecoration: 'none', fontSize: '1rem' }}
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(post._id)}
                    style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer', fontSize: '1rem' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p>You have not created any posts yet.</p>
      )}
    </div>
  );
};

export default MyPosts;
