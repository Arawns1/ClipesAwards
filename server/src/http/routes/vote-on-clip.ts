import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import vote, { VoteType } from "models/Vote";
import { NotFoundError, ValidationError } from "src/errors";

type voteOnClipBody = {
  user_id: string;
  vote_type: VoteType;
};

type voteOnClipRequest = FastifyRequest<{
  Params: { clip_id?: string | null };
  Body: voteOnClipBody;
}>;

export async function voteOnClip(app: FastifyInstance) {
  app.post(
    "/clips/:clip_id/vote",
    async (req: voteOnClipRequest, res: FastifyReply) => {
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

        const { clip_id: clipId } = req.params;
        const { user_id: userId, vote_type: voteType } = req.body;

        const voteSaved = await vote.save({ clipId, userId, voteType });
        const totalVotes = await vote.getTotalVotes(clipId);

        res.status(200).send({ ...voteSaved, totalVotes });
      } catch (err) {
        if (err instanceof NotFoundError || err instanceof ValidationError) {
          return res.code(err.statusCode).send(err);
        }

        console.error("[ERROR] Erro interno: ", err);
        return res
          .code(500)
          .send({ error: "Erro interno. Tente novamente mais tarde" });
      }
    },
  );
}
