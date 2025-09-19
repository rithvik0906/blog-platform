
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Import your auth middleware
const BlogPost = require('../models/BlogPost'); // Import the BlogPost model
const User = require('../models/User'); // Import the User model to populate author details
const upload = require('../middleware/uploadMiddleware');

// @route   POST /api/posts/:id/like
// @desc    Like a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    // Check if user already liked
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.push(req.user.id);
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/posts/:id/unlike
// @desc    Unlike a post
// @access  Private
router.post('/:id/unlike', auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    // Check if user has liked
    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Post not liked yet' });
    }
    post.likes = post.likes.filter((uid) => uid.toString() !== req.user.id);
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts/mine
// @desc    Get all posts created by the logged-in user
// @access  Private
router.get('/mine', auth, async (req, res) => {
  try {
    const posts = await BlogPost.find({ author: req.user.id }).populate('author', ['name', 'profilePicture']);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/posts
// @desc    Create a new blog post with optional image upload
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author: req.user.id,
    };
    if (req.file) {
      postData.image = `/uploads/${req.file.filename}`;
    }
    const newPost = new BlogPost(postData);
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().populate('author', ['name', 'profilePicture']);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts/:id
// @desc    Get a single blog post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', ['name', 'profilePicture']);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a blog post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the user is the owner of the post
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a blog post
// @access  Private
const fs = require('fs');
const path = require('path');

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the user is the owner of the post
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Delete image file if exists
    if (post.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', path.basename(post.image));
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err.message);
        }
      });
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Post and image removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;