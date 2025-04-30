"use client";

import { MessageCircle } from "lucide-react";

interface CommentsComponentProps {
  initialCommentsCount: number;
  onClick: () => void;
}
export default function CommentsComponent({
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
