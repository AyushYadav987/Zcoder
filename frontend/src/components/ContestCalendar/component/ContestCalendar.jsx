import React from 'react';
import './ContestCalendar.css';

const ContestCalendar = ({ contests }) => {
    return (
        <div className="contest-list">
            {contests.map((contest, index) => (
                <div key={index} className="contest-item">
                    <h3>{contest.name}</h3>
                    <p>{new Date(contest.date).toLocaleDateString()}</p>
                    <a href={contest.link} target="_blank" rel="noopener noreferrer">Contest Link</a>
                </div>
            ))}
        </div>
    );
};

export default ContestCalendar;