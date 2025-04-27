import { FastifyInstance } from "fastify";
import { getAllComments } from "./get-comments";
import { postComment } from "./post-comment";
import { patchComment } from "./patch-comment";

export default async function commentsRoutes(app: FastifyInstance) {
  app.register(getAllComments);
  app.register(postComment);
  app.register(patchComment);
}
