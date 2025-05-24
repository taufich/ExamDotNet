import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateExam = () => {
    const { id } = useParams();
    const [exam, setExam] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExam = async () => {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            try {
                const response = await axios.get('http://localhost:5028/api/exam/list', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const foundExam = response.data.find(e => e.id === parseInt(id));
                if (foundExam) {
                    setExam({
                        ...foundExam,
                        questions: foundExam.questions.map(q => ({
                            ...q,
                            marks: q.marks || 1 // default if missing
                        }))
                    });
                }
            } catch {
                setMessage('Failed to fetch exam.');
            }
        };
        fetchExam();
    }, [id]);

    const handleQuestionChange = (qIndex, key, value) => {
        const updated = { ...exam };
        updated.questions[qIndex][key] = key === 'marks' ? parseInt(value) : value;
        setExam(updated);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updated = { ...exam };
        updated.questions[qIndex].options[oIndex].text = value;
        setExam(updated);
    };

    const handleCorrectOptionChange = (qIndex, optionId) => {
        const updated = { ...exam };
        updated.questions[qIndex].correctOptionId = optionId;
        setExam(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const dto = {
            title: exam.title,
            questions: exam.questions.map(q => ({
                id: q.id,
                text: q.text,
                marks: q.marks,
                correctIndex: q.options.findIndex(o => o.id === q.correctOptionId),
                options: q.options.map(o => ({ id: o.id, text: o.text }))
            }))
        };
        try {
            await axios.put(`http://localhost:5028/api/exam/update/${id}`, dto, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Exam updated successfully!');
            setTimeout(() => {
                navigate('/teacher-dashboard'); // Redirect after success
            }, 1000);
        } catch {
            setMessage('Error updating exam.');
        }
    };

    if (!exam) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h3>Update Exam</h3>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Exam Title</label>
                    <input
                        className="form-control"
                        value={exam.title}
                        onChange={e => setExam({ ...exam, title: e.target.value })}
                        required
                    />
                </div>

                {exam.questions.map((q, qIndex) => (
                    <div key={q.id || qIndex} className="card p-3 mb-3">
                        <label>Question {qIndex + 1}</label>
                        <input
                            className="form-control mb-2"
                            value={q.text}
                            onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)}
                            required
                        />
                        <div className="mb-2">
                            <label>Marks</label>
                            <input
                                type="number"
                                className="form-control"
                                value={q.marks}
                                min="1"
                                onChange={e => handleQuestionChange(qIndex, 'marks', e.target.value)}
                                required
                            />
                        </div>

                        {q.options.map((opt, oIndex) => (
                            <div key={opt.id || oIndex} className="input-group mb-2">
                                <input
                                    className="form-control"
                                    value={opt.text}
                                    onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    required
                                />
                                <div className="input-group-text">
                                    <input
                                        type="radio"
                                        name={`correct-${qIndex}`}
                                        checked={q.correctOptionId === opt.id}
                                        onChange={() => handleCorrectOptionChange(qIndex, opt.id)}
                                    />
                                    Correct
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                <button type="submit" className="btn btn-primary">Update Exam</button>
            </form>
        </div>
    );
};

export default UpdateExam;
