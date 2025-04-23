import { env } from "@/env";

export async function getUser() {
  const response = await fetch(`${env.NEXT_PUBLIC_BASE_API_URL}/api/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao votar no clipe");
  }

  return await response.json();
}
