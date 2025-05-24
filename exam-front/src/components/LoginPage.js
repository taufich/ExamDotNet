import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CgEnter } from 'react-icons/cg';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('login'); // 'login', 'otp', 'success'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('/api/Auth/login', { email, password });
            setStep('otp');
            setSuccess('OTP sent to your email!');
        } catch (err) {
            const msg = err.response?.data || 'Login failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('/api/Auth/verify-otp', {
                email,
                otp
            });
            localStorage.setItem('user', JSON.stringify(response.data));
            setStep('success');
            setSuccess('Login successful! Redirecting...');

            // Redirect based on role after a short delay
            setTimeout(() => {
                const role = response.data.role?.toLowerCase();
                if (role === 'student') {
                    navigate('/dashboard');
                } else if (role === 'teacher') {
                    navigate('/teacher-dashboard');
                } else if (role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/');
                }
            }, 1500);
        } catch (err) {
            const msg = err.response?.data || 'OTP verification failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('/api/Auth/login', { email, password });
            setSuccess('New OTP sent to your email');
        } catch (err) {
            const msg = err.response?.data || 'Failed to resend OTP';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f6fa 100%)',
            }}
        >
            <div
                className="shadow-lg"
                style={{
                    background: '#fff',
                    padding: '40px 32px',
                    borderRadius: '18px',
                    minWidth: '340px',
                    maxWidth: '95vw',
                    width: step === 'login' ? '400px' : '340px',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    border: '1px solid #e3e6f0',
                    transition: 'width 0.3s',
                }}
            >
                <div className="text-center mb-4">
                    <h2 style={{ color: '#2d3436', fontWeight: 700, letterSpacing: 1 }}>
                        {step === 'login'
                            ? 'Sign In'
                            : step === 'otp'
                                ? 'Verify OTP'
                                : 'Success'}
                    </h2>
                    <p className="text-muted" style={{ fontSize: 13, marginBottom: 0 }}>
                        {step === 'login'
                            ? 'Access your account to continue'
                            : step === 'otp'
                                ? `A 6-digit code was sent to ${email}`
                                : ''}
                    </p>
                </div>

                {step === 'login' && (
                    <form onSubmit={handleLogin}>
                        {error && (
                            <div className="alert alert-danger py-2">{error}</div>
                        )}
                        {success && (
                            <div className="alert alert-success py-2">{success}</div>
                        )}
                        <div className="mb-3">
                            <label className="form-label fw-semibold" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoFocus
                                style={{ fontSize: 15 }}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{ fontSize: 15 }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-100 fw-bold"
                            style={{
                                fontSize: 16,
                                padding: '10px 0',
                                borderRadius: '6px',
                                boxShadow: '0 2px 8px rgba(9,132,227,0.07)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                        style={{ marginRight: '8px' }}
                                    ></span>

                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                        <div style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#636e72'
                 }}>
                    Don't have an account?{' '}
                    <a 
                        href="/register"
                        style={{
                            color: '#0d6efd',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}
                        onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.target.style.textDecoration = 'none'}
                    >
                        Register Here
                    </a>
                </div>
                    </form>
                    
                    
                )}
                
                {/* <div className="signup-link">
            Don't have an account? <Link to="/register">SignUp</Link>
            </div> */}

                {step === 'otp' && (
                    <form onSubmit={handleOtpVerification}>
                        {error && (
                            <div className="alert alert-danger py-2">{error}</div>
                        )}
                        {success && (
                            <div className="alert alert-success py-2">{success}</div>
                        )}
                        <div className="mb-4">
                            <label className="form-label fw-semibold" htmlFor="otp">
                                Enter OTP
                            </label>
                            <input
                                id="otp"
                                type="text"
                                className="form-control text-center"
                                placeholder="6-digit code"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                required
                                maxLength="6"
                                style={{
                                    letterSpacing: '6px',
                                    fontSize: '22px',
                                    fontWeight: 600,
                                    border: '2px solid #dfe6e9',
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-100 fw-bold mb-2"
                            style={{
                                fontSize: 16,
                                padding: '10px 0',
                                borderRadius: '6px',
                                boxShadow: '0 2px 8px rgba(9,132,227,0.07)',
                            }}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button
                            type="button"
                            onClick={resendOtp}
                            disabled={loading}
                            className="btn btn-outline-primary w-100 fw-bold"
                            style={{
                                fontSize: 15,
                                borderRadius: '6px',
                            }}
                        >
                            Resend OTP
                        </button>
                    </form>
                )}

                {step === 'success' && (
                    <div className="text-center">
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                margin: '0 auto 24px auto',
                                border: '5px solid #e0e7ff',
                                borderTop: '5px solid #0984e3',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                            }}
                        ></div>
                        <h4 className="fw-bold mb-3" style={{ color: '#00b894' }}>
                            Login Successful!
                        </h4>
                        <p className="text-muted mb-0">Redirecting to dashboard...</p>
                    </div>
                )}
            </div>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }
                `}
            </style>
        </div>
    );
};

export default LoginPage;