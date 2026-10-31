import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "@/components/pages/Login";
import SignUp from "@/components/pages/SignUp";
import { Dashboard } from "@/components/pages/Dashboard";
import { PageNotFound } from "@/components/pages/PageNotFound";

import AuthLayout from "@/layouts/AuthLayout";
import Layout from "@/layouts/Layout";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import TransactionListCard from "@/components/pages/TransactionListCard";

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
            element: <TransactionListCard />
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);