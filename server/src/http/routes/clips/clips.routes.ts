import { FastifyInstance } from "fastify";
import { getAllClips } from "./get-all-clips";
import { voteOnClip } from "./vote-on-clip";
import commentsRoutes from "./comments/comments.routes";
import { getClipStats } from "./get-clip-stats";

export default async function clipsRoutes(app: FastifyInstance) {
  app.register(getAllClips);
  app.register(voteOnClip);
  app.register(getClipStats);
  app.register(commentsRoutes, { prefix: "/:clip_id/comments" });
}
