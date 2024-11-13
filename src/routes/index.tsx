import { createBrowserRouter } from 'react-router-dom';
import RepricingPage from '../pages/RepricingPage';
import ReportsPage from '../pages/ReportsPage';
import AppLayout from '../layouts/AppLayout';
import ErrorPage from '../pages/ErrorPage';

export const router = createBrowserRouter([
    {
        path: '',
        errorElement: <ErrorPage />,
        element: <AppLayout />,
        children: [
            { index: true, element: <RepricingPage /> },
            { path: '/repricing', element: <RepricingPage /> },
            { path: '/reports', element: <ReportsPage /> },
        ],
    },
]);
