import { ApiError } from "@/@types/Errors";

export function parseApiError(err: unknown): ApiError {
  if (
    err &&
    typeof err === "object" &&
    "name" in err &&
    "message" in err &&
    "statusCode" in err
  ) {
    return err as ApiError;
  }

  return {
    name: "UnknownError",
    message: "Erro desconhecido ao se comunicar com a API.",
    statusCode: 500,
  };
}
