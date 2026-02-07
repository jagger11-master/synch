import React from 'react';

const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div style={{
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            color: '#ef4444',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1rem',
            textAlign: 'center',
            fontSize: '0.9rem'
        }}>
            {message}
        </div>
    );
};

export default ErrorMessage;
