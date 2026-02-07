import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import VerifyOTP from '../components/auth/VerifyOTP';

const VerifyOTPPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main className="container" style={{ flex: 1 }}>
                <VerifyOTP />
            </main>
            <Footer />
        </div>
    );
};

export default VerifyOTPPage;
