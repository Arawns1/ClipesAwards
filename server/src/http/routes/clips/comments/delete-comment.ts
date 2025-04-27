import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { NotFoundError, UnauthorizedError, ValidationError } from "src/errors";
import Comments from "models/Comment";

type PatchCommentRequest = FastifyRequest<{
  Params: { clip_id: string; comment_id: string };
  user?: { id: string } | null;
}>;

export async function deleteComment(app: FastifyInstance) {
  app.delete(
    "/:comment_id",
    async (req: PatchCommentRequest, res: FastifyReply) => {
      console.group("[deleteComment]");
      console.log(`[INFO] Requisição recebida`);
      try {
        if (!req.params?.clip_id) {
          throw new ValidationError({
            message: `Parâmetro 'clip_id' não encontrado`,
            stack: new Error().stack,
            errorLocationCode: `RESOURCE:DELETE_COMMENT:DELETE_COMMENT:INVALID_PARAM`,
            key: "clip_id",
          });
        }
        if (!req.params?.comment_id) {
          throw new ValidationError({
            message: `Parâmetro 'comment_id' não encontrado`,
            stack: new Error().stack,
            errorLocationCode: `RESOURCE:DELETE_COMMENT:DELETE_COMMENT:INVALID_PARAM`,
            key: "comment_id",
          });
        }
        if (!req.user) {
          throw new UnauthorizedError({
            message: `Usuário não autorizado. Faça login e tente novamente.`,
            stack: new Error().stack,
            errorLocationCode: `RESOURCE:DELETE_COMMENT:DELETE_COMMENT:UNAUTHORIZED_USER`,
            key: "user",
          });
        }

        const { clip_id, comment_id } = req.params;
        const user = req.user as { id: string };

        await Comments.exclude(comment_id, {
          clip_id,
          user_id: user.id,
        });

        return res.code(204).send();
      } catch (err) {
        if (
          err instanceof NotFoundError ||
          err instanceof ValidationError ||
          err instanceof UnauthorizedError
        ) {
          return res.code(err.statusCode).send(err);
        }

        console.error("[ERROR] Erro interno: ", err);

        return res
          .code(500)
          .send({ error: "Erro interno. Tente novamente mais tarde" });
      } finally {
        console.info(`[INFO] Requisição finalizada`);
        console.groupEnd();
      }
    },
  );
}
