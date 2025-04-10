"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CommentsComponent() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([...comments, comment.trim()]);
      setComment("");
    }
  };

  return (
    <div className="flex items-center mt-2">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative">
            <MessageCircle className="ml-2 cursor-pointer hover:text-blue-500 transition" />
            {comments.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {comments.length}
              </span>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="border p-4 h-[500px] w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-3xl bg-card shadow-sm dark:bg-card-dark dark:border-card-dark-border z-[9999] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center mb-4">Comentários</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {comments.length > 0 ? (
              comments.map((comment, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 mr-4 p-4 rounded-lg border text-sm dark:bg-gray-700 dark:text-gray-200"
                >
                  <Avatar className="w-8 h-8 rounded-full overflow-hidden">
                    <AvatarImage
                      className="w-[40px] h-full object-cover rounded-full"
                      src="https://github.com/shadcn.png"
                      alt="Icone do usuário"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {comment}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
            )}
          </div>
          <div className="flex gap-2 pt-2 border-t border-gray-700">
            <Input
              placeholder="Digite seu comentário"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddComment();
                }
              }}
            />
            <Button onClick={handleAddComment}>Enviar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
