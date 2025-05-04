import { FastifyInstance } from "fastify";
import { InternalServerError } from "src/errors";

export async function ping(app: FastifyInstance) {
  app.get("/ping", (request, response) => {
    console.group("[ping]");
    console.log(`[INFO] Requisição recebida`);
    try {
      return response.status(200).send("Pong!");
    } catch (err) {
      console.error("[ERROR] Erro interno: ", err);
      err = new InternalServerError(err);
      return response.code(err.statusCode).send(err);
    } finally {
      console.info(`[INFO] Requisição finalizada`);
      console.groupEnd();
    }
  });
}
