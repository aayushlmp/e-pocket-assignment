import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BanknoteArrowUp,
} from "lucide-react";
import { MainNavigation } from "@/components/pages/MainNavigation";
import { NavUser } from "@/components/pages/NavUser";
import { Logo } from "@/components/pages/Logo";
import { useAuth } from "@/contexts/AuthContext";
import type { LucideIcon } from "lucide-react";
import navigationData from "@/config/navigation.json";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  BanknoteArrowUp,
};

export const NavSideBar = ({ ...props }) => {
  const { state } = useSidebar();
  const { user } = useAuth();
  const role = user?.role || "User";
  const logo = state === "collapsed" ? `/remittance-logo.svg` : `/logo.svg`;

  const items: { title: string; url: string; icon?: LucideIcon }[] = (navigationData as Record<string, { title: string; url: string; icon: string }[]>)[role]?.map((item) => ({
    ...item,
    icon: iconMap[item.icon] || LayoutDashboard,
  })) || [];

  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Swapped asChild to the render prop syntax */}
            <SidebarMenuButton
              render={
                <Logo src={logo} />
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <MainNavigation items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
