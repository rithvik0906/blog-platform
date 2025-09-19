import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from './components/PostList';
import PostDetails from './components/PostDetails';
import PostForm from './components/PostForm';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import MyPosts from './components/MyPosts';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/create-post" element={<PostForm />} />
          <Route path="/edit-post/:id" element={<PostForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;