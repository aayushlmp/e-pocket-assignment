import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "@/components/pages/Login";
import SignUp from "@/components/pages/SignUp";
import { Dashboard } from "@/components/pages/Dashboard";
import { PageNotFound } from "@/components/pages/PageNotFound";
import RoleRedirect from "@/routes/RoleRedirect";
import UserDashboard from "@/components/pages/UserDashboard";

import AuthLayout from "@/layouts/AuthLayout";
import Layout from "@/layouts/Layout";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import TransactionListCard from "@/components/pages/TransactionListCard";
import AdminRoute from "@/routes/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RoleRedirect />,
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
        path: "/admin",
        element: <AdminRoute><Layout /></AdminRoute>,
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
      {
        path: "/dashboard",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <UserDashboard />,
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