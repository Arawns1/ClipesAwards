import { CommentDTO } from "@/@types/Comments";
import { getCommentsByClipId, postComment } from "@/lib/api/comments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetComments(clipId: string) {
  return useQuery<CommentDTO, Error>({
    queryKey: ["comments", clipId] as const,
    queryFn: () => getCommentsByClipId(clipId),
    refetchOnWindowFocus: false,
    retry: 0,
  });
}

function usePostComment(clipId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: string) => postComment(clipId, comment),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["comments", clipId] });
      queryClient.invalidateQueries({ queryKey: ["clip-stats", clipId] });
    },
  });
}

export { useGetComments, usePostComment };
