import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "@/services/auth.service";

export const SignOutMenuItem = () => {
    const { signOutSuccessHandler } = useAuth();

    const handleSignOut = async (event: React.MouseEvent) => {
        event.preventDefault();
        try {
        const response = await signOut();
        if (response) {
            toast.success(response.data.message || "Logged out successfully");
            signOutSuccessHandler();
        }
        } catch (error: any) {
        toast.error(error.message);
        }
    };
    return (
        <>
            <DropdownMenuItem onClick={handleSignOut}>
                <LogOut />
                Log out
            </DropdownMenuItem>
        </>
    );
}