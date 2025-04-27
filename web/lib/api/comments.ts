import { env } from "@/env";
import { CommentDTO } from "@/@types/Comments";

export async function getCommentsByClipId(clipId: string): Promise<CommentDTO> {
  const fetchURL = new URL(
    `/api/clips/${clipId}/comments`,
    env.NEXT_PUBLIC_BASE_API_URL,
  );

  const response = await fetch(fetchURL.toString(), {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar os comentários");
  }

  const data: CommentDTO = await response.json();
  return data;
}

export async function postComment(
  clipId: string,
  comment: string,
): Promise<CommentDTO> {
  const fetchURL = new URL(
    `/api/clips/${clipId}/comments`,
    env.NEXT_PUBLIC_BASE_API_URL,
  );

  const body = { comment };

  const response = await fetch(fetchURL.toString(), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Erro ao salvar comentario");
  }

  const data: CommentDTO = await response.json();
  return data;
}
