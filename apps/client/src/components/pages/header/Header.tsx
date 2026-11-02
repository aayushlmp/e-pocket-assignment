import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import navigationData from "@/config/navigation.json"
import { UserDropdownMenu } from "@/components/pages/nav/UserDropdownMenu"
import { UserAvatar } from "@/components/pages/nav/UserAvatar"

export const Header = () => {
  const { user, getUserInitials } = useAuth()
  const location = useLocation()
  const role = (user?.role as string) || "User"
  const items: { title: string; url: string }[] =
    (navigationData as Record<string, { title: string; url: string; icon: string }[]>)[role] || []
  const currentItem = items.find(
    (item) => location.pathname === item.url || location.pathname.startsWith(item.url + "/")
  )
  const title = currentItem ? currentItem.title : "Dashboard"
  const initials = getUserInitials();
  
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-10"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          {/* Swapped asChild to the render prop syntax */}
          <UserDropdownMenu trigger={
            <button
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <UserAvatar avatar={user?.avatar || initials} fallback={initials} />
            </button>
          }/>
        </div>
      </div>
    </header>
  )
}
