import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-final1.png';
import './Homebutton.css';

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <img src={logo} alt="Logo" className="Logo" onClick={() => navigate('/')} />
      <div className="restdiv">
        <text onClick={() => navigate('/profile')}>Profile</text>
        <text onClick={() => navigate('/Dashboard')}>Dashboard</text>
        <text onClick={() => navigate('/add-problem')}>Add Problem</text>
        <text onClick={() => navigate('/problem-list')}>Problem List</text>
        <text onClick={() => navigate('/Contest-Calendar')}>Contest-Calendar</text>
      </div>
      <div className="logindiv">
        <text onClick={() => navigate('/signup')}>Signup</text>
        <text onClick={() => navigate('/login')}>Login</text>
      </div>
    </div>
  );
};

export default HomeButton;
