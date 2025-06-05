import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Problems.css';
import HomeButton from '../Home/HomeButton';
const ProblemList = () => {
  const [problems, setProblems] = useState([]);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/problems', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProblems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <>
      <HomeButton />
    <div className="problem-list">
      <h2>Your Problems</h2>
      {problems.map((problem) => (
        <div key={problem._id} className="problem-item">
          <p>Question:<span style={{ marginLeft: '30px' }}> {problem.question}</span></p>
          <p>Answer:<span style={{ marginLeft: '30px' }}> {problem.answer}</span></p>
          <p>Privacy:<span style={{ marginLeft: '30px' }}> {problem.isPublic ? 'Public' : 'Private'}</span></p>
        </div>
      ))}
    </div>
    </>
  );
};

export default ProblemList;
