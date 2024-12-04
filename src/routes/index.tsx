import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import ErrorPage from "../pages/ErrorPage";
import ReportsPage from "../pages/ReportsPage";
import RepricingPage from "../pages/RepricingPage";

export const router = createBrowserRouter(
  [
    {
      path: "",
      errorElement: <ErrorPage />,
      element: <AppLayout />,
      children: [
        { index: true, element: <Navigate to="/reports" replace /> },
        { path: "/repricing", element: <RepricingPage /> },
        {
          path: "/reports",
          element: <ReportsPage />,
        },
        { path: "*", element: <Navigate to="/" replace /> },
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
