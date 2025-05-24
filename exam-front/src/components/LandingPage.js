import React, { useState, useEffect } from 'react';

const LandingPage = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const styles = {
        container: {
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1e293b 0%, #7c3aed 50%, #1e293b 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        },
        backgroundPattern: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px',
            opacity: 0.3,
            pointerEvents: 'none'
        },
        content: {
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '1200px',
            width: '100%',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1s ease-out'
        },
        mainHeading: {
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: 'bold',
            marginBottom: '16px',
            background: 'linear-gradient(to right, #22d3ee, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
        },
        subHeading: {
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '32px',
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        },
        description: {
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#d1d5db',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px auto',
            lineHeight: 1.6
        },
        buttonContainer: {
            position: 'relative',
            display: 'inline-block',
            marginBottom: '64px'
        },
        buttonGlow: {
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            right: '-4px',
            bottom: '-4px',
            background: 'linear-gradient(to right, #06b6d4, #8b5cf6)',
            borderRadius: '50px',
            filter: 'blur(8px)',
            opacity: 0.3,
            transition: 'opacity 0.3s ease'
        },
        button: {
            position: 'relative',
            padding: '16px 48px',
            background: 'linear-gradient(to right, #0891b2, #7c3aed)',
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            borderRadius: '50px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        },
        buttonHover: {
            transform: 'scale(1.05)',
            background: 'linear-gradient(to right, #0e7490, #6d28d9)'
        },
        arrow: {
            width: '20px',
            height: '20px',
            transition: 'transform 0.3s ease'
        },
        cardsContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            maxWidth: '900px',
            width: '100%',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1.5s ease-out 0.3s'
        },
        card: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        },
        cardHover: {
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'scale(1.05)',
            borderColor: 'rgba(255, 255, 255, 0.3)'
        },
        cardIcon: {
            fontSize: '2rem',
            marginBottom: '16px',
            display: 'block',
            transition: 'transform 0.3s ease'
        },
        cardTitle: {
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px'
        },
        cardDesc: {
            color: '#d1d5db',
            fontSize: '0.875rem'
        },
        helpButton: {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 20,
            background: 'linear-gradient(to right, #7c3aed, #ec4899)',
            color: 'white',
            padding: '12px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
        },
        helpIcon: {
            width: '20px',
            height: '20px'
        }
    };

    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoveredButton, setHoveredButton] = useState(false);
    const [hoveredHelp, setHoveredHelp] = useState(false);

    return (
        <div style={styles.container}>
            <div style={styles.backgroundPattern}></div>
            
            <div style={styles.content}>
                <h1 style={styles.mainHeading}>Welcome to</h1>
                <h2 style={styles.subHeading}>Online Exam Portal</h2>
                <p style={styles.description}>
                    Your one-stop solution for online exams and assessments.
                </p>

                <div style={styles.buttonContainer}>
                    <div style={{
                        ...styles.buttonGlow,
                        opacity: hoveredButton ? 0.6 : 0.3
                    }}></div>
                    <a
                        href="/login"
                        style={{
                            ...styles.button,
                            ...(hoveredButton ? styles.buttonHover : {})
                        }}
                        onMouseEnter={() => setHoveredButton(true)}
                        onMouseLeave={() => setHoveredButton(false)}
                    >
                        Get Started
                        <svg 
                            style={{
                                ...styles.arrow,
                                transform: hoveredButton ? 'translateX(4px)' : 'translateX(0)'
                            }}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </div>

                <div style={styles.cardsContainer}>
                    {[
                        { icon: "📊", title: "Smart Analytics", desc: "Real-time performance tracking" },
                        { icon: "🔒", title: "Secure Platform", desc: "Advanced security protocols" },
                        { icon: "⚡", title: "Lightning Fast", desc: "Instant results and feedback" }
                    ].map((feature, index) => (
                        <div 
                            key={index}
                            style={{
                                ...styles.card,
                                ...(hoveredCard === index ? styles.cardHover : {})
                            }}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <span style={{
                                ...styles.cardIcon,
                                transform: hoveredCard === index ? 'scale(1.1)' : 'scale(1)'
                            }}>
                                {feature.icon}
                            </span>
                            <h3 style={styles.cardTitle}>{feature.title}</h3>
                            <p style={styles.cardDesc}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <button 
                style={{
                    ...styles.helpButton,
                    transform: hoveredHelp ? 'scale(1.1)' : 'scale(1)'
                }}
                onMouseEnter={() => setHoveredHelp(true)}
                onMouseLeave={() => setHoveredHelp(false)}
            >
                <svg style={styles.helpIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </div>
    );
};

export default LandingPage;