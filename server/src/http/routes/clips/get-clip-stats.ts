import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import Comment from "models/Comment";

import Vote, { VoteType } from "models/Vote";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "src/errors";

type getClipStatsRequest = FastifyRequest<{
  Params: { clip_id?: string | null };
}> & { user?: { id: string } };

export async function getClipStats(app: FastifyInstance) {
  app.get(
    "/:clip_id/stats",
    async (req: getClipStatsRequest, res: FastifyReply) => {
      console.group("[getClipStats]");
      console.log(`[INFO] Requisição recebida`);
      try {
        if (!req.params?.clip_id) {
          throw new ValidationError({
            message: `Parâmetro 'clip_id' não encontrado`,
            stack: new Error().stack,
            errorLocationCode: `RESOURCE:GET_CLIP_STATS:GET_CLIP_STATS:INVALID_PARAM`,
            key: "params",
          });
        }
        const { clip_id: clipId } = req.params;
        const user = req.user;

        let previousVote = null;

        if (user) {
          previousVote = await Vote.findOneById(
            { userId: user.id, clipId },
            { throwable: false },
          );
        }

        const [totalVotes, totalComments] = await Promise.all([
          Vote.getTotalVotes(clipId),
          Comment.countCommentsByClipId(clipId),
        ]);

        const response = {
          previous_user_vote: previousVote?.vote_type || null,
          total_votes: totalVotes,
          total_comments: totalComments,
        };

        res.status(200).send(response);
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
