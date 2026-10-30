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

const navigations = {
  items: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: BanknoteArrowUp,
    },
    // {
    //   title: "Users",
    //   url: "/users",
    //   icon: UserGroup,
    // },
  ],
};

export const NavSideBar = ({ ...props }) => {
  const {state} = useSidebar();
  const logo = state === "collapsed" ? `/remittance-logo.svg` : `/logo.svg`;
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
        <MainNavigation items={navigations.items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
