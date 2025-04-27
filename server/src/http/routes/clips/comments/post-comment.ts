import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { NotFoundError, UnauthorizedError, ValidationError } from "src/errors";
import Comments from "models/Comment";

type NewCommentBody = {
  comment: string;
};

type PostCommentsRequest = FastifyRequest<{
  Params: { clip_id: string };
  Body: NewCommentBody;
  user?: { id: string } | null;
}>;

export async function postComment(app: FastifyInstance) {
  app.post("/", async (req: PostCommentsRequest, res: FastifyReply) => {
    console.group("[postComment]");
    console.log(`[INFO] Requisição recebida`);
    try {
      if (!req.params?.clip_id) {
        throw new ValidationError({
          message: `Parâmetro 'clip_id' não encontrado`,
          stack: new Error().stack,
          errorLocationCode: `RESOURCE:POST_COMMENT:POST_COMMENT:INVALID_PARAM`,
          key: "params",
        });
      }
      if (!req.body) {
        throw new ValidationError({
          message: `O corpo da requisição é inválido. Corrija e tente novamente.`,
          stack: new Error().stack,
          errorLocationCode: `RESOURCE:POST_COMMENT:POST_COMMENT:INVALID_BODY`,
          key: "body",
        });
      }
      if (!req.user) {
        throw new UnauthorizedError({
          message: `Usuário não autorizado. Faça login e tente novamente.`,
          stack: new Error().stack,
          errorLocationCode: `RESOURCE:POST_COMMENT:POST_COMMENT:UNAUTHORIZED_USER`,
          key: "user",
        });
      }

      const { clip_id } = req.params;
      const user = req.user as { id: string };
      const newComment = req.body;

      const commentsByClip = await Comments.save({
        clip_id,
        user_id: user.id,
        text: newComment.comment,
      });

      return res.code(200).send({ clip_id, comments: commentsByClip });
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
  });
}
