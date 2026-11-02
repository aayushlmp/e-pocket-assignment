
import { UserDropdownMenuTrigger } from "@/components/pages/nav/UserDropdownMenuTrigger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserNavInfo } from "@/components/pages/nav/UserNavInfo";
import type { IUser } from "@e-pocket-assignment/shared/interfaces";
import { SignOutMenuItem } from "@/components/pages/nav/SignOutMenuItem";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

interface UserDropdownMenuProps {
  trigger?: React.ReactElement;
}

export const UserDropdownMenu = ({ trigger }: UserDropdownMenuProps) => {
  const { isMobile } = useSidebar();
  const { user, getUserInitials } = useAuth();
  const initials = getUserInitials();
  return (
    <DropdownMenu>
      <UserDropdownMenuTrigger trigger={trigger} />
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
      >
        {/* 2. Wrapped the DropdownMenuLabel inside a DropdownMenuGroup */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <UserNavInfo user={user as IUser} fallback={initials} />
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <SignOutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
