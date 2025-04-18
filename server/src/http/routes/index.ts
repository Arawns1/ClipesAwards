import { FastifyInstance } from "fastify";
import { getAllClips } from "./get-all-clips";
import { ping } from "./ping";
import { status } from "./status";
import { voteOnClip } from "./vote-on-clip";

export default async function routes(app: FastifyInstance) {
  app.register(ping);
  app.register(status);
  app.register(getAllClips);
  app.register(voteOnClip);
}
