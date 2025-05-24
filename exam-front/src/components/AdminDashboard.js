import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('teachers');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeacher, setNewTeacher] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [registrationMessageType, setRegistrationMessageType] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;

    // Check role on mount
    useEffect(() => {
        if (!user || user.role?.toLowerCase() !== 'admin') {
            localStorage.removeItem('user');
            navigate('/login');
        }
    }, [user, navigate]);

    // Fetch all users and filter teachers
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('http://localhost:5028/api/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Filter users with role 'Teacher'
                const teacherUsers = response.data.filter(user => user.role === 'Teacher');
                setTeachers(teacherUsers);
            } catch (err) {
                setError('Failed to load users. Please login again.');
                if (err.response?.status === 401) {
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, [navigate, token]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Password strength indicator - same as your register page
    const getPasswordStrength = (password) => {
        if (!password) return { strength: '', color: 'transparent' };
        if (password.length < 6) return { strength: 'Too Short', color: '#e74c3c' };
        if (password.length < 8) return { strength: 'Weak', color: '#f39c12' };
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
        
        if (password.length >= 8 && criteriaCount >= 3) return { strength: 'Strong', color: '#27ae60' };
        if (password.length >= 8 && criteriaCount >= 2) return { strength: 'Medium', color: '#f39c12' };
        return { strength: 'Weak', color: '#e74c3c' };
    };

    const passwordStrength = getPasswordStrength(newTeacher.password);
    const passwordsMatch = newTeacher.password === newTeacher.confirmPassword && newTeacher.confirmPassword.length > 0;

    const handleCreateTeacher = async (e) => {
        if (e) e.preventDefault();
        setIsCreating(true);
        setRegistrationMessage('');
        setError('');

        // Validation - same as your register page
        if (newTeacher.password.length < 6) {
            setRegistrationMessage('Password must be at least 6 characters long');
            setRegistrationMessageType('error');
            setIsCreating(false);
            return;
        }

        if (newTeacher.password !== newTeacher.confirmPassword) {
            setRegistrationMessage('Passwords do not match');
            setRegistrationMessageType('error');
            setIsCreating(false);
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5028/api/Auth/register',
                {
                    username: newTeacher.username,
                    email: newTeacher.email,
                    password: newTeacher.password,
                    role: 'Teacher' // Set role to Teacher
                }
            );

            // Add the new teacher to the list
            setTeachers([...teachers, {
                id: response.data.id,
                username: newTeacher.username,
                email: newTeacher.email,
                role: 'Teacher',
                isActive: true,
                createdAt: new Date().toISOString()
            }]);
            
            setRegistrationMessage('Teacher account created successfully!');
            setRegistrationMessageType('success');
            
            // Clear form after short delay to show success message
            setTimeout(() => {
                setShowCreateModal(false);
                setNewTeacher({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                setRegistrationMessage('');
                setIsCreating(false);
            }, 1500);
            
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response?.data?.message) {
                setRegistrationMessage(error.response.data.message);
            } else {
                setRegistrationMessage("Registration failed. Please try again.");
            }
            setRegistrationMessageType('error');
            setIsCreating(false);
        }
    };

    const handleDeleteTeacher = async (teacherId) => {
        if (window.confirm('Are you sure you want to delete this teacher account?')) {
            try {
                await axios.delete(`http://localhost:5028/api/user/${teacherId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
            } catch (err) {
                setError('Failed to delete teacher account');
            }
        }
    };

    




    const customStyles = `
        .dashboard-container {
            background: linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%);
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
            background: rgba(44, 62, 80, 0.1);
            color: #2c3e50 !important;
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
            background: linear-gradient(135deg, #2c3e50, #4ca1af);
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
            background: rgba(44, 62, 80, 0.05);
            transform: translateX(5px);
        }

        .btn-create {
            background: linear-gradient(45deg, #00b894, #00a085);
            border: none;
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            font-weight: 500;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }

        .btn-create:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 184, 148, 0.4);
            color: white;
        }

        .btn-delete {
            background: linear-gradient(45deg, #ff7675, #d63031);
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            font-weight: 500;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }

        .btn-delete:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(214, 48, 49, 0.4);
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
            border: 3px solid rgba(44, 62, 80, 0.3);
            border-top: 3px solid #2c3e50;
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

        /* Modal styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            width: 100%;
            max-width: 500px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
            margin-bottom: 1.5rem;
        }

        .modal-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2c3e50;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #2c3e50;
        }

        .form-control {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .form-control:focus {
            border-color: #2c3e50;
            box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.1);
            outline: none;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 2rem;
        }

        .btn-secondary {
            background: #6c757d;
            border: none;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .btn-secondary:hover {
            background: #5a6268;
            transform: translateY(-2px);
        }

        .btn-primary {
            background: #2c3e50;
            border: none;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            background: #1a252f;
            transform: translateY(-2px);
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
            
            .btn-create, .btn-delete {
                padding: 0.4rem 1rem;
                font-size: 0.8rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .modal-content {
                margin: 1rem;
                padding: 1.5rem;
            }
            .registration-message {
            padding: '10px',
            marginBottom: '16px',
            borderRadius: '4px',
            backgroundColor: ${registrationMessageType === 'success' ? '#d4edda' : '#f8d7da'},
            color: ${registrationMessageType === 'success' ? '#155724' : '#721c24'},
            border: 1px solid ${registrationMessageType === 'success' ? '#c3e6cb' : '#f5c6cb'}
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
                        <a className="navbar-brand" href="/dashboard">
                            🎓 AdminHub
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
                                        👋 Welcome, {user?.username || 'Admin'}
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
                            <h1 className="dashboard-title">Admin Dashboard</h1>
                            <p className="dashboard-subtitle">Manage teacher accounts and system settings</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-number">{teachers.length}</div>
                                <div className="stat-label">👨‍🏫 Registered Teachers</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">
                                    {teachers.filter(t => t.isActive).length}
                                </div>
                                <div className="stat-label">✅ Active Teachers</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">
                                    {new Date().toLocaleDateString()}
                                </div>
                                <div className="stat-label">📅 Today's Date</div>
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
                                    className={`tab-custom ${activeTab === 'teachers' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('teachers')}
                                >
                                    👨‍🏫 Teacher Accounts
                                </button>
                                <button
                                    className={`tab-custom ${activeTab === 'settings' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('settings')}
                                >
                                    ⚙️ System Settings
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'teachers' && (
                            <div className="content-card">
                                <div className="card-header-custom d-flex justify-content-between align-items-center">
                                    <h2 className="card-title">👨‍🏫 Teacher Accounts</h2>
                                    <button 
                                        className="btn-create"
                                        onClick={() => setShowCreateModal(true)}
                                    >
                                        ➕ Create Teacher
                                    </button>
                                </div>

                                <div className="table-container">
                                    {loading ? (
                                        <div className="loading-container">
                                            <div className="custom-spinner"></div>
                                        </div>
                                    ) : teachers.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">👨‍🏫</div>
                                            <h3>No teacher accounts</h3>
                                            <p>Create teacher accounts to get started.</p>
                                            <button 
                                                className="btn-create mt-3"
                                                onClick={() => setShowCreateModal(true)}
                                            >
                                                ➕ Create First Teacher
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-custom">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">👤 Username</th>
                                                        <th scope="col">📧 Email</th>
                                                        <th scope="col">🔄 Status</th>
                                                        <th scope="col">📅 Created</th>
                                                        <th scope="col">⚙️ Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {teachers.map(teacher => (
                                                        <tr key={teacher.id}>
                                                            <td>
                                                                <strong>{teacher.username}</strong>
                                                            </td>
                                                            <td>{teacher.email}</td>
                                                            <td>
                                                                <span className={`badge rounded-pill ${teacher.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                                                    {teacher.isActive ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {new Date(teacher.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn-delete"
                                                                    onClick={() => handleDeleteTeacher(teacher.id)}
                                                                >
                                                                    🗑️ Delete
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
                        )}

                        {activeTab === 'settings' && (
                            <div className="content-card">
                                <div className="card-header-custom">
                                    <h2 className="card-title">⚙️ System Settings</h2>
                                </div>
                                <div className="table-container">
                                    <div className="empty-state">
                                        <div className="empty-state-icon">⚙️</div>
                                        <h3>System Settings</h3>
                                        <p>Configure system-wide settings and preferences here.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="footer-custom text-center">
                    <div className="container">
                        <p className="mb-0">© 2025 AdminHub Portal. Manage your education system. 🌟</p>
                    </div>
                </footer>

                {/* Create Teacher Modal */}
                {showCreateModal && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{
                            background: '#fff',
                            padding: '32px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                            width: '320px'
                        }}>
                            <div className="modal-header" style={{ padding: 0, marginBottom: '24px' }}>
                                <h3 style={{ color: '#2d3436', margin: 0 }}>Create Teacher Account</h3>
                            </div>
                            
                            {registrationMessage && (
                                <div style={{
                                    padding: '10px',
                                    marginBottom: '16px',
                                    borderRadius: '4px',
                                    backgroundColor: registrationMessageType === 'success' ? '#d4edda' : '#f8d7da',
                                    color: registrationMessageType === 'success' ? '#155724' : '#721c24',
                                    border: `1px solid ${registrationMessageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                                }}>
                                    {registrationMessage}
                                </div>
                            )}

                            <form onSubmit={handleCreateTeacher}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={newTeacher.username}
                                        onChange={(e) => setNewTeacher({...newTeacher, username: e.target.value})}
                                        required
                                        disabled={isCreating}
                                        style={{
                                            padding: '10px',
                                            marginBottom: '16px',
                                            borderRadius: '4px',
                                            border: '1px solid #dfe6e9',
                                            opacity: isCreating ? 0.7 : 1,
                                            width: '100%'
                                        }}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={newTeacher.email}
                                        onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                                        required
                                        disabled={isCreating}
                                        style={{
                                            padding: '10px',
                                            marginBottom: '16px',
                                            borderRadius: '4px',
                                            border: '1px solid #dfe6e9',
                                            opacity: isCreating ? 0.7 : 1,
                                            width: '100%'
                                        }}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={newTeacher.password}
                                        onChange={(e) => setNewTeacher({...newTeacher, password: e.target.value})}
                                        required
                                        disabled={isCreating}
                                        style={{
                                            padding: '10px',
                                            marginBottom: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #dfe6e9',
                                            opacity: isCreating ? 0.7 : 1,
                                            width: '100%'
                                        }}
                                    />
                                    {newTeacher.password && (
                                        <div style={{
                                            fontSize: '12px',
                                            marginBottom: '8px',
                                            color: passwordStrength.color,
                                            fontWeight: 'bold'
                                        }}>
                                            Password strength: {passwordStrength.strength}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="form-group">
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={newTeacher.confirmPassword}
                                        onChange={(e) => setNewTeacher({...newTeacher, confirmPassword: e.target.value})}
                                        required
                                        disabled={isCreating}
                                        style={{
                                            padding: '10px',
                                            marginBottom: '8px',
                                            borderRadius: '4px',
                                            border: `1px solid ${newTeacher.confirmPassword && !passwordsMatch ? '#e74c3c' : '#dfe6e9'}`,
                                            opacity: isCreating ? 0.7 : 1,
                                            width: '100%'
                                        }}
                                    />
                                    {newTeacher.confirmPassword && !passwordsMatch && (
                                        <div style={{
                                            fontSize: '12px',
                                            marginBottom: '16px',
                                            color: '#e74c3c'
                                        }}>
                                            Passwords do not match
                                        </div>
                                    )}
                                    {newTeacher.confirmPassword && passwordsMatch && (
                                        <div style={{
                                            fontSize: '12px',
                                            marginBottom: '16px',
                                            color: '#27ae60'
                                        }}>
                                            Passwords match ✓
                                        </div>
                                    )}
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={isCreating || !newTeacher.username || !newTeacher.email || !newTeacher.password || !passwordsMatch || newTeacher.password.length < 6}
                                    style={{
                                        fontSize: 16,
                                        padding: '10px 0',
                                        borderRadius: '6px',
                                        border: 'none',
                                        backgroundColor: '#0d6efd',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 8px rgba(9,132,227,0.07)',
                                        width: '100%',
                                        cursor: isCreating ? 'not-allowed' : 'pointer',
                                        opacity: isCreating ? 0.7 : 1
                                    }}
                                >
                                    {isCreating ? 'Creating...' : 'Create Teacher'}
                                </button>
                            </form>
                            
                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <button 
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setRegistrationMessage('');
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#636e72',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminDashboard;