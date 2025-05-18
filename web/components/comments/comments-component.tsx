"use client";

import { MessageCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface CommentsComponentProps {
  initialCommentsCount: number;
  onClick: () => void;
}
function CommentsComponent({
  initialCommentsCount,
  onClick,
}: CommentsComponentProps) {
  return (
    <div
      className="relative hover:text-blue-500 transition cursor-pointer"
      onClick={onClick}
    >
      <MessageCircle />
      {initialCommentsCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {initialCommentsCount}
        </span>
      )}
    </div>
  );
}

function CommentsComponentSkeleton() {
  return (
    <div className="flex justify-center items-center mt-2 gap-2">
      <Skeleton className="w-[36px] h-[36px]" />
    </div>
  );
}

export { CommentsComponent, CommentsComponentSkeleton };
