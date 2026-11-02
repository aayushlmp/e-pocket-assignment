import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { EllipsisVertical } from "lucide-react";
import { UserNavInfo } from "@/components/pages/UserNavInfo";
import type { IUser } from "@e-pocket-assignment/shared/interfaces";
import type React from "react";

interface UserDropdownMenuTriggerProps {
  trigger?: React.ReactElement;
}

export const UserDropdownMenuTrigger = ({
  trigger,
}: UserDropdownMenuTriggerProps) => {
  const { user, getUserInitials } = useAuth();
  const initials = getUserInitials();

  const defaultTrigger = (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
      <UserNavInfo user={user as IUser} fallback={initials} />
      <EllipsisVertical className="ml-auto size-4" />
    </SidebarMenuButton>
  );

  return (
    <DropdownMenuTrigger render={trigger ?? defaultTrigger} />
  );
};