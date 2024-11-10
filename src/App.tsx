import React from 'react';
import { createBrowserRouter, NonIndexRouteObject, RouterProvider } from 'react-router-dom';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import NavbarNavigation from './toolpad/NavbarNavigation.tsx';
import Navbar from './toolpad/Navbar.tsx';
import HomePage from './pages/navbar/HomePage.tsx';
import OrdersPage from './pages/navbar/OrdersPage.tsx';

type ProtectedRouteObject = Omit<NonIndexRouteObject, 'children'> & {
    element: React.ReactNode;
    children?: ProtectedRouteObject[];
};

const applyProtectedRoute = (routes: ProtectedRouteObject[]): ProtectedRouteObject[] => {
    return routes.map((route) => ({
        ...route,
        element: <ProtectedRoute>{route.element}</ProtectedRoute>,
        children: route.children ? applyProtectedRoute(route.children) : undefined,
    }));
};

const protectedRoutes = [
    {
        path: '/',
        element: <Navbar />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/orders',
                element: <OrdersPage />,
            },
        ],
    },
];

const router = createBrowserRouter([
    {
        element: <NavbarNavigation />,
        children: [
            ...applyProtectedRoute(protectedRoutes),
        ],
    },
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
