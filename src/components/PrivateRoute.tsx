import React from 'react';
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';

const PrivateRoute = () => {
    const [searchParams] = useSearchParams();
    const key = searchParams.get('key');

    // Check for private key in URL or existing session
    if (key === 'access-admin') {
        localStorage.setItem('isAdminAuthenticated', 'true');
    }

    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
