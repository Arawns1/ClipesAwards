import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import Comments from "models/Comment";
import { NotFoundError } from "src/errors";

type GetCommentsRequest = FastifyRequest<{
  Params: { clip_id?: string | null };
}>;

export async function getAllComments(app: FastifyInstance) {
  app.get("/", async (req: GetCommentsRequest, res: FastifyReply) => {
    console.group("[getAllComments]");
    console.log(`[INFO] Requisição recebida`);
    try {
      const { clip_id } = req.params;

      const commentsByClip = await Comments.findAllByClipId(clip_id);

      return res.code(200).send({ clip_id, comments: commentsByClip });
    } catch (err) {
      if (err instanceof NotFoundError) {
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
