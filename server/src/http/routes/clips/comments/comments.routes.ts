import { FastifyInstance } from "fastify";
import { getAllComments } from "./get-comments";
import { postComment } from "./post-comment";

export default async function commentsRoutes(app: FastifyInstance) {
  app.register(getAllComments);
  app.register(postComment);
}
