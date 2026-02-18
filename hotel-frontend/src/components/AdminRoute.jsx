import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const { token, role } = useSelector((state) => state.auth);

    if (!token || role !== 'ADMIN') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
