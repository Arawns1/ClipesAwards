import { FastifyInstance } from "fastify";
import { getDiscordCallback } from "./get-discord-callback";
import { getLogin } from "./get-login";
import { postLogout } from "./post-logout";

export default async function authRoutes(app: FastifyInstance) {
  app.register(getLogin);
  app.register(getDiscordCallback);
  app.register(postLogout);
}
