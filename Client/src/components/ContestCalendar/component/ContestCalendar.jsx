import React from 'react';
import './ContestCalendar.css';

const ContestCalendar = ({ contests }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        }).format(date);
    };

    const getTimeUntil = (dateString) => {
        const contestDate = new Date(dateString);
        const now = new Date();
        const diffTime = contestDate - now;
        
        if (diffTime < 0) return 'Started';
        
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const getContestPlatform = (link) => {
        if (link.includes('codeforces.com')) return 'Codeforces';
        if (link.includes('codechef.com')) return 'CodeChef';
        if (link.includes('atcoder.jp')) return 'AtCoder';
        if (link.includes('leetcode.com')) return 'LeetCode';
        return 'Other';
    };

    return (
        <div className="contest-list">
            {contests.map((contest, index) => (
                <div key={index} className={`contest-item platform-${getContestPlatform(contest.link).toLowerCase()}`}>
                    <div className="contest-header">
                        <span className="platform-tag">{getContestPlatform(contest.link)}</span>
                        <span className="time-until">{getTimeUntil(contest.date)}</span>
                    </div>
                    <h3 className="contest-name">{contest.name}</h3>
                    <p className="contest-date">{formatDate(contest.date)}</p>
                    <a 
                        href={contest.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="contest-link"
                    >
                        View Contest →
                    </a>
                </div>
            ))}
        </div>
    );
};

export default ContestCalendar;