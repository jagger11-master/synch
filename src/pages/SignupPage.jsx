import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Signup from '../components/auth/Signup';

const SignupPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main className="container" style={{ flex: 1 }}>
                <Signup />
            </main>
            <Footer />
        </div>
    );
};

export default SignupPage;
