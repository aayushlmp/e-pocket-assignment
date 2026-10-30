import { Header } from "@/components/pages/Header";
import { NavSideBar } from "@/components/pages/NavSideBar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <SidebarProvider>
      <NavSideBar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 w-full">
            <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
