const { getDB } = require('../utils/databaseUtils');
const { ObjectId } = require('mongodb');

class Post {
  constructor(title, content, author, tags = []) {
    this.title = title;
    this.content = content;
    this.author = new ObjectId(author);
    this.tags = tags;
    this.likes = 0;
    this.likedBy = []; // Array of user IDs who liked the post
    this.comments = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    const db = getDB();
    if (this._id) {
      // Update existing post
      this.updatedAt = new Date();
      const result = await db.collection('posts').updateOne(
        { _id: this._id },
        { $set: this }
      );
      return result;
    } else {
      // Create new post
      const result = await db.collection('posts').insertOne(this);
      this._id = result.insertedId;
      return this;
    }
  }

  static async findById(postId) {
    const db = getDB();
    try {
      const post = await db.collection('posts').findOne({ 
        _id: new ObjectId(postId) 
      });
      return post;
    } catch (error) {
      console.error('Error finding post by id:', error);
      return null;
    }
  }

  static async findAll() {
    const db = getDB();
    try {
      const posts = await db.collection('posts')
        .find()
        .sort({ createdAt: -1 })
        .toArray();

      // Populate author information for each post
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

      return populatedPosts;
    } catch (error) {
      console.error('Error finding all posts:', error);
      return [];
    }
  }

  static async deleteById(postId) {
    const db = getDB();
    try {
      const result = await db.collection('posts').deleteOne({
        _id: new ObjectId(postId)
      });
      return result.deletedCount === 1;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }

  static async addComment(postId, userId, username, text) {
    const db = getDB();
    const comment = {
      _id: new ObjectId(),
      user: {
        _id: new ObjectId(userId),
        username: username
      },
      text,
      createdAt: new Date()
    };

    try {
      const result = await db.collection('posts').updateOne(
        { _id: new ObjectId(postId) },
        { 
          $push: { comments: comment },
          $set: { updatedAt: new Date() }
        }
      );
      return result.modifiedCount === 1 ? comment : null;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  }

  static async incrementLikes(postId, userId) {
    const db = getDB();
    try {
      // First check if user has already liked the post
      const post = await db.collection('posts').findOne({
        _id: new ObjectId(postId),
        likedBy: new ObjectId(userId)
      });

      if (post) {
        return { error: 'You have already liked this post' };
      }

      // If not liked, increment likes and add user to likedBy array
      const result = await db.collection('posts').updateOne(
        { _id: new ObjectId(postId) },
        { 
          $inc: { likes: 1 },
          $push: { likedBy: new ObjectId(userId) },
          $set: { updatedAt: new Date() }
        }
      );

      if (result.modifiedCount === 1) {
        const updatedPost = await this.findById(postId);
        return { post: updatedPost };
      }
      return { error: 'Post not found' };
    } catch (error) {
      console.error('Error incrementing likes:', error);
      return { error: 'Failed to like post' };
    }
  }

  static async hasUserLiked(postId, userId) {
    const db = getDB();
    try {
      const post = await db.collection('posts').findOne({
        _id: new ObjectId(postId),
        likedBy: new ObjectId(userId)
      });
      return !!post;
    } catch (error) {
      console.error('Error checking if user liked post:', error);
      return false;
    }
  }
}

module.exports = Post; 