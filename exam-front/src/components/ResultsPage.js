import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


const ResultsPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const studentId = JSON.parse(localStorage.getItem('user'))?.id;
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await axios.get(`http://localhost:5028/api/studentexam/results/${studentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(res.data);
            } catch (err) {
                console.error('Error fetching results.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [studentId, token]);

    if (loading) return <div>Loading results...</div>;

    return (
        <div className="container mt-5">
            <h2>Exam Results</h2>
            <ul className="list-group mt-3">
                {results.map((r, i) => (
                    <li key={i} className="list-group-item">
                        <strong>{r.title}</strong> - Score: {r.score} - Submitted At: {new Date(r.submittedAt).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResultsPage;
