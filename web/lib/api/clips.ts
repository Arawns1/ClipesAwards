import { QueryFunctionContext } from "@tanstack/react-query";

async function getAllClips(params: QueryFunctionContext) {
  // const direction = params.direction;
  const cursor = params.pageParam;

  const fetchURL = new URL("/api/clips", process.env.NEXT_PUBLIC_BASE_API_URL);

  if (cursor) {
    fetchURL.searchParams.append("cursor", String(cursor));
    // fetchURL.searchParams.append("direction", String(direction)); //forward ou backward;
  }

  const response = await fetch(fetchURL);

  if (!response.ok) {
    throw new Error("Erro ao buscar os clipes");
  }

  return await response.json();
}

async function voteOnClip(clipId: string, userId: string, voteType: string) {
  const fetchURL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/clips/${clipId}/vote`;
  const body = {
    user_id: userId || "198930202967932928",
    vote_type: voteType,
  };

  const response = await fetch(fetchURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Erro ao votar no clipe");
  }

  return await response.json();
}

export { getAllClips, voteOnClip };
