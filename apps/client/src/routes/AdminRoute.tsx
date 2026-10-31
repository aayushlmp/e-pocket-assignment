import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@e-pocket-assignment/shared/enums";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const role = user?.role;

  if (!isAuthenticated || (role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;