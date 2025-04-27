import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import Vote, { VoteType } from "models/Vote";
import { NotFoundError, UnauthorizedError, ValidationError } from "src/errors";

type voteOnClipBody = {
  vote_type: VoteType;
};

type voteOnClipRequest = FastifyRequest<{
  Params: { clip_id?: string | null };
  Body: voteOnClipBody;
}> & { user?: { id: string } };

export async function voteOnClip(app: FastifyInstance) {
  app.post(
    "/:clip_id/vote",
    async (req: voteOnClipRequest, res: FastifyReply) => {
      console.group("[voteOnClip]");
      console.log(`[INFO] Requisição recebida`);
      try {
        if (!req.params?.clip_id) {
          throw new ValidationError({
            message: `Parâmetro 'clip_id' não encontrado`,
            stack: new Error().stack,
            errorLocationCode: `RESOURCE:VOTE_ON_CLIP:VOTE_ON_CLIP:INVALID_PARAM`,
            key: "params",
          });
        }
        if (!req.body) {
          throw new ValidationError({
            message: `O corpo da requisição é inválido. Corrija e tente novamente.`,
            stack: new Error().stack,
            errorLocationCode: `RESOURCE:VOTE_ON_CLIP:VOTE_ON_CLIP:INVALID_BODY`,
            key: "body",
          });
        }
        if (!req.user) {
          throw new UnauthorizedError({
            message: `Usuário não autorizado. Faça login e tente novamente.`,
            stack: new Error().stack,
            errorLocationCode: `RESOURCE:VOTE_ON_CLIP:VOTE_ON_CLIP:UNAUTHORIZED_USER`,
            key: "user",
          });
        }

        const { clip_id: clipId } = req.params;
        const { vote_type: voteType } = req.body;
        const userId = req.user.id;

        const existingVote = await Vote.findOneById(
          { clipId, userId },
          { throwable: false },
        );

        if (existingVote && existingVote.vote_type === voteType.toUpperCase()) {
          await Vote.exclude({ clipId, userId, voteType });
        } else {
          await Vote.save({ clipId, userId, voteType });
        }

        const totalVotes = await Vote.getTotalVotes(clipId);

        res.status(200).send({ total_votes: totalVotes });
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
