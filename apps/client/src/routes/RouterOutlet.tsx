
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@e-pocket-assignment/shared/enums";
import RoleRedirect from "./RoleRedirect";
import LayoutWrapper from "@/layouts/LayoutWrapper";

interface RouterOutletProps {
  allowedRoles?: UserRole[];
}

const RouterOutlet = ({ allowedRoles = [] }: RouterOutletProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const isPublic = allowedRoles.length === 0;
  const hasAccess = allowedRoles.includes(user?.role as UserRole);

  if (isPublic ? isAuthenticated : !isAuthenticated || !hasAccess) {
    return isAuthenticated ? (
      <RoleRedirect />
    ) : (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <LayoutWrapper />;
};

export default RouterOutlet;
