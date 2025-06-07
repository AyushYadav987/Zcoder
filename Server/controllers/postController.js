const Post = require('../models/postModel');
const { ObjectId } = require('mongodb');
const { getDB } = require('../utils/databaseUtils');

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    
    // Populate author information
    const db = getDB();
    const populatedPosts = await Promise.all(posts.map(async (post) => {
      const author = await db.collection('users').findOne(
        { _id: post.author },
        { projection: { username: 1 } }
      );
      return {
        ...post,
        author: { _id: post.author, username: author?.username || 'Unknown' }
      };
    }));

    res.json(populatedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const post = new Post(title, content, req.user._id, tags);
    const newPost = await post.save();

    // Populate author information
    const db = getDB();
    const author = await db.collection('users').findOne(
      { _id: new ObjectId(req.user._id) },
      { projection: { username: 1 } }
    );

    res.status(201).json({
      ...newPost,
      author: { _id: req.user._id, username: author?.username || 'Unknown' }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Populate author and comment user information
    const db = getDB();
    const author = await db.collection('users').findOne(
      { _id: post.author },
      { projection: { username: 1 } }
    );

    const populatedComments = await Promise.all(post.comments.map(async (comment) => {
      const user = await db.collection('users').findOne(
        { _id: comment.user },
        { projection: { username: 1 } }
      );
      return {
        ...comment,
        user: { _id: comment.user, username: user?.username || 'Unknown' }
      };
    }));

    res.json({
      ...post,
      author: { _id: post.author, username: author?.username || 'Unknown' },
      comments: populatedComments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, tags } = req.body;
    post.title = title;
    post.content = content;
    post.tags = tags;
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const deleted = await Post.deleteById(req.params.id);
    if (deleted) {
      res.json({ message: 'Post deleted' });
    } else {
      res.status(500).json({ message: 'Failed to delete post' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { post, error } = await Post.incrementLikes(req.params.id, req.user._id);
    
    if (error) {
      return res.status(400).json({ message: error });
    }

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Check if user has liked a post
exports.hasUserLiked = async (req, res) => {
  try {
    const hasLiked = await Post.hasUserLiked(req.params.id, req.user._id);
    res.json({ hasLiked });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    // Get user information first
    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user._id) },
      { projection: { username: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = await Post.addComment(
      req.params.id,
      req.user._id,
      user.username,
      req.body.text
    );

    if (!comment) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 