import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import HomeButton from '../Home/HomeButton';

const Dashboard = () => {
  const [publicQuestions, setPublicQuestions] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/problems/public');
        setPublicQuestions(response.data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch public questions.');
      }
    };

    fetchPublicQuestions();
  }, []);

  const handleCommentChange = (questionId, text) => {
    setCommentTexts(prevState => ({
      ...prevState,
      [questionId]: text
    }));
  };

  const handleCommentSubmit = async (questionId) => {
    try {
      const commentText = commentTexts[questionId];
      const response = await axios.post(
        `http://localhost:3000/problems/${questionId}/comments`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setCommentTexts(prevState => ({
        ...prevState,
        [questionId]: '' // Clear the comment input after submission
      }));
      // Optionally, fetch the updated public questions list here to reflect the new comment
      const updatedQuestions = publicQuestions.map((question) => {
        if (question._id === questionId) {
          return { ...question, comments: [...question.comments, response.data] };
        }
        return question;
      });
      setPublicQuestions(updatedQuestions);
    } catch (error) {
      console.error(error);
      setError('Failed to submit comment.');
    }
  };

  return (
    <>
      <HomeButton />
      <div className="dashboard-container">
      <h2>Public Questions</h2>
        {error && <p className="error">{error}</p>}
        <ul className='Box1'>
          {publicQuestions.map((question) => (
            <li key={question._id} className="question-item">
              <h3>{question.question}</h3>
              <p>{question.answer}</p>
              <p><strong>Privacy:</strong> {question.isPublic ? 'Public' : 'Private'}</p>
              <ul>
                {question.comments && question.comments.map((comment) => (
                  <li key={comment._id}>{comment.text}</li>
                ))}
              </ul>
              <input
                type="text"
                value={commentTexts[question._id] || ''}
                onChange={(e) => handleCommentChange(question._id, e.target.value)}
                placeholder="Add a comment"
              />
              <button onClick={() => handleCommentSubmit(question._id)}>Submit Comment</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
