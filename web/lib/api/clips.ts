import { env } from "@/env";
import { QueryFunctionContext } from "@tanstack/react-query";

async function getAllClips(params: QueryFunctionContext) {
  // const direction = params.direction;
  const cursor = params.pageParam;

  const fetchURL = new URL("/api/clips", env.NEXT_PUBLIC_BASE_API_URL);

  if (cursor) {
    fetchURL.searchParams.append("cursor", String(cursor));
    // fetchURL.searchParams.append("direction", String(direction)); //forward ou backward;
  }

  const response = await fetch(fetchURL, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar os clipes");
  }

  return await response.json();
}

async function voteOnClip(clipId: string, voteType: string) {
  const fetchURL = `${env.NEXT_PUBLIC_BASE_API_URL}/api/clips/${clipId}/vote`;
  const body = {
    vote_type: voteType,
  };

  const response = await fetch(fetchURL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    throw new ApiError(401, "Não autenticado");
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new ApiError(response.status, text || "Erro na requisição");
  }

  return response;
}

export { getAllClips, voteOnClip };

export class ApiError extends Error {
  statusCode: number;
  constructor(status: number, message?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = status;
  }
}
