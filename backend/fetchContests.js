const axios = require('axios');

const fetchCodeforcesContests = async () => {
    try {
        const response = await axios.get('https://codeforces.com/api/contest.list');
        const contests = response.data.result.filter(contest => contest.phase === 'BEFORE');
        return contests.map(contest => ({
            name: contest.name,
            date: new Date(contest.startTimeSeconds * 1000),
            link: `https://codeforces.com/contests/${contest.id}`
        }));
    } catch (error) {
        console.error('Error fetching Codeforces contests:', error);
        return [];
    }
};

const fetchCodeChefContests = async () => {
    try {
        const response = await axios.get('https://www.codechef.com/api/list/contests/all');
        const contests = response.data.future_contests;
        return contests.map(contest => ({
            name: contest.contest_name,
            date: new Date(contest.contest_start_date_iso),
            link: contest.contest_code ? `https://www.codechef.com/${contest.contest_code}` : ''
        }));
    } catch (error) {
        console.error('Error fetching CodeChef contests:', error);
        return [];
    }
};

const fetchAtCoderContests = async () => {
    try {
        const response = await axios.get('https://kenkoooo.com/atcoder/resources/contests.json');
        const contests = response.data.contests;
        return contests.map(contest => ({
            name: contest.title,
            date: new Date(contest.start_time * 1000),
            link: `https://atcoder.jp/contests/${contest.id}`
        }));
    } catch (error) {
        console.error('Error fetching AtCoder contests:', error);
        return [];
    }
};

const fetchLeetCodeContests = async () => {
    try {
        const response = await axios.get('https://leetcode.com/contest/api/list/');
        const contests = response.data.contests;
        return contests.map(contest => ({
            name: contest.title,
            date: new Date(contest.start_time * 1000),
            link: `https://leetcode.com/contest/${contest.title_slug}`
        }));
    } catch (error) {
        console.error('Error fetching LeetCode contests:', error);
        return [];
    }
};

const fetchAllContests = async () => {
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const [codeforces, codechef, atcoder, leetcode] = await Promise.all([
        fetchCodeforcesContests(),
        fetchCodeChefContests(),
        fetchAtCoderContests(),
        fetchLeetCodeContests()
    ]);

    const allContests = [...codeforces, ...codechef, ...atcoder, ...leetcode];
    return allContests.filter(contest => contest.date <= oneMonthFromNow);
};

module.exports = fetchAllContests;