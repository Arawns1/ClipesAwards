import { DecodePayloadType, UserType } from "@fastify/jwt";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import Users from "models/Users";
import { clearAuthCookies } from "../cookies/auth-cookies";

type JWTDecoded = {
  sub: string;
  iat: number;
  ext: number;
};

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
    const jwtDecoded = await request.jwtDecode<JWTDecoded>();
    const userId = jwtDecoded.sub;
    request.user = await Users.findOneById(userId);
  } catch (error) {
    request.user = null;
    clearAuthCookies(reply);
  }
}
