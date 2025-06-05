import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo-final1.png';
import './Homebutton.css';

const HomeButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <img src={logo} alt="Logo" className="Logo" onClick={() => navigate('/')} />
      <div className="restdiv">
        {isAuthenticated && (
          <>
            <text 
              onClick={() => navigate('/profile')} 
              className={isActive('/profile') ? 'active' : ''}
            >
              Profile
            </text>
            <text 
              onClick={() => navigate('/Dashboard')} 
              className={isActive('/Dashboard') ? 'active' : ''}
            >
              Dashboard
            </text>
            <text 
              onClick={() => navigate('/add-problem')} 
              className={isActive('/add-problem') ? 'active' : ''}
            >
              Add Problem
            </text>
            <text 
              onClick={() => navigate('/problem-list')} 
              className={isActive('/problem-list') ? 'active' : ''}
            >
              Problem List
            </text>
            <text 
              onClick={() => navigate('/Contest-Calendar')} 
              className={isActive('/Contest-Calendar') ? 'active' : ''}
            >
              Contest-Calendar
            </text>
          </>
        )}
      </div>
      <div className="logindiv">
        {!isAuthenticated ? (
          <>
            <text 
              onClick={() => navigate('/signup')} 
              className={isActive('/signup') ? 'active' : ''}
            >
              Signup
            </text>
            <text 
              onClick={() => navigate('/login')} 
              className={isActive('/login') ? 'active' : ''}
            >
              Login
            </text>
          </>
        ) : (
          <text 
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </text>
        )}
      </div>
    </div>
  );
};

export default HomeButton;
