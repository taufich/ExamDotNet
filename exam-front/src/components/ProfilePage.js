import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      background: 'rgba(30, 41, 59, 0.7)', // darker semi-transparent background (slate tone)
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      color: 'white',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '20px',
      background: 'linear-gradient(to right, #22d3ee, #a855f7)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: 'center',
    },
    infoRow: {
      marginBottom: '16px',
      fontSize: '1.1rem',
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      paddingBottom: '8px'
    },
    label: {
      fontWeight: '600',
      color: '#cbd5e1' // slate-200
    },
    value: {
      color: '#f8fafc' // near white for better visibility
    },
    button: {
      marginTop: '30px',
      padding: '12px 24px',
      background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
      border: 'none',
      borderRadius: '30px',
      color: 'white',
      fontSize: '1.2rem',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 8px 20px rgba(124, 58, 237, 0.4)',
      transition: 'transform 0.3s ease',
      display: 'block',
      width: '100%'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Profile</h1>
      <div style={styles.infoRow}>
        <span style={styles.label}>Name:</span>
        <span style={styles.value}>{user?.name || 'N/A'}</span>
      </div>
      <div style={styles.infoRow}>
        <span style={styles.label}>Email:</span>
        <span style={styles.value}>{user?.email || 'N/A'}</span>
      </div>
      <div style={styles.infoRow}>
        <span style={styles.label}>Username:</span>
        <span style={styles.value}>{user?.username || 'N/A'}</span>
      </div>
      <button style={styles.button}>Edit Profile</button>
    </div>
  );
};

export default ProfilePage;
