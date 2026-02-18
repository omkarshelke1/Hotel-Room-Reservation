import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerView = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/');
    }, [navigate]);
    return null;
};

export default CustomerView;