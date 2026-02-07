import React from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
            <AdminSidebar />
            <main style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
