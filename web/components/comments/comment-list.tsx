import { useGetComments } from "@/hooks/useComments";
import { MessageCircleDashed } from "lucide-react";
import { CommentItem, CommentItemSkeleton } from "./comment-item";

type Props = {
  clipId: string | null;
};

export default function CommentList({ clipId }: Props) {
  const { data, isLoading, isPending, isRefetching } = useGetComments(
    clipId ?? "",
  );

  if (isLoading || isPending || isRefetching) {
    return (
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        <CommentItemSkeleton />
        <CommentItemSkeleton />
        <CommentItemSkeleton />
        <CommentItemSkeleton />
      </div>
    );
  }

  if (!data || data.comments.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 ">
        <MessageCircleDashed size={64} className="text-muted-foreground mb-4" />
        <h4 className="text-sm font-semibold text-muted-foreground leading-0.5">
          Nenhum comentário ainda...
        </h4>
        <span className="text-xs text-muted-foreground">
          Por que não ser o primeiro?
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
      {data!.comments.map((comentario) => (
        <CommentItem key={comentario.id} data={comentario} />
      ))}
    </div>
  );
}
