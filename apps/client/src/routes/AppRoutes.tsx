
import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "@/components/pages/Login";
import SignUp from "@/components/pages/SignUp";
import { Dashboard } from "@/components/pages/Dashboard";
import UserDashboard from "@/components/pages/UserDashboard";
import TransactionListCard from "@/components/pages/TransactionListCard";
import { PageNotFound } from "@/components/pages/PageNotFound";

import RouterOutlet from "@/routes/RouterOutlet";
import RoleRedirect from "@/routes/RoleRedirect";

import { UserRole } from "@e-pocket-assignment/shared/enums";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RoleRedirect />,
  },

  // Public routes
  {
    element: <RouterOutlet />,
    children: [
      {
        path: "auth",
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

  // Admin and SuperAdmin routes
  {
    element: (
      <RouterOutlet
        allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      />
    ),
    path: "/admin",
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "transactions",
        element: <TransactionListCard />,
      },
    ],
  },

  // User routes
  {
    element: <RouterOutlet allowedRoles={[UserRole.USER]} />,
    path: "/dashboard",
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
    ],
  },

  {
    path: "*",
    element: <PageNotFound />,
  },
]);
