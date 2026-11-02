import type { IUser } from "@e-pocket-assignment/shared/interfaces";
import { UserAvatar } from "@/components/pages/nav/UserAvatar";

export interface UserInfoProps {
  user: IUser;
  fallback?: string;
}

export const UserNavInfo = ({ user, fallback }: UserInfoProps) => {
  return (
    <>
      <UserAvatar avatar={user?.avatar ?? fallback} fallback={fallback} />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user?.userName}</span>
        <span className="truncate text-xs text-muted-foreground">
          {user?.email}
        </span>
      </div>
    </>
  );
};
