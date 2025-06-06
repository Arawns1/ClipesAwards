import { FastifyInstance } from "fastify";
import getUser from "./get-user";
import { ping } from "./ping";
import { status } from "./status";
import authRoutes from "./auth/auth.routes";
import clipsRoutes from "./clips/clips.routes";
import authMiddleware from "../middlewares/auth-middleware";

export default async function routes(app: FastifyInstance) {
  app.addHook("onRequest", authMiddleware);
  app.register(ping);
  app.register(status);
  app.register(getUser);

  app.register(authRoutes, { prefix: "/auth" });
  app.register(clipsRoutes, { prefix: "/clips" });
}
