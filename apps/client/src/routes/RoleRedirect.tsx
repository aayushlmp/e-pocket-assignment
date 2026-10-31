import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@e-pocket-assignment/shared/enums";

export const RoleRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const role = user?.role;

  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Default for User or any other role
  return <Navigate to="/dashboard" replace />;
};

export default RoleRedirect;