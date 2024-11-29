import React from 'react';
import { Navigate } from 'react-router-dom';
import { SmaiaXAbsoluteRoutes } from '../../constants/constants.ts';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!accessToken || !refreshToken) {
        return <Navigate to={SmaiaXAbsoluteRoutes.SIGN_IN} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
