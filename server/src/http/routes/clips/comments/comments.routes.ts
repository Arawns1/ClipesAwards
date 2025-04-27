import { FastifyInstance } from "fastify";
import { getAllComments } from "./get-comments";

export default async function commentsRoutes(app: FastifyInstance) {
  app.register(getAllComments);
}
