import { env } from "@/env";
import { QueryFunctionContext } from "@tanstack/react-query";
import { parseApiError } from "./parse-api-error";

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
    const body = await response.json().catch(() => ({}));
    throw parseApiError({ ...body, statusCode: response.status });
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

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw parseApiError({ ...body, statusCode: response.status });
  }

  return await response.json();
}

async function getClipStats(clipId: string) {
  const fetchURL = `${env.NEXT_PUBLIC_BASE_API_URL}/api/clips/${clipId}/stats`;

  const response = await fetch(fetchURL, {
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

  return await response.json();
}

export { getAllClips, voteOnClip, getClipStats };
