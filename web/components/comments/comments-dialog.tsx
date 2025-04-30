"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AddCommentForm from "./add-comment-form";
import CommentList from "./comment-list";

interface CommentsDialogProps {
  open: boolean;
  clipId: string | null;
  onOpenChange: (open: boolean) => void;
}

export default function CommentsDialog({
  open,
  clipId,
  onOpenChange,
}: CommentsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border p-4 h-[500px] w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-3xl bg-card shadow-sm dark:bg-card-dark dark:border-card-dark-border z-[9999] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Comentários</DialogTitle>
        </DialogHeader>
        <CommentList clipId={clipId} />
        <AddCommentForm clipId={clipId} />
      </DialogContent>
    </Dialog>
  );
}
