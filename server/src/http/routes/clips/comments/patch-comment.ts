import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "src/errors";
import Comments from "models/Comment";

type PatchCommentBody = {
  comment: string;
};

type PatchCommentRequest = FastifyRequest<{
  Params: { clip_id: string; comment_id: string };
  Body: PatchCommentBody;
  user?: { id: string } | null;
}>;

export async function patchComment(app: FastifyInstance) {
  app.patch(
    "/:comment_id",
    async (req: PatchCommentRequest, res: FastifyReply) => {
      console.group("[patchComment]");
      console.log(`[INFO] Requisição recebida`);
      try {
        if (!req.params?.clip_id) {
          throw new ValidationError({
            message: `Parâmetro 'clip_id' não encontrado`,
            stack: new Error().stack,
            errorLocationCode: `RESOURCE:PATCH_COMMENT:PATCH_COMMENT:INVALID_PARAM`,
            key: "clip_id",
          });
        }
        if (!req.params?.comment_id) {
          throw new ValidationError({
            message: `Parâmetro 'comment_id' não encontrado`,
            stack: new Error().stack,
            errorLocationCode: `RESOURCE:PATCH_COMMENT:PATCH_COMMENT:INVALID_PARAM`,
            key: "comment_id",
          });
        }
        if (!req.body) {
          throw new ValidationError({
            message: `O corpo da requisição é inválido. Corrija e tente novamente.`,
            stack: new Error().stack,
            errorLocationCode: `RESOURCE:PATCH_COMMENT:PATCH_COMMENT:INVALID_BODY`,
            key: "body",
          });
        }
        if (!req.user) {
          throw new UnauthorizedError({
            message: `Usuário não autorizado. Faça login e tente novamente.`,
            stack: new Error().stack,
            errorLocationCode: `RESOURCE:PATCH_COMMENT:PATCH_COMMENT:UNAUTHORIZED_USER`,
            key: "user",
          });
        }

        const { clip_id, comment_id } = req.params;
        const user = req.user as { id: string };
        const newComment = req.body;

        await Comments.update(comment_id, {
          clip_id,
          user_id: user.id,
          text: newComment.comment,
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

        err = new InternalServerError(err);
        return res.code(err.statusCode).send(err);
      } finally {
        console.info(`[INFO] Requisição finalizada`);
        console.groupEnd();
      }
    },
  );
}
