import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role] = useState('Student'); // Default role
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    // Password validation
    const getPasswordStrength = (password) => {
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

    const passwordStrength = getPasswordStrength(password);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setMessage('');

        // Validation
        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            setMessageType('error');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setMessageType('error');
            setLoading(false);
            return;
        }

        try {
    const response = await axios.post('http://localhost:5028/api/Auth/register', {
        username,
        password,
        email,
        role
    });

    // Axios already parses JSON response
    const data = response.data;

    setMessage('Registration successful!');
    setMessageType('success');

    // Clear form
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');

    console.log('Registration successful:', data);

} catch (error) {
    console.error('Registration error:', error);

    if (error.response && error.response.data && error.response.data.message) {
    setMessage(error.response.data.message); // <-- use message from backend
    } 

  else {

    setMessage("Registration failed. Please try again.");
    
    }

    setMessageType('error');
}
 finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f6fa'
        }}>
            <div
                style={{
                    background: '#fff',
                    padding: '32px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '320px'
                }}
            >
                <h2 style={{ marginBottom: '24px', color: '#2d3436' }}>Register</h2>
                
                {message && (
                    <div style={{
                        padding: '10px',
                        marginBottom: '16px',
                        borderRadius: '4px',
                        backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
                        color: messageType === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        {message}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                        padding: '10px',
                        marginBottom: '16px',
                        borderRadius: '4px',
                        border: '1px solid #dfe6e9',
                        opacity: loading ? 0.7 : 1
                    }}
                />
                
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                        padding: '10px',
                        marginBottom: '16px',
                        borderRadius: '4px',
                        border: '1px solid #dfe6e9',
                        opacity: loading ? 0.7 : 1
                    }}
                />
                
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                        padding: '10px',
                        marginBottom: '8px',
                        borderRadius: '4px',
                        border: '1px solid #dfe6e9',
                        opacity: loading ? 0.7 : 1
                    }}
                />
                
                {password && (
                    <div style={{
                        fontSize: '12px',
                        marginBottom: '8px',
                        color: passwordStrength.color,
                        fontWeight: 'bold'
                    }}>
                        Password strength: {passwordStrength.strength}
                    </div>
                )}
                
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                        padding: '10px',
                        marginBottom: '8px',
                        borderRadius: '4px',
                        border: `1px solid ${confirmPassword && !passwordsMatch ? '#e74c3c' : '#dfe6e9'}`,
                        opacity: loading ? 0.7 : 1
                    }}
                />
                
                {confirmPassword && !passwordsMatch && (
                    <div style={{
                        fontSize: '12px',
                        marginBottom: '16px',
                        color: '#e74c3c'
                    }}>
                        Passwords do not match
                    </div>
                )}
                
                {confirmPassword && passwordsMatch && (
                    <div style={{
                        fontSize: '12px',
                        marginBottom: '16px',
                        color: '#27ae60'
                    }}>
                        Passwords match ✓
                    </div>
                )}
                
                <button
                            onClick={handleSubmit}
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
                            {loading ? 'Registering...' : 'Register'}

                        </button>
                
                <div style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#636e72'
                 }}>
                    Already have an account?{' '}
                    <a 
                        href="/login"
                        style={{
                            color: '0d6efd',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}
                        onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.target.style.textDecoration = 'none'}
                    >
                        Login here
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;