import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { UserNavInfo } from "@/components/pages/UserNavInfo";
import { useAuth } from "@/contexts/AuthContext";
import type { IUser } from "@e-pocket-assignment/shared/interfaces";
import { SignOutMenuItem } from "@/components/pages/SignOutMenuItem";

export const UserDropdownMenuContent = () => {
  const { isMobile } = useSidebar();
  const { user, getUserInitials } = useAuth();
  const initials = getUserInitials();
  return (
    <>
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
    </>
  );
};
