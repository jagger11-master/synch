import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Overview</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-gray)', marginBottom: '0.5rem' }}>Total Sales</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>$0.00</p>
                </div>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-gray)', marginBottom: '0.5rem' }}>Total Orders</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
                </div>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-gray)', marginBottom: '0.5rem' }}>Products</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>--</p>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-gray)' }}>Sales Chart Placeholder</p>
            </div>
        </div>
    );
};

export default Dashboard;
