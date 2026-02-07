import React from 'react';

const SuccessMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
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

export default SuccessMessage;
