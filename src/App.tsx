import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Home from './pages/dashboard/Home.tsx';

const protectedRoutes = [
    {
        path: '/',
        element: <Dashboard />,
        children: [
            {
                path: '/',
                element: <Home/>,
            },
            {
                path: '/orders',
                element: <Home/>,
            },
        ],
    },
];

const router = createBrowserRouter([
    ...protectedRoutes.map(route => ({
        ...route,
        element: <ProtectedRoute>{route.element}</ProtectedRoute>,
    })),
    {
        path: 'signin',
        element: <SignIn />,
    },
    {
        path: 'signup',
        element: <SignUp />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);

const App = (): React.ReactElement => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
};

export default App;
