import { Logo } from "@/components/pages/Logo";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo />
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
