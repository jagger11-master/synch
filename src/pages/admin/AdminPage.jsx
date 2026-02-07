import React from 'react';
import AdminLayout from '../components/admin/AdminLayout'; // Fixed import path - this page will just wrap the layout or be the layout entry
import { Outlet } from 'react-router-dom';

// In this architecture, we might not need a specific "Page" file if AdminLayout handles the layout structure
// But to keep consistent with "Pages" folder:
const AdminPage = () => {
    return <AdminLayout />;
};

export default AdminPage;
