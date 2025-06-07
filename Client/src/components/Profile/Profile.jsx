import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeButton from '../Home/HomeButton';
import './profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    favoriteLanguage: '',
    codeforcesUsername: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [codeforcesRating, setCodeforcesRating] = useState(null);
  const [ratingError, setRatingError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3000/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        setProfile({
          username: response.data.username || '',
          favoriteLanguage: response.data.favoriteLanguage || '',
          codeforcesUsername: response.data.codeforcesUsername || ''
        });

        if (response.data.codeforcesUsername) {
          fetchCodeforcesRating(response.data.codeforcesUsername);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const fetchCodeforcesRating = async (username) => {
    try {
      setRatingError('');
      const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
      if (response.data.status === 'OK' && response.data.result.length > 0) {
        setCodeforcesRating(response.data.result[0].rating || 'Unrated');
      } else {
        setRatingError('User not found');
        setCodeforcesRating(null);
      }
    } catch (error) {
      setRatingError('Error fetching Codeforces rating');
      setCodeforcesRating(null);
      console.error('Error fetching Codeforces rating:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (profile.codeforcesUsername) {
        await fetchCodeforcesRating(profile.codeforcesUsername);
      }
      const response = await axios.put('http://localhost:3000/profile', profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsEditing(false);
      setProfile(prev => ({
        ...prev,
        ...response.data
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <HomeButton />
        <div className="profile-container">
          <div className="profile-card loading">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HomeButton />
      <div className="profile-container">
        {!isEditing ? (
          <div className="profile-card">
            <h2>Profile</h2>
            <div className="profile-info">
              <div className="info-item">
                <label>Username</label>
                <span>{profile.username}</span>
              </div>
              <div className="info-item">
                <label>Favorite Language</label>
                <span>{profile.favoriteLanguage || 'Not set'}</span>
              </div>
              <div className="info-item">
                <label>Codeforces Username</label>
                <span>{profile.codeforcesUsername || 'Not set'}</span>
              </div>
              {codeforcesRating && (
                <div className="info-item">
                  <label>Codeforces Rating</label>
                  <span className="codeforces-rating">{codeforcesRating}</span>
                </div>
              )}
              {ratingError && (
                <p className="error-message">{ratingError}</p>
              )}
            </div>
            <button 
              className="edit-button" 
              onClick={() => setIsEditing(true)} 
              disabled={isLoading}
            >
              <span className="button-icon">✏️</span>
              {isLoading ? 'Loading...' : 'Edit Profile'}
            </button>
          </div>
        ) : (
          <form className="profile-card edit-form" onSubmit={handleSubmit}>
            <h2>Edit Profile</h2>
            <div className="form-group">
              <label>Favorite Language</label>
              <input
                type="text"
                name="favoriteLanguage"
                placeholder="Enter your favorite programming language"
                value={profile.favoriteLanguage}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label>Codeforces Username</label>
              <input
                type="text"
                name="codeforcesUsername"
                placeholder="Enter your Codeforces handle"
                value={profile.codeforcesUsername}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="button-group">
              <button 
                type="submit" 
                className="save-button"
                disabled={isLoading}
              >
                <span className="button-icon">💾</span>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setIsEditing(false)} 
                disabled={isLoading}
              >
                <span className="button-icon">❌</span>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
