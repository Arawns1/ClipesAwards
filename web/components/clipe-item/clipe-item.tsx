import {
  ActionsComponent,
  ActionsComponentSkeleton,
  UserInfo,
  UserInfoSkeleton,
  VideoComponent,
  VideoComponentSkeleton,
} from "./components";
import { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ClipeItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function ClipeItem({ children, className, ...props }: ClipeItemProps) {
  return (
    <div
      className={twMerge(
        "rounded-lg border p-4 bg-card shadow-sm dark:bg-card-dark dark:border-card-dark-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ClipeItemSkeleton() {
  return (
    <div className="rounded-lg border p-4 bg-card shadow-sm dark:bg-card-dark dark:border-card-dark-border">
      <UserInfoSkeleton />
      <VideoComponentSkeleton />
    </div>
  );
}

ClipeItem.User = UserInfo;
ClipeItem.Video = VideoComponent;
ClipeItem.Actions = ActionsComponent;
ClipeItem.Skeleton = ClipeItemSkeleton;

export default ClipeItem;
