import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const SDashboard = () => {
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('exams');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;
    const studentId = user?.id;

    // Check role on mount
    useEffect(() => {
        if (!user || user.role?.toLowerCase() !== 'student') {
            localStorage.removeItem('user');
            navigate('/login');
        }
    }, [user, navigate]);

    // Fetch exams
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get('http://localhost:5028/api/exam/list', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExams(response.data);
            } catch (err) {
                setError('Failed to load exams. Please login again.');
                if (err.response?.status === 401) {
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, [navigate, token]);

    useEffect(() => {
        fetchResults();
        // eslint-disable-next-line
    }, []);

    // Fetch results
    const fetchResults = async () => {
        try {
            const res = await axios.get(`http://localhost:5028/api/studentexam/results/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(res.data);
        } catch (err) {
            setError('Failed to load results.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const goToExam = (examId) => {
        navigate(`/exam/${examId}`);
    };

    const customStyles = `
        .dashboard-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .navbar-custom {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            padding: 1rem 0;
        }

        .navbar-brand {
            font-weight: 700;
            font-size: 1.5rem;
            color: #2c3e50 !important;
            text-decoration: none;
        }

        .nav-link-custom {
            color: #2c3e50 !important;
            font-weight: 500;
            margin: 0 0.5rem;
            padding: 0.5rem 1rem !important;
            border-radius: 25px;
            transition: all 0.3s ease;
            border: none;
            background: none;
            text-decoration: none;
        }

        .nav-link-custom:hover {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea !important;
            transform: translateY(-1px);
        }

        .btn-logout {
            background: linear-gradient(45deg, #ff6b6b, #ee5a52);
            border: none;
            color: white;
            font-weight: 500;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            transition: all 0.3s ease;
        }

        .btn-logout:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(238, 90, 82, 0.4);
            color: white;
        }

        .main-content {
            padding: 2rem 0;
        }

        .dashboard-header {
            text-align: center;
            margin-bottom: 3rem;
            color: white;
        }

        .dashboard-title {
            font-size: 3rem;
            font-weight: 300;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .dashboard-subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            font-weight: 300;
        }

        .tabs-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 50px;
            padding: 0.5rem;
            margin-bottom: 2rem;
            display: inline-flex;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .tab-custom {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            padding: 0.75rem 2rem;
            border-radius: 25px;
            transition: all 0.3s ease;
            font-weight: 500;
            margin: 0 0.25rem;
        }

        .tab-custom.active {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .tab-custom:hover {
            background: rgba(255, 255, 255, 0.15);
            color: white;
            transform: translateY(-1px);
        }

        .content-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .content-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .card-header-custom {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 1.5rem;
            border: none;
        }

        .card-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
        }

        .table-container {
            padding: 2rem;
        }

        .table-custom {
            border: none;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .table-custom thead th {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border: none;
            font-weight: 600;
            color: #2c3e50;
            padding: 1rem;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
        }

        .table-custom tbody td {
            border: none;
            padding: 1rem;
            vertical-align: middle;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .table-custom tbody tr {
            transition: all 0.3s ease;
        }

        .table-custom tbody tr:hover {
            background: rgba(102, 126, 234, 0.05);
            transform: translateX(5px);
        }

        .btn-take-exam {
            background: linear-gradient(45deg, #00b894, #00a085);
            border: none;
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            font-weight: 500;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }

        .btn-take-exam:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 184, 148, 0.4);
            color: white;
        }

        .score-badge {
            background: linear-gradient(45deg, #fdcb6e, #e17055);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            display: inline-block;
        }

        .score-excellent {
            background: linear-gradient(45deg, #00b894, #00a085);
        }

        .score-good {
            background: linear-gradient(45deg, #fdcb6e, #f39c12);
        }

        .score-fair {
            background: linear-gradient(45deg, #fd79a8, #e84393);
        }

        .empty-state {
            padding: 3rem;
            text-align: center;
            color: #6c757d;
        }

        .empty-state-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.3;
        }

        .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 3rem;
        }

        .custom-spinner {
            width: 3rem;
            height: 3rem;
            border: 3px solid rgba(102, 126, 234, 0.3);
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .alert-custom {
            border: none;
            border-radius: 15px;
            padding: 1rem 1.5rem;
            margin-bottom: 2rem;
            background: rgba(220, 53, 69, 0.1);
            border-left: 4px solid #dc3545;
            color: #721c24;
        }

        .footer-custom {
            background: rgba(44, 62, 80, 0.95);
            backdrop-filter: blur(10px);
            color: rgba(255, 255, 255, 0.8);
            padding: 1.5rem 0;
            margin-top: auto;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 1.5rem;
            text-align: center;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            opacity: 0.8;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .dashboard-title {
                font-size: 2rem;
            }
            
            .tabs-container {
                flex-direction: column;
                border-radius: 15px;
            }
            
            .tab-custom {
                margin: 0.25rem 0;
                text-align: center;
            }
            
            .table-container {
                padding: 1rem;
            }
            
            .btn-take-exam {
                padding: 0.4rem 1rem;
                font-size: 0.8rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    `;

    const getScoreClass = (percentage) => {
        const numScore = parseInt(percentage);
        if (numScore >= 80) return 'score-excellent';
        if (numScore >= 60) return 'score-good';
        return 'score-fair';
    };

    return (
        <>
            <style>{customStyles}</style>
            <div className="dashboard-container d-flex flex-column">
                {/* Navbar */}
                <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
                    <div className="container">
                        <a className="navbar-brand" href="/dashboard">
                            🎓 StudyHub
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto align-items-center">
                                <li className="nav-item">
                                    <span className="nav-link-custom">
                                        👋 Welcome, {user?.username || 'Student'}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="nav-link-custom"
                                        onClick={() => navigate('/profile')}
                                    >
                                        👤 Profile
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn-logout"
                                        onClick={handleLogout}
                                    >
                                        🚪 Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="main-content flex-grow-1" style={{ marginTop: '80px' }}>
                    <div className="container">
                        {/* Header */}
                        <div className="dashboard-header">
                            <h1 className="dashboard-title">Student Dashboard</h1>
                            <p className="dashboard-subtitle">Take exams and track your academic progress</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-number">{exams.length}</div>
                                <div className="stat-label">📚 Available Exams</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">{results.length}</div>
                                <div className="stat-label">📊 Completed Exams</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">
                                    {results.length > 0
                                        ? Math.round(results.reduce((sum, r) => sum + (parseFloat(r.percentage) || 0), 0) / results.length)
                                        : 0}%
                                </div>
                                <div className="stat-label">⭐ Average Score</div>
                            </div>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="alert-custom" role="alert">
                                <strong>⚠️ Error:</strong> {error}
                                <button
                                    type="button"
                                    className="btn-close float-end"
                                    onClick={() => setError('')}
                                    aria-label="Close"
                                ></button>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="text-center mb-4">
                            <div className="tabs-container">
                                <button
                                    className={`tab-custom ${activeTab === 'exams' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('exams')}
                                >
                                    📝 Available Exams
                                </button>
                                <button
                                    className={`tab-custom ${activeTab === 'results' ? 'active' : ''}`}
                                    onClick={() => {
                                        setActiveTab('results');
                                        fetchResults();
                                    }}
                                >
                                    📊 My Results
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'exams' && (
                            <div className="content-card">
                                <div className="card-header-custom">
                                    <h2 className="card-title">📝 Available Exams</h2>
                                </div>

                                <div className="table-container">
                                    {loading ? (
                                        <div className="loading-container">
                                            <div className="custom-spinner"></div>
                                        </div>
                                    ) : exams.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">📋</div>
                                            <h3>No exams available</h3>
                                            <p>Check back later for new exams from your teachers.</p>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-custom">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">📑 Exam Title</th>
                                                        <th scope="col">❓ Questions</th>
                                                        <th scope="col">🎯 Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {exams.map(exam => {
                                                        // Check if this exam is already completed by the student
                                                        const hasCompleted = results.some(r => r.title === exam.title);
                                                        return (
                                                            <tr key={exam.id}>
                                                                <td>
                                                                    <strong>{exam.title}</strong>
                                                                </td>
                                                                <td>
                                                                    <span className="badge bg-info rounded-pill">
                                                                        {exam.questions.length} questions
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    {hasCompleted ? (
                                                                        <span className="badge bg-success rounded-pill">Completed</span>
                                                                    ) : (
                                                                        <button
                                                                            className="btn-take-exam"
                                                                            onClick={() => goToExam(exam.id)}
                                                                        >
                                                                            🚀 Take Exam
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'results' && (
                            <div className="content-card">
                                <div className="card-header-custom">
                                    <h2 className="card-title">📊 Your Exam Results</h2>
                                </div>

                                <div className="table-container">
                                    {results.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">📈</div>
                                            <h3>No results yet</h3>
                                            <p>Take some exams to see your results here.</p>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-custom">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">📑 Exam Title</th>
                                                        <th scope="col">🎯 Score</th>
                                                        <th scope="col">📅 Submitted</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {results.map((res, idx) => (
                                                        <tr key={idx}>
                                                            <td>
                                                                <strong>{res.title}</strong>
                                                            </td>
                                                            <td>
                                                                {/* <span className={`score-badge ${getScoreClass(res.percentage)}`}>
                                                                    {res.percentage}%
                                                                </span> */}
                                                                {/* <span className={`score-badge ${getScoreClass(res.percentage)}`}>
                                                                    {res.score} / {res.total} ({res.percentage}%)
                                                                </span> */}

                                                                <span className={`score-badge ${getScoreClass(res.percentage)}`}>
                                                                    {res.score} / {res.total}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {new Date(res.submittedAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="footer-custom text-center">
                    <div className="container">
                        <p className="mb-0">© 2025 StudyHub Portal. Excel in your studies. 🌟</p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default SDashboard;