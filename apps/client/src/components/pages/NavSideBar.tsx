import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BanknoteArrowUp,
  UserGroup,
  GalleryVerticalEnd,
} from "lucide-react";
import { MainNavigation } from "@/components/pages/MainNavigation";
import { NavUser } from "@/components/pages/NavUser";

const navigations = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  items: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
    },
    {
      title: "Transactions",
      url: "#",
      icon: BanknoteArrowUp,
    },
    {
      title: "Users",
      url: "#",
      icon: UserGroup,
    },
  ],
};

export const NavSideBar = ({ ...props }) => {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Swapped asChild to the render prop syntax */}
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={
                <a href="#">
                  <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <span className="text-base font-semibold">
                    Remittance Inc.
                  </span>
                </a>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <MainNavigation items={navigations.items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigations.user} />
      </SidebarFooter>
    </Sidebar>
  );
};
