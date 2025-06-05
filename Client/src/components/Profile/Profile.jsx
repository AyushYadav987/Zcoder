import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeButton from '../Home/HomeButton';
import './profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    techStack: '',
    competitiveRating: '',
    favoriteLanguage: '',
    codeforcesUsername: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [codeforcesRating, setCodeforcesRating] = useState(null);
  const [ratingError, setRatingError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(response.data);
        if (response.data.codeforcesUsername) {
          fetchCodeforcesRating(response.data.codeforcesUsername);
        }
      } catch (error) {
        console.error(error);
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
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profile.codeforcesUsername) {
        await fetchCodeforcesRating(profile.codeforcesUsername);
      }
      const response = await axios.put('http://localhost:3000/profile', profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsEditing(false);
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <HomeButton />
      {!isEditing ? (
        <div className='profile-class'>
          <h2>Profile</h2>
          <p>Username: <span style={{ marginLeft: '50px' }}>{profile.username}</span></p>
          <p>Tech Stack: <span style={{ marginLeft: '50px' }}>{profile.techStack}</span></p>
          <p>Competitive Rating: <span style={{ marginLeft: '50px' }}>{profile.competitiveRating}</span></p>
          <p>Favorite Language: <span style={{ marginLeft: '50px' }}>{profile.favoriteLanguage}</span></p>
          <p>Codeforces Username: <span style={{ marginLeft: '50px' }}>{profile.codeforcesUsername}</span></p>
          {codeforcesRating && (
            <p>Codeforces Rating: <span style={{ marginLeft: '50px', color: '#43A047' }}>{codeforcesRating}</span></p>
          )}
          {ratingError && (
            <p className="error-message">{ratingError}</p>
          )}
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      ) : (
        <form className='profile-edit' onSubmit={handleSubmit}>
          <h2>Edit Profile</h2>
          <input
            type="text"
            name="techStack"
            placeholder="Tech Stack"
            value={profile.techStack}
            onChange={handleChange}
          />
          <input
            type="text"
            name="competitiveRating"
            placeholder="Competitive Rating"
            value={profile.competitiveRating}
            onChange={handleChange}
          />
          <input
            type="text"
            name="favoriteLanguage"
            placeholder="Favorite Language"
            value={profile.favoriteLanguage}
            onChange={handleChange}
          />
          <input
            type="text"
            name="codeforcesUsername"
            placeholder="Codeforces Username"
            value={profile.codeforcesUsername}
            onChange={handleChange}
          />
          <button type="submit">Update Profile</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
