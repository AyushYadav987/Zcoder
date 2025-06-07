import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Problems.css';
import HomeButton from '../Home/HomeButton';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');

  const fetchProblems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/problems', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProblems(response.data);
      setError('');
    } catch (error) {
      console.error(error);
      setError('Failed to fetch problems');
    }
  };

  const handleDelete = async (problemId) => {
    try {
      await axios.delete(`http://localhost:3000/problems/${problemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Update the UI by removing the deleted problem
      setProblems(problems.filter(problem => problem._id !== problemId));
      setError('');
    } catch (error) {
      console.error(error);
      setError('Failed to delete problem');
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
        {error && <div className="error-message">{error}</div>}
        {problems.map((problem) => (
          <div key={problem._id} className="problem-item">
            <div className="problem-content">
              <p>Question:<span className="problem-text"> {problem.question}</span></p>
              <p>Answer:<span className="problem-text"> {problem.answer}</span></p>
              <p>Privacy:<span className="problem-text"> {problem.isPublic ? 'Public' : 'Private'}</span></p>
            </div>
            <button 
              onClick={() => handleDelete(problem._id)}
              className="delete-button"
              aria-label="Delete problem"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProblemList;
