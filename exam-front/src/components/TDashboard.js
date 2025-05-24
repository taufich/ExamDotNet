import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TDashboard = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // const [activeTab, setActiveTab] = useState('exams');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;
    const username = user?.username || 'Teacher';
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [resultsLoading, setResultsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [questionFilter, setQuestionFilter] = useState('all');
    const [sortBy, setSortBy] = useState('title-asc');

    // Filter and sort exams for the table
    const filteredExams = exams
        .filter(
            exam =>
                (exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    exam.questions.some(q =>
                        q.text?.toLowerCase().includes(searchTerm.toLowerCase())
                    )) &&
                (questionFilter === 'all' ||
                    (questionFilter === '0-5' && exam.questions.length <= 5) ||
                    (questionFilter === '6-10' && exam.questions.length > 5 && exam.questions.length <= 10) ||
                    (questionFilter === '11+' && exam.questions.length > 10))
        )
        .sort((a, b) => {
            if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
            if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
            if (sortBy === 'questions-asc') return a.questions.length - b.questions.length;
            if (sortBy === 'questions-desc') return b.questions.length - a.questions.length;
            return 0;
        });

    const handleDownloadExcel = () => {
        if (!results || results.length === 0) return;
        const worksheet = XLSX.utils.json_to_sheet(
            results.map((r, idx) => ({
                '#': idx + 1,
                'Student Name': r.studentName,
                'Score': r.score,
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'exam-results.xlsx');
    };

    // Download as PDF
    const handleDownloadPDF = () => {
        if (!results || results.length === 0) return;
        const doc = new jsPDF();
        doc.text('Exam Results', 14, 16);
        autoTable(doc, {
            startY: 22,
            head: [['#', 'Student Name', 'Score']],
            body: results.map((r, idx) => [idx + 1, r.studentName, r.score]),
        });
        doc.save('exam-results.pdf');
    };

    const handleViewResults = async (examId) => {
        setResultsLoading(true);
        setShowResults(true);
        try {
            const res = await axios.get(`http://localhost:5028/api/exam/results/${examId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setResults(res.data);
        } catch (err) {
            setResults([]);
            setError('Failed to fetch results.');
        } finally {
            setResultsLoading(false);
        }
    };

    // Check role on mount
    useEffect(() => {
        if (!user || user.role?.toLowerCase() !== 'teacher') {
            localStorage.removeItem('user');
            navigate('/login');
        }
    }, [user, navigate]);



    // Fetch exams
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await axios.get('http://localhost:5028/api/exam/list', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setExams(res.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch exams. Please try again or log in.');
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

    // Delete exam
    const deleteExam = async (id) => {
        if (!window.confirm('Are you sure you want to delete this exam?')) return;
        try {
            await axios.delete(`http://localhost:5028/api/exam/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setExams(prev => prev.filter(exam => exam.id !== id));
            setError('');
        } catch (err) {
            setError('Failed to delete exam. Please try again.');
        }
    };

    // Handle navigation
    const handleCreateExam = () => {
        navigate('/create-exam');
    };

    const handleUpdateExam = (id) => {
        navigate(`/update-exam/${id}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
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
            // transform: translateY(-1px);
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
            // transform: translateY(-2px);
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
            // transform: translateY(-5px);
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

        .btn-create {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            font-weight: 500;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            transition: all 0.3s ease;
        }

        .btn-create:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
            color: white;
            // transform: translateY(-1px);
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
            text-// transform: uppercase;
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
            // transform: translateX(5px);
        }

        .btn-action {
            padding: 0.4rem 1rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            border: none;
            transition: all 0.3s ease;
            margin: 0 0.25rem;
        }

        .btn-edit {
            background: linear-gradient(45deg, #ffeaa7, #fdcb6e);
            color: #2c3e50;
        }

        .btn-edit:hover {
            // transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(253, 203, 110, 0.4);
            color: #2c3e50;
        }

        .btn-delete {
            background: linear-gradient(45deg, #fd79a8, #e84393);
            color: white;
        }

        .btn-delete:hover {
            // transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(232, 67, 147, 0.4);
            color: white;
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
            0% { // transform: rotate(0deg); }
            100% { // transform: rotate(360deg); }
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

        @media (max-width: 768px) {
            .dashboard-title {
                font-size: 2rem;
            }
            
            .card-header-custom {
                flex-direction: column;
                text-align: center;
            }
            
            .btn-create {
                margin-top: 1rem;
            }
            
            .table-container {
                padding: 1rem;
            }
            
            .btn-action {
                padding: 0.3rem 0.8rem;
                font-size: 0.8rem;
                margin: 0.1rem;
            }
        }
    `;

    return (
        <>
            <style>{customStyles}</style>
            <div className="dashboard-container d-flex flex-column">
                {/* Navbar */}
                <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
                    <div className="container">
                        <a className="navbar-brand" href="/teacher-dashboard">
                            📚 TeachHub
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
                                        👋 Welcome, {username}
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
                            <h1 className="dashboard-title">Teacher Dashboard</h1>
                            <p className="dashboard-subtitle">Manage your exams and track student progress</p>
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

                        {/* Content Card */}
                        <div className="content-card">
                            <div className="card-header-custom d-flex justify-content-between align-items-center">
                                <h2 className="card-title">📝 Exam Management</h2>
                                <button className="btn-create" onClick={handleCreateExam}>
                                    ➕ Create New Exam
                                </button>
                            </div>

                            <div className="table-container">
                                <div className="table-container">
                                    {/* Search input */}
                                    <div className="mb-3 d-flex flex-wrap gap-2 justify-content-between align-items-center">
                                        <div className="d-flex gap-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                style={{ maxWidth: 200 }}
                                                placeholder="🔍 Search exams..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                            />
                                            <select
                                                className="form-select"
                                                style={{ maxWidth: 150 }}
                                                value={questionFilter}
                                                onChange={e => setQuestionFilter(e.target.value)}
                                            >
                                                <option value="all">All Questions</option>
                                                <option value="0-5">0-5 Questions</option>
                                                <option value="6-10">6-10 Questions</option>
                                                <option value="11+">11+ Questions</option>
                                            </select>
                                        </div>
                                        <div>
                                            <select
                                                className="form-select"
                                                style={{ maxWidth: 180 }}
                                                value={sortBy}
                                                onChange={e => setSortBy(e.target.value)}
                                            >
                                                <option value="title-asc">Sort: Title (A-Z)</option>
                                                <option value="title-desc">Sort: Title (Z-A)</option>
                                                <option value="questions-asc">Sort: Fewest Questions</option>
                                                <option value="questions-desc">Sort: Most Questions</option>
                                            </select>
                                        </div>
                                    </div>
                                    {loading ? (
                                        <div className="loading-container">
                                            <div className="custom-spinner"></div>
                                        </div>
                                    ) : exams.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">📋</div>
                                            <h3>No exams found</h3>
                                            <p>Start by creating your first exam to manage student assessments.</p>
                                            <button className="btn btn-primary btn-lg mt-3" onClick={handleCreateExam}>
                                                Create Your First Exam
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-custom">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">📑 Exam Title</th>
                                                        <th scope="col">❓ Questions</th>
                                                        <th scope="col">⚙️ Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredExams.map((exam, index) => (
                                                        <tr key={exam.id}>
                                                            <td>
                                                                <span className="badge bg-primary rounded-pill">
                                                                    {index + 1}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <strong>{exam.title}</strong>
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-info rounded-pill">
                                                                    {exam.questions.length} questions
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn-action btn-edit"
                                                                    onClick={() => handleUpdateExam(exam.id)}
                                                                    title="Edit exam"
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                                <button
                                                                    className="btn-action btn-delete"
                                                                    onClick={() => deleteExam(exam.id)}
                                                                    title="Delete exam"
                                                                >
                                                                    🗑️ Delete
                                                                </button>
                                                                <button
                                                                    className="btn-action btn-view"
                                                                    onClick={() => handleViewResults(exam.id)}
                                                                    title="View Results"
                                                                >
                                                                    📊 View Results
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>


                {/* Footer */}
                <footer className="footer-custom text-center">
                    <div className="container">
                        <p className="mb-0">© 2025 TeachHub Portal. Empowering Education. 🎓</p>
                    </div>
                </footer>
            </div>


            {showResults && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Exam Results</h5>
                                <button type="button" className="btn-close" onClick={() => setShowResults(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3 d-flex gap-2">
                                    <button className="btn btn-success" onClick={handleDownloadExcel}>
                                        ⬇️ Download Excel
                                    </button>
                                    <button className="btn btn-danger" onClick={handleDownloadPDF}>
                                        ⬇️ Download PDF
                                    </button>
                                </div>
                                {resultsLoading ? (
                                    <div className="loading-container">
                                        <div className="custom-spinner"></div>
                                    </div>
                                ) : results.length === 0 ? (
                                    <div>No students have completed this exam yet.</div>
                                ) : (
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Student Name</th>
                                                <th>Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((r, idx) => (
                                                <tr key={r.studentId}>
                                                    <td>{idx + 1}</td>
                                                    <td>{r.studentName}</td>
                                                    <td>{r.score}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TDashboard;