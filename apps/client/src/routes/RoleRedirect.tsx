
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@e-pocket-assignment/shared/enums";

const RoleRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const dashboard =
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.SUPER_ADMIN
      ? "/admin/dashboard"
      : "/dashboard";

  return <Navigate to={dashboard} replace />;
};

export default RoleRedirect;
