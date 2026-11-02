import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { UserDropdownMenuTrigger } from "./UserDropdownMenuTrigger";
import { UserDropdownMenuContent } from "./UserDropdownMenuContent";

interface UserDropdownMenuProps {
  trigger?: React.ReactElement;
}

export const UserDropdownMenu = ({ trigger }: UserDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <UserDropdownMenuTrigger trigger={trigger} />
      <UserDropdownMenuContent />
    </DropdownMenu>
  );
};
