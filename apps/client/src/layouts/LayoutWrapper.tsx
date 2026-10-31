import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/layouts/AuthLayout";
import Layout from "@/layouts/Layout";

const LayoutWrapper = () => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <AuthLayout /> : <Layout />
};

export default LayoutWrapper;
