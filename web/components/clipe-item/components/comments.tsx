"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { useGetComments, usePostComment } from "@/hooks/useComments";

interface CommentsDialogProps {
  open: boolean;
  clipId: string | null;
  onOpenChange: (open: boolean) => void;
}

function CommentsDialog({ open, clipId, onOpenChange }: CommentsDialogProps) {
  const [commentText, setCommentText] = useState("");

  const { data, isLoading } = useGetComments(clipId ?? "");
  const { mutate } = usePostComment(clipId ?? "");

  const handleAddComment = () => {
    const text = commentText.trim();
    if (!text || !clipId) return;
    mutate(text);
    setCommentText("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border p-4 h-[500px] w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-3xl bg-card shadow-sm dark:bg-card-dark dark:border-card-dark-border z-[9999] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Comentários</DialogTitle>
        </DialogHeader>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {isLoading ? (
            <p>Carregando comentários...</p>
          ) : data && data.comments.length > 0 ? (
            data!.comments.map((comentario) => (
              <div
                key={comentario.id}
                className="flex items-start gap-3 mr-4 p-4 rounded-lg border text-sm dark:bg-gray-700 dark:text-gray-200"
              >
                <Avatar className="w-8 h-8 rounded-full overflow-hidden">
                  <AvatarImage
                    className="w-[40px] h-full object-cover rounded-full"
                    src={comentario.user.avatar_url}
                    alt={comentario.user.username}
                  />
                  <AvatarFallback>
                    {comentario.user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{comentario.user.username}</p>
                  <p>{comentario.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2 pt-2 border-t border-gray-700">
          <Input
            placeholder="Digite seu comentário"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddComment();
            }}
          />
          <Button onClick={handleAddComment}>Enviar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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

export { CommentsComponent, CommentsDialog };
