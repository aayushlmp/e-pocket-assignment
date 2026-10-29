import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "@/components/pages/Login";
import SignUp from "@/components/pages/SignUp";
import { Dashboard } from "@/components/pages/Dashboard";
import { PageNotFound } from "@/components/pages/PageNotFound";

import AuthLayout from "@/layouts/AuthLayout";
import Layout from "@/layouts/Layout";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="login" replace />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "signup",
            element: <SignUp />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "transactions",
            element: <h1>Transactions</h1>,
          },
          {
            path: "users",
            element: <h1>Users</h1>,
          },
          // Add other protected pages here.
          // { path: "transactions", element: <Transactions /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);