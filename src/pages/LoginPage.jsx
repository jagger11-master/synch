import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Login from '../components/auth/Login';

const LoginPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main className="container" style={{ flex: 1 }}>
                <Login />
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;
