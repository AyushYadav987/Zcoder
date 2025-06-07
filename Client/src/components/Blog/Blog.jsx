import React, { useState, useEffect } from 'react';
import './Blog.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HomeButton from '../Home/HomeButton';
import { useAuth } from '../../context/AuthContext';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentText, setCommentText] = useState({});
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/posts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });
      setPosts(response.data);
      
      // Check which posts the user has already liked
      const likedStatus = await Promise.all(
        response.data.map(post => 
          axios.get(`http://localhost:3000/posts/${post._id}/hasLiked`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
          })
        )
      );
      
      const newLikedPosts = new Set();
      likedStatus.forEach((status, index) => {
        if (status.data.hasLiked) {
          newLikedPosts.add(response.data[index]._id);
        }
      });
      setLikedPosts(newLikedPosts);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch posts. ' + (err.response?.data?.message || err.message));
      setLoading(false);
      console.error('Error fetching posts:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      if (likedPosts.has(postId)) {
        return;
      }

      const response = await axios.post(`http://localhost:3000/posts/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });
      
      if (response.data) {
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, likes: response.data.likes } : post
        ));
        setLikedPosts(new Set([...likedPosts, postId]));
      }
    } catch (err) {
      console.error('Error liking post:', err);
      setError('Failed to like post. ' + (err.response?.data?.message || err.message));
    }
  };

  const handleComment = async (postId) => {
    try {
      if (!commentText[postId]?.trim()) {
        return;
      }

      const response = await axios.post(`http://localhost:3000/posts/${postId}/comments`, {
        text: commentText[postId]
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });

      if (response.data) {
        // The comment now includes the user information from the server
        setPosts(posts.map(post =>
          post._id === postId
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        ));
        setCommentText(prev => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. ' + (err.response?.data?.message || err.message));
    }
  };

  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <>
        <HomeButton />
        <div className="blog-container">
          <div className="loading">Loading posts...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HomeButton />
        <div className="blog-container">
          <div className="error">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <HomeButton />
      <div className="blog-container">
        <div className="blog-header">
          <h1>Community Blog</h1>
          <Link to="/create-post" className="create-post-button">
            Create New Post
          </Link>
        </div>

        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <h2>{post.title}</h2>
                <div className="post-meta">
                  <span className="post-author">By {post.author.username}</span>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className={`post-content ${expandedPosts.has(post._id) ? 'expanded' : ''}`}>
                {post.content}
              </p>
              {post.content.length > 150 && (
                <button 
                  className="toggle-content" 
                  onClick={() => togglePostExpansion(post._id)}
                >
                  {expandedPosts.has(post._id) ? 'Show Less' : 'Show More'}
                </button>
              )}
              <div className="post-footer">
                <div className="post-stats">
                  <button 
                    onClick={() => handleLike(post._id)}
                    className={`like-button ${likedPosts.has(post._id) ? 'liked' : ''}`}
                    disabled={likedPosts.has(post._id)}
                  >
                    👍 {post.likes}
                  </button>
                  <span>💬 {post.comments.length}</span>
                </div>
              </div>

              <div className="comments-section">
                <h3>Comments</h3>
                <div className="comments-list">
                  {post.comments.map((comment, index) => (
                    <div key={comment._id || index} className="comment">
                      <div className="comment-header">
                        <span className="comment-author">{comment.user.username}</span>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))}
                </div>
                <div className="add-comment">
                  <textarea
                    value={commentText[post._id] || ''}
                    onChange={(e) => setCommentText(prev => ({ 
                      ...prev, 
                      [post._id]: e.target.value 
                    }))}
                    placeholder="Write a comment..."
                    className="comment-input"
                  />
                  <button 
                    onClick={() => handleComment(post._id)}
                    className="comment-button"
                    disabled={!commentText[post._id]?.trim()}
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="no-posts">
            No posts yet. Be the first to create one!
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
