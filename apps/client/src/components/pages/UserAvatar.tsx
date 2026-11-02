import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface UserAvatarProps {
  avatar: string | null | undefined;
  fallback?: string
}
export const UserAvatar = ({ avatar, fallback }: UserAvatarProps) => {
  return (
    <Avatar className="h-8 w-8 rounded-lg grayscale">
      <AvatarImage src={avatar ?? ""} alt={avatar ?? fallback} />
      <AvatarFallback className="rounded-lg">{fallback}</AvatarFallback>
    </Avatar>
  );
};
