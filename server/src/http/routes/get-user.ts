import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { InternalServerError, UnauthorizedError } from "src/errors";

export default async function getUser(app: FastifyInstance) {
  app.get("/me", async (req: FastifyRequest, res: FastifyReply) => {
    console.group("[getUser]");
    console.log(`[INFO] Requisição recebida`);
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError({
          message: `Usuário não autorizado. Faça login e tente novamente.`,
          stack: new Error().stack,
          errorLocationCode: `RESOURCE:GET_USER:GET_USER:UNAUTHORIZED_USER`,
          key: "user",
        });
      }

      return res.status(200).send(user);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        return res.code(err.statusCode).send(err);
      }

      console.error("[ERROR] Erro interno: ", err);
      err = new InternalServerError(err);
      return res.code(err.statusCode).send(err);
    } finally {
      console.info(`[INFO] Requisição finalizada`);
      console.groupEnd();
    }
  });
}
