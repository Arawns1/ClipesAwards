import { FastifyReply } from "fastify";
import { COOKIE_TOKEN_NAME, TOKEN_DAYS_EXPIRATION } from "src/constants";

function setAuthCookies(res: FastifyReply, token: string) {
  res.setCookie(COOKIE_TOKEN_NAME, token, {
    path: "/",
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60 * 60 * 24 * TOKEN_DAYS_EXPIRATION,
  });
}

function clearAuthCookies(reply: FastifyReply) {
  reply.clearCookie("clipes_awards_token", {
    path: "/",
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
}

export { clearAuthCookies, setAuthCookies };
