import { createBrowserRouter, Navigate } from 'react-router-dom';
import RepricingPage from '../pages/RepricingPage';
import ReportsPage from '../pages/ReportsPage';
import AppLayout from '../layouts/AppLayout';
import ErrorPage from '../pages/ErrorPage';

export const router = createBrowserRouter(
    [
        {
            path: '',
            errorElement: <ErrorPage />,
            element: <AppLayout />,
            children: [
                { index: true, element: <Navigate to='/repricing' replace /> },
                { path: '/repricing', element: <RepricingPage /> },
                { path: '/reports', element: <ReportsPage /> },
            ],
        },
    ],
    {
        future: {
            v7_fetcherPersist: true,
            v7_normalizeFormMethod: true,
            v7_partialHydration: true,
            v7_skipActionErrorRevalidation: true,
            v7_relativeSplatPath: true,
        },
    },
);
