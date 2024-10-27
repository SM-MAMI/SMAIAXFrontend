import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

const protectedRoutes = ['/'];

const router = createBrowserRouter([
    ...protectedRoutes.map((path) => ({
        path,
        element: (
            <ProtectedRoute>
                <HomePage />
            </ProtectedRoute>
        ),
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

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
