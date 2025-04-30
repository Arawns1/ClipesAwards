import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import Comments from "models/Comment";
import {
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "src/errors";

type GetCommentsRequest = FastifyRequest<{
  Params: { clip_id?: string | null };
}>;

export async function getAllComments(app: FastifyInstance) {
  app.get("/", async (req: GetCommentsRequest, res: FastifyReply) => {
    console.group("[getAllComments]");
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
      const { clip_id } = req.params;

      const commentsByClip = await Comments.findAllByClipId(clip_id);

      return res.code(200).send({ clip_id, comments: commentsByClip });
    } catch (err) {
      if (err instanceof NotFoundError || err instanceof ValidationError) {
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
