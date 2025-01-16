import React from 'react';
import { createBrowserRouter, NonIndexRouteObject, RouterProvider } from 'react-router-dom';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import SmartMetersPage from './pages/navbar/SmartMetersPage.tsx';
import NavbarNavigation from './components/toolpad/NavbarNavigation.tsx';
import Navbar from './components/toolpad/Navbar.tsx';
import HomePage from './pages/navbar/HomePage.tsx';
import { SmaiaxRoutes } from './constants/constants.ts';
import SmartMeterDetailsPage from './pages/navbar/details/SmartMeterDetailsPage.tsx';
import PolicySearchPage from './pages/navbar/PolicySearchPage.tsx';
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
        element: <NavbarNavigation />,
        children: [
            {
                path: SmaiaxRoutes.HOME,
                element: <Navbar />,
                children: [
                    {
                        path: SmaiaxRoutes.HOME,
                        element: <HomePage />,
                    },
                    {
                        path: SmaiaxRoutes.SMART_METERS,
                        element: <SmartMetersPage />,
                    },
                    {
                        path: SmaiaxRoutes.SMART_METER_DETAILS,
                        element: <SmartMeterDetailsPage />,
                    },
                    {
                        path: SmaiaxRoutes.POLICY_SEARCH,
                        element: <PolicySearchPage />,
                    },
                    {
                        path: SmaiaxRoutes.ORDERS,
                        element: <OrdersPage />,
                    },
                ],
            },
        ],
    },
];

const router = createBrowserRouter([
    ...applyProtectedRoute(protectedRoutes),
    {
        path: SmaiaxRoutes.SIGN_IN,
        element: <SignIn />,
    },
    {
        path: SmaiaxRoutes.SIGN_UP,
        element: <SignUp />,
    },
    {
        path: SmaiaxRoutes.NOT_FOUND,
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
