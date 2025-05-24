import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const TakeExam = () => {
    const { id } = useParams();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExam = async () => {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            try {
                const res = await axios.get(`http://localhost:5028/api/exam/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const selected = res.data.find(e => e.id.toString() === id);
                setExam(selected);
            } catch (err) {
                console.error('Failed to load exam.');
            }
        };
        fetchExam();
    }, [id]);

    const handleChange = (questionId, optionId) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        const studentId = JSON.parse(localStorage.getItem('user'))?.id;
        const token = JSON.parse(localStorage.getItem('user'))?.token;

        const payload = {
            examId: parseInt(id),
            answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({
                questionId: parseInt(questionId),
                selectedOptionId
            }))
        };

        try {
            const res = await axios.post(
                `http://localhost:5028/api/studentexam/submit?studentId=${studentId}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setScore(res.data.score);
            setSubmitted(true);
        } catch (err) {
            console.error('Submit failed.', err);
        }
    };

    if (!exam) return <div>Loading exam...</div>;
    if (submitted) return (
        <div className="container mt-5">
            <h3>Exam Submitted!</h3>
            <p>Score: {score} / {exam.questions.length}</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go Back to Dashboard</button>
        </div>
    );

    return (
        <div className="container mt-5">
            <h2>{exam.title}</h2>
            {exam.questions.map((q, idx) => (
                <div key={q.id} className="mb-4">
                    <p><strong>{idx + 1}. {q.text}</strong></p>
                    {q.options.map(o => (
                        <div key={o.id}>
                            <input
                                type="radio"
                                name={`question-${q.id}`}
                                value={o.id}
                                onChange={() => handleChange(q.id, o.id)}
                                checked={answers[q.id] === o.id}
                            />
                            <label className="ms-2">{o.text}</label>
                        </div>
                    ))}
                </div>
            ))}
            <button className="btn btn-success mt-4" onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default TakeExam;
