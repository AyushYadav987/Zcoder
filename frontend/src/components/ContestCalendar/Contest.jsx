import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContestCalendar from './component/ContestCalendar.jsx';
import HomeButton from '../Home/HomeButton';
import './Contest.css';
import './component/ContestCalendar.css';

const Contest = () => {
    const [contests, setContests] = useState([]);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [link, setLink] = useState('');

    useEffect(() => {
        fetchContests();
        fetchUpcomingContests();
    }, []);

    const fetchContests = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/contests/all');
            setContests(response.data);
        } catch (error) {
            console.error('Error fetching contests:', error.message);
        }
    };

    const fetchUpcomingContests = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/contests/fetch');
            setContests(prevContests => [...prevContests, ...response.data]);
        } catch (error) {
            console.error('Error fetching upcoming contests:', error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/contests/add', {
                name,
                date,
                link
            });
            console.log(response.data);
            fetchContests(); // Refresh contest list after adding
            setName('');
            setDate('');
            setLink('');
        } catch (error) {
            console.error('Error adding contest:', error.message);
        }
    };

    return (
        <>
            <HomeButton />
            <div className="contest-container">

                <form onSubmit={handleSubmit} className="contest-form">
                    <h1>Calender</h1>
                    <input type="text" value={name} placeholder="Contest Name" onChange={(e) => setName(e.target.value)} />
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    <input type="text" value={link} placeholder="Contest Link" onChange={(e) => setLink(e.target.value)} />
                    <button type="submit">Add Contest</button>
                </form>
                <div className='warn'><h1>Contest Calendar</h1>
                    <h3> wait some time for it to load </h3></div>
                <ContestCalendar contests={contests} />
            </div>
        </>
    );
};

export default Contest;