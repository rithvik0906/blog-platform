// frontend/src/components/PostForm.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createPost, updatePost, fetchPostById } from '../redux/postSlice';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPost } = useSelector((state) => state.posts);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [image, setImage] = useState(null);

  const isEditing = id !== undefined;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchPostById(id));
    }
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && currentPost) {
      setFormData({
        title: currentPost.title,
        content: currentPost.content,
        tags: currentPost.tags.join(', '),
      });
    }
  }, [currentPost, isEditing]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('content', formData.content);
    form.append('tags', formData.tags);
    if (image) {
      form.append('image', image);
    }

    if (isEditing) {
      // For editing, you may need to update backend to handle image update
      dispatch(updatePost({ postId: id, postData: form })).then(() => {
        navigate(`/posts/${id}`);
      });
    } else {
      dispatch(createPost(form)).then(() => {
        navigate('/');
      });
    }
  };

  return (
    <div className="post-form-container">
      <h2>{isEditing ? 'Edit Post' : 'Create Post'}</h2>
  <form onSubmit={onSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={onChange}
          required
        />
        <textarea
          placeholder="Content"
          name="content"
          value={formData.content}
          onChange={onChange}
          rows="10"
          required
        ></textarea>
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          name="tags"
          value={formData.tags}
          onChange={onChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          style={{ marginBottom: '1rem' }}
        />
        <button type="submit">
          {isEditing ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;