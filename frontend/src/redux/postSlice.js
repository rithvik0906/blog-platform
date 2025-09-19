
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to like a post
export const likePost = createAsyncThunk('posts/likePost', async (postId, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`, {}, config);
    return { postId, likes: res.data.likes };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Async thunk to unlike a post
export const unlikePost = createAsyncThunk('posts/unlikePost', async (postId, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/unlike`, {}, config);
    return { postId, likes: res.data.likes };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const initialState = {
  posts: [],
  myPosts: [],
  currentPost: null,
  loading: false,
  error: null,
};
// Async thunk to fetch posts created by the logged-in user
export const fetchMyPosts = createAsyncThunk('posts/fetchMyPosts', async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/mine`, config);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Async thunk to fetch all posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {
  try {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Async thunk to create a new post
export const createPost = createAsyncThunk('posts/createPost', async (postData, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts`, postData, config);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Async thunk to delete a post
export const deletePost = createAsyncThunk('posts/deletePost', async (postId, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };
  await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, config);
    return postId;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Async thunk to fetch a single post by ID
export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (postId, { rejectWithValue }) => {
  try {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Async thunk to update a post
export const updatePost = createAsyncThunk('posts/updatePost', async ({ postId, postData }, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    };
  const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, postData, config);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || 'Failed to fetch posts';
      })
      .addCase(fetchMyPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.myPosts = action.payload;
        state.error = null;
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || 'Failed to fetch your posts';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.myPosts = state.myPosts.filter((post) => post._id !== action.payload);
      })
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.currentPost = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
        state.error = null;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || 'Failed to fetch post';
        state.currentPost = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        // Update the post in posts array
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
        state.myPosts = state.myPosts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
        state.currentPost = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload.postId ? { ...post, likes: [...(post.likes || []), 'liked'] } : post
        );
        state.myPosts = state.myPosts.map((post) =>
          post._id === action.payload.postId ? { ...post, likes: [...(post.likes || []), 'liked'] } : post
        );
        if (state.currentPost && state.currentPost._id === action.payload.postId) {
          state.currentPost.likes = [...(state.currentPost.likes || []), 'liked'];
        }
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload.postId ? { ...post, likes: (post.likes || []).filter((l, i) => i < action.payload.likes) } : post
        );
        state.myPosts = state.myPosts.map((post) =>
          post._id === action.payload.postId ? { ...post, likes: (post.likes || []).filter((l, i) => i < action.payload.likes) } : post
        );
        if (state.currentPost && state.currentPost._id === action.payload.postId) {
          state.currentPost.likes = (state.currentPost.likes || []).filter((l, i) => i < action.payload.likes);
        }
      });
  },
});

export default postSlice.reducer;
// Remove duplicate export