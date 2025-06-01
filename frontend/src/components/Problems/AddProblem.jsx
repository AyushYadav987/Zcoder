import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Problems.css';
import HomeButton from '../Home/HomeButton';

const AddProblem = () => {
  const [problem, setProblem] = useState({
    question: '',
    answer: '',
    isPublic: false,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProblem({
      ...problem,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/problems', problem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log(response.data);
      setSuccessMessage('Problem added successfully! Redirecting to home...');
      setTimeout(() => {
        navigate('/'); // Redirect to the home page after 2 seconds
      }, 2000);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to add problem. Please try again. after refreshing');
    }
  };

  return (
    <div>
            <HomeButton />
    <form className="problem-form" onSubmit={handleSubmit}>
      <h2>Add Problem</h2>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      <textarea
        name="question"
        placeholder="Question"
        value={problem.question}
        onChange={handleChange}
      />
      <textarea
        name="answer"
        placeholder="Answer"
        value={problem.answer}
        onChange={handleChange}
      />
      <label>
        <input
          type="checkbox"
          name="isPublic"
          checked={problem.isPublic}
          onChange={handleChange}
        />
        <p>Make Public</p>
      </label>
      <button type="submit">Save Problem</button>
    </form>
    </div>
  );
};

export default AddProblem;
