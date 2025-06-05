import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ContestCalendar from './component/ContestCalendar';
import HomeButton from '../Home/HomeButton';
import './Contest.css';
import './component/ContestCalendar.css';

const Contest = () => {
    const [contests, setContests] = useState([]);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addingContest, setAddingContest] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchAllContests();
    }, []);

    const fetchAllContests = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch existing contests
            const [localResponse, externalResponse] = await Promise.all([
                api.get('/api/contests/all'),
                api.get('/api/contests/fetch')
            ]);

            // Combine and deduplicate contests
            const allContests = [...localResponse.data, ...externalResponse.data];
            const uniqueContests = removeDuplicateContests(allContests);
            
            // Sort contests by date
            const sortedContests = uniqueContests.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            setContests(sortedContests);
        } catch (error) {
            console.error('Error fetching contests:', error);
            setError('Failed to fetch contests. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const removeDuplicateContests = (contests) => {
        const seen = new Set();
        return contests.filter(contest => {
            const key = `${contest.name}-${contest.date}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAddingContest(true);
        setError('');
        setSuccessMessage('');

        try {
            if (!name || !date || !link) {
                throw new Error('Please fill in all fields');
            }

            await api.post('/api/contests/add', {
                name,
                date,
                link
            });

            setSuccessMessage('Contest added successfully!');
            await fetchAllContests(); // Refresh the list
            
            // Reset form
            setName('');
            setDate('');
            setLink('');
        } catch (error) {
            console.error('Error adding contest:', error);
            setError(error.response?.data?.message || error.message || 'Failed to add contest');
        } finally {
            setAddingContest(false);
        }
    };

    return (
        <>
            <HomeButton />
            <div className="contest-container">
                <form onSubmit={handleSubmit} className="contest-form">
                    <h2>Add Contest</h2>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    <input
                        type="text"
                        value={name}
                        placeholder="Contest Name"
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={addingContest}
                    />
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        disabled={addingContest}
                    />
                    <input
                        type="url"
                        value={link}
                        placeholder="Contest Link"
                        onChange={(e) => setLink(e.target.value)}
                        required
                        disabled={addingContest}
                    />
                    <button type="submit" disabled={addingContest}>
                        {addingContest ? 'Adding...' : 'Add Contest'}
                    </button>
                </form>

                <div className="contest-list-container">
                    <h2>Contest Calendar</h2>
                    {loading ? (
                        <div className="loading-message">Loading contests...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : contests.length === 0 ? (
                        <div className="no-contests">No upcoming contests found</div>
                    ) : (
                        <ContestCalendar contests={contests} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Contest;