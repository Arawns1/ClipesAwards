import { FastifyInstance } from "fastify";
import { getAllClips } from "./get-all-clips";
import { ping } from "./ping";
import { status } from "./status";
import { voteOnClip } from "./vote-on-clip";
import { authMiddleware } from "../middlewares/authMIddleware";
import authRoutes from "./auth/authRoutes";
import getUser from "./get-user";

export default async function routes(app: FastifyInstance) {
  app.addHook("onRequest", authMiddleware);
  app.register(ping);
  app.register(status);
  app.register(getAllClips);
  app.register(voteOnClip);
  app.register(getUser);
  app.register(authRoutes, { prefix: "/auth" });
}
