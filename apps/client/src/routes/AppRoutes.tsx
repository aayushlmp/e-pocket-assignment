import { createBrowserRouter, Navigate } from "react-router-dom";

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
            lazy: async () => {
              const { default: Login } = await import(
                "@/components/pages/Login"
              );
              return { Component: Login };
            },
            hydrateFallbackElement: <div>Loading...</div>,
          },
          {
            path: "signup",
            lazy: async () => {
              const { default: SignUp } = await import(
                "@/components/pages/SignUp"
              );
              return { Component: SignUp };
            },
            hydrateFallbackElement: <div>Loading...</div>,
          },
        ],
      },
    ],
  },

  // Admin and SuperAdmin routes
  {
    path: "/admin",
    element: (
      <RouterOutlet
        allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      />
    ),
    children: [
      {
        path: "dashboard",
        lazy: async () => {
          const { Dashboard } = await import(
            "@/components/pages/Dashboard"
          );
          return { Component: Dashboard };
        },
      },
      {
        path: "transactions",
        lazy: async () => {
          const { default: TransactionListCard } = await import(
            "@/components/pages/TransactionListCard"
          );
          return { Component: TransactionListCard };
        },
      },
    ],
  },

  // User routes
  {
    path: "/dashboard",
    element: <RouterOutlet allowedRoles={[UserRole.USER]} />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: UserDashboard } = await import(
            "@/components/pages/UserDashboard"
          );
          return { Component: UserDashboard };
        },
      },
    ],
  },

  // Not found
  {
    path: "*",
    lazy: async () => {
      const { PageNotFound } = await import(
        "@/components/pages/PageNotFound"
      );
      return { Component: PageNotFound };
    },
  },
]);