import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
import HomeButton from '../Home/HomeButton';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = {
        username,
        password,
      };

      // Include profile information if provided
      const response = await axios.post('http://localhost:3000/users/login', loginData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log('Login successful. Token stored in local storage.');
      setWelcomeMessage(`Welcome, ${username}!`);
      setTimeout(() => {
        navigate('/'); // Redirect to the home page or any other page
      }, 1000); // 2-second delay to show the welcome message
    } catch (error) {
      setError('Invalid username or password.');
      console.error(error);
    }
  };

  return (
    <div>
      <HomeButton />
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        {welcomeMessage && <p className="welcome">{welcomeMessage}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
