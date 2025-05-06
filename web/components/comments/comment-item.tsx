import { Comment } from "@/@types/Comments";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import dateFormatter from "@/lib/date";
import { Skeleton } from "../ui/skeleton";

type Props = {
  data: Comment;
};

function CommentItem({ data }: Props) {
  const { id, user, created_at, text } = data;

  return (
    <div
      key={id}
      className="flex items-start gap-3 mr-4 p-4 rounded-lg border text-sm bg-secondary text-secondary-foreground"
    >
      <Avatar className="w-8 h-8 rounded-full overflow-hidden">
        <AvatarImage
          className="w-[40px] h-full object-cover rounded-full"
          src={user.avatar_url}
          alt={user.username}
        />
        <AvatarFallback>
          {user.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="w-full">
        <div className="flex gap-1 items-center">
          <p className="font-semibold capitalize">{user.username}</p>
          <span className="text-xs text-muted-foreground">
            {dateFormatter(created_at)}
          </span>
        </div>
        <span className="break-all">{text}</span>
      </div>
    </div>
  );
}

function CommentItemSkeleton() {
  return (
    <div className="h-[74px] flex items-start gap-3 mr-4 p-4 rounded-lg border text-sm bg-secondary text-secondary animate-pulse">
      <Skeleton className="aspect-square w-8 h-8 rounded-full brightness-125" />
      <div>
        <div className="flex gap-1 items-center mb-2">
          <Skeleton className="w-[60px] h-[12px] brightness-125" />
          <Skeleton className="w-[80px] h-[10px] brightness-125" />
        </div>
        <Skeleton className="w-[120px] h-[14px] brightness-125" />
      </div>
    </div>
  );
}

export { CommentItem, CommentItemSkeleton };
