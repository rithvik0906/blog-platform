// In frontend/src/redux/postSlice.js

// Async thunk to fetch a single post
export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (postId, { rejectWithValue }) => {
  try {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const res = await axios.get(`${API_BASE}/${postId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// In frontend/src/redux/postSlice.js

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
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const res = await axios.put(`${API_BASE}/${postId}`, postData, config);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

