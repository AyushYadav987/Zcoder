import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from './HomeButton';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <HomeButton />
      <div className='Home'>
        <h1>Welcome To Zcoder</h1>
        <h3>We are your ultimate companion for tracking and enhancing your competitive programming journey.
          With ZCoder, you can effortlessly create and manage contest calendars for top coding platforms like LeetCode, Codeforces, and CodeChef.
          Stay updated with real-time notifications, personalize your profile, and utilize advanced search and filtering options to find the contests that best suit your skill level and interests.
          Join us and take your coding skills to the next level with a seamless, user-friendly, and responsive experience.
        </h3>
      </div>

    </>
  );
};

export default Home;
