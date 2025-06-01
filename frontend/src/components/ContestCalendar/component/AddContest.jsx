import React, { useState } from 'react';
import './AddContest.css';

const AddContest = ({ onAddContest }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [link, setLink] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddContest({ name, date, link });
        setName('');
        setDate('');
        setLink('');
    };

    return (
        <form onSubmit={handleSubmit} className="add-contest-form">
            <input type="text" value={name} placeholder="Contest Name" onChange={(e) => setName(e.target.value)} required />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <input type="text" value={link} placeholder="Contest Link" onChange={(e) => setLink(e.target.value)} required />
            <button type="submit">Add Contest</button>
        </form>
    );
};

export default AddContest;