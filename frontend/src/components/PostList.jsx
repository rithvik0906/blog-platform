import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../redux/postSlice';
import PostItem from './PostItem';

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  // Ensure posts is always an array before mapping
  const safePosts = Array.isArray(posts) ? posts : [];

  return (
    <div className="post-list">
      {safePosts.length > 0 ? (
        safePosts.map((post) => <PostItem key={post._id} post={post} />)
      ) : (
        <h2>No posts found. Create one!</h2>
      )}
    </div>
  );
};

export default PostList;
