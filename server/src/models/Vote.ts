import database from "infra/database";
import { NotFoundError } from "src/errors";
import Clip from "./Clip";
import Users from "./Users";

type VoteId = { clipId: string; userId: string };
export type VoteType = "up" | "down";
type ParamsOptions = {
  throwable: boolean;
};

async function findOneById(voteId: VoteId, options?: ParamsOptions) {
  const { clipId, userId } = voteId;
  const queryText = `SELECT * FROM vote WHERE clip_id = $1 AND user_id = $2 LIMIT 1`;
  const query = {
    text: queryText,
    values: [clipId, userId],
  };

  const results = await database.query(query);
  if (results.rowCount === 0 && options.throwable) {
    throw new NotFoundError({
      message: `Voto com o ID especificado não foi encontrado.`,
      action: `Por favor, verifique se o 'clipId' e o 'userId' estão corretos.`,
      stack: new Error().stack,
      errorLocationCode: "MODEL:VOTE:FIND_ONE_BY_ID:NOT_FOUND",
      key: "voteId",
    });
  }

  return results.rows[0];
}

type SaveVoteParams = VoteId & { voteType: VoteType };
async function save(newVote: SaveVoteParams) {
  const { clipId, userId, voteType } = newVote;

  const clip = await Clip.findOneById(clipId, { throwable: false });
  if (!clip) {
    await Clip.save(clipId);
  }

  await Users.findOneById(userId, { throwable: true });

  const queryText = `
    INSERT INTO vote (clip_id, user_id, vote_type)
    VALUES ($1, $2, $3)
    ON CONFLICT (clip_id, user_id)
    DO UPDATE SET vote_type = $3
    RETURNING *;
  `;
  const query = {
    text: queryText,
    values: [clipId, userId, voteType.toUpperCase()],
  };

  const results = await database.query(query);
  return results.rows[0];
}

async function getTotalVotes(clipId: string) {
  const queryText = ` SELECT total_votes FROM calculated_votes_view WHERE clip_id = $1;`;
  const query = {
    text: queryText,
    values: [clipId],
  };

  const results = await database.query(query);
  return results.rows[0] ? Number(results.rows[0].total_votes) : 0;
}

type DeleteVoteParams = VoteId & { voteType: VoteType };
async function exclude(vote: DeleteVoteParams) {
  const { clipId, userId, voteType } = vote;

  const deleteQueryText = `
    DELETE FROM vote
    WHERE clip_id = $1 AND user_id = $2 AND vote_type = $3
    RETURNING *;
  `;
  const deleteQuery = {
    text: deleteQueryText,
    values: [clipId, userId, voteType.toUpperCase()],
  };

  const deleteResults = await database.query(deleteQuery);
  return deleteResults.rows[0];
}

export default Object.freeze({ findOneById, save, getTotalVotes, exclude });
