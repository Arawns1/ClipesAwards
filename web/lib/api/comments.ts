import { CommentDTO } from "@/@types/Comments";
import { env } from "@/env";
import { parseApiError } from "./parse-api-error";

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
    const body = await response.json().catch(() => ({}));
    throw parseApiError({ ...body, statusCode: response.status });
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
    const body = await response.json().catch(() => ({}));
    throw parseApiError({ ...body, statusCode: response.status });
  }
  const data: CommentDTO = await response.json();
  return data;
}
