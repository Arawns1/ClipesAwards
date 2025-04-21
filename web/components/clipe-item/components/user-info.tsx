"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import dateFormatter from "@/lib/date";
import { User } from "@/@types/User";

export type UserInfoProps = {
  user: User;
  posted_at: string;
};

function UserInfo({ user, posted_at }: UserInfoProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (user && posted_at) {
      const date = new Date(posted_at);
      const formatted = dateFormatter(date);
      setFormattedDate(formatted);
      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = () => setIsLoading(false);
      img.src = user.avatar_url;
    }
  }, [user, posted_at]);

  if (isLoading || !user || !formattedDate) {
    return <UserInfoSkeleton />;
  }

  return (
    <div className="flex items-center gap-2.5 mb-4 transition-opacity duration-300">
      <Avatar>
        <AvatarImage src={user.avatar_url} />
      </Avatar>

      <div className="text-sm flex flex-col items-start flex-nowrap">
        <span className="font-semibold leading-5 capitalize">
          {user.username}
        </span>
        <span className="text-gray-500">{formattedDate}</span>
      </div>
    </div>
  );
}

function UserInfoSkeleton() {
  return (
    <div className="flex items-center gap-2.5 mb-4 animate-pulse">
      <Skeleton className="aspect-square h-[40px] w-[40px] rounded-full" />
      <div className="text-sm flex flex-col items-start gap-1">
        <Skeleton className="w-[100px] h-[12px]" />
        <Skeleton className="w-[180px] h-[12px]" />
      </div>
    </div>
  );
}

export { UserInfo, UserInfoSkeleton };
