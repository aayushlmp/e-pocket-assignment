import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "@/components/pages/Login";
import SignUp from "@/components/pages/SignUp";
import AuthLayout from "@/layouts/AuthLayout";
import { PageNotFound } from "@/components/pages/PageNotFound";
import Layout from "@/layouts/Layout";
import { Dashboard } from "@/components/pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
    //   { path: "transactions", element: <h>transactions</h1> },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
