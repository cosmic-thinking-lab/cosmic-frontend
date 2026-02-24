import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    // Check for token existence
    const token = localStorage.getItem('adminToken');
    
    // Legacy support: Clear old flag if it exists
    if (localStorage.getItem('isAdminAuthenticated')) {
        localStorage.removeItem('isAdminAuthenticated');
    }

    // In a real app, you might want to decode the token to check expiration here
    // or rely on the dashboard API call to fail with 401 and redirect.
    const isAuthenticated = !!token;

    return isAuthenticated ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default PrivateRoute;
