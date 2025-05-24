import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateExam = () => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([
        { text: '', marks: 1, options: ['', '', '', ''], correctIndex: 0 }
    ]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            { text: '', marks: 1, options: ['', '', '', ''], correctIndex: 0 }
        ]);
    };

    const handleQuestionChange = (index, key, value) => {
        const updated = [...questions];
        updated[index][key] = key === 'marks' ? parseInt(value) : value;
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        try {
            await axios.post('http://localhost:5028/api/exam/create', {
                title,
                questions
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Exam created successfully!');
            setTitle('');
            setQuestions([{ text: '', marks: 1, options: ['', '', '', ''], correctIndex: 0 }]);
            setTimeout(() => {
                navigate('/teacher-dashboard'); // Redirect after success
            }, 1000);
        } catch (error) {
            setMessage('Error creating exam.');
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Create Exam</h3>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Exam Title</label>
                    <input
                        className="form-control"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>

                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="card p-3 mb-3">
                        <label>Question {qIndex + 1}</label>
                        <input
                            className="form-control mb-2"
                            value={q.text}
                            onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)}
                            placeholder="Enter question text"
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
                            <div key={oIndex} className="input-group mb-2">
                                <input
                                    className="form-control"
                                    value={opt}
                                    onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    placeholder={`Option ${oIndex + 1}`}
                                    required
                                />
                                <div className="input-group-text">
                                    <input
                                        type="radio"
                                        name={`correct-${qIndex}`}
                                        checked={q.correctIndex === oIndex}
                                        onChange={() => handleQuestionChange(qIndex, 'correctIndex', oIndex)}
                                    />
                                    Correct
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleAddQuestion}
                >
                    Add Question
                </button>
                <button type="submit" className="btn btn-primary">Create Exam</button>
            </form>
        </div>
    );
};

export default CreateExam;
