import { FastifyInstance } from "fastify";
import { getAllClips } from "./get-all-clips";
import { voteOnClip } from "./vote-on-clip";

export default async function clipsRoutes(app: FastifyInstance) {
  app.register(getAllClips);
  app.register(voteOnClip);
}
