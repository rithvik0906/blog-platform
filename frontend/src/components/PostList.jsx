import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../redux/postSlice';
import PostItem from './PostItem'; // We will create this component next

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="post-list">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))
      ) : (
        <h2>No posts found. Create one!</h2>
      )}
    </div>
  );
};

export default PostList;