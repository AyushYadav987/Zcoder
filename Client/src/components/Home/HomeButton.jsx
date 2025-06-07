import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../images/zcoder_logo.svg';
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
      <img src={logo} alt="Logo" className="Logo" onClick={() => navigate('/profile')} />
      <div className="restdiv">
        {isAuthenticated && (
          <>
            <span 
              onClick={() => navigate('/Blog')} 
              className={isActive('/Blog') ? 'active' : ''}
            >
              Blog
            </span>
            <span 
              onClick={() => navigate('/add-problem')} 
              className={isActive('/add-problem') ? 'active' : ''}
            >
              Add a Problem
            </span>
            <span 
              onClick={() => navigate('/problems')} 
              className={isActive('/problems') ? 'active' : ''}
            >
              Problem List
            </span>
            <span 
              onClick={() => navigate('/UpcommingContest')} 
              className={isActive('/UpcommingContest') ? 'active' : ''}
            >
              Upcomming Contests
            </span>
            <span 
              onClick={() => navigate('/code-editor')} 
              className={isActive('/code-editor') ? 'active' : ''}
            >
              Code Editor
            </span>
          </>
        )}
      </div>
      <div className="logindiv">
        {!isAuthenticated ? (
          <>
            <span 
              onClick={() => navigate('/signup')} 
              className={isActive('/signup') ? 'active' : ''}
            >
              Signup
            </span>
            <span 
              onClick={() => navigate('/login')} 
              className={isActive('/login') ? 'active' : ''}
            >
              Login
            </span>
          </>
        ) : (
          <span 
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </span>
        )}
      </div>
    </div>
  );
};

export default HomeButton;
