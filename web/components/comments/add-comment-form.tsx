import { ApiError } from "@/@types/Errors";
import { usePostComment } from "@/hooks/useComments";
import { Info } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

type Props = {
  clipId: string | null;
};

export default function AddCommentForm({ clipId }: Props) {
  const { mutate, isPending, isError, error } = usePostComment(clipId ?? "");

  const handleAddComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const text = (formData.get("comment") as string).trim();

    if (!text || !clipId) return;
    mutate(text);
    event.currentTarget.reset();
  };

  if (isError) {
    const err = error as ApiError;
    error.message = err.message;
  }

  return (
    <div>
      <form
        id="add-comment-form"
        className="flex gap-2 pt-2 border-t border-gray-700"
        onSubmit={handleAddComment}
      >
        <Textarea
          name="comment"
          placeholder="Digite seu comentário"
          data-state={isError ? "error" : "default"}
          className="data-[state=error]:border-destructive resize-none"
          disabled={isPending}
          maxLength={280}
        />
        <Button form="add-comment-form" type="submit" disabled={isPending}>
          Enviar
        </Button>
      </form>
      {isError && (
        <div className="text-destructive text-xs flex justify-start items-center gap-1 mt-2">
          <Info size={18} strokeWidth={1.5} />
          <span>{error?.message}</span>
        </div>
      )}
    </div>
  );
}
