import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup, // Make sure this is exported from your dropdown-menu file
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { signOut } from "@/services/auth.service"
import { EllipsisVertical, LogOut } from "lucide-react"
import { toast } from "sonner"

export const NavUser = () => {
  const { isMobile } = useSidebar();
  const { user, signOutSuccessHandler } = useAuth();

  const handleSignOut = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      const response = await signOut();
      if(response) {
        toast.success(response.data.message || "Logged out successfully");
        signOutSuccessHandler();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* 1. Replaced asChild with Base UI's render prop */}
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user?.avatar ?? ''} alt={user?.firstName} />
                  <AvatarFallback className="rounded-lg">{user?.firstName.charAt(0).toUpperCase()}{user?.lastName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.userName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
                <EllipsisVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end">
            {/* 2. Wrapped the DropdownMenuLabel inside a DropdownMenuGroup */}
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar ?? ''} alt={user?.firstName} />
                  <AvatarFallback className="rounded-lg">{user?.firstName.charAt(0).toUpperCase()}{user?.lastName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.userName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
