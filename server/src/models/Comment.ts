import database from "infra/database";
import { NotFoundError } from "src/errors";
type ParamsOptions = {
  throwable: boolean;
};

async function findAllByClipId(clipId: string, options?: ParamsOptions) {
  const queryText = `SELECT c.id, c.text, c.created_at, u.avatar_url, u.username 
                     FROM comment c 
                     JOIN users u ON c.user_id = u.id 
                     WHERE c.clip_id = $1`;
  const query = {
    text: queryText,
    values: [clipId],
  };

  const results = await database.query(query);
  if (results.rowCount === 0 && options?.throwable) {
    throw new NotFoundError({
      message: `Comentários não encontrados para o clipe de ID: ${clipId}.`,
      action: `Por favor, verifique se o 'clipId' está correto.`,
      stack: new Error().stack,
      errorLocationCode: "MODEL:COMMENTS:FIND_ALL_BY_CLIP_ID:NOT_FOUND",
      key: "clipId",
    });
  }

  return results.rows.map((row) => ({
    id: row.id,
    text: row.text,
    created_at: row.created_at,
    user: {
      avatar_url: row.avatar_url,
      username: row.username,
    },
  }));
}

type SaveCommentParams = {
  clip_id: string;
  user_id: string;
  text: string;
};
async function save(comment: SaveCommentParams) {
  const queryText = `
          INSERT INTO comment (text, clip_id, user_id)
          VALUES ($1, $2, $3)
          RETURNING *;
        `;
  const query = {
    text: queryText,
    values: [comment.text, comment.clip_id, comment.user_id],
  };

  const results = await database.query(query);
  return results.rows[0];
}

async function countCommentsByClipId(clipId: string) {
  const queryText = `
           SELECT COUNT(*) as comments_count
           FROM comment
           WHERE clip_id = $1
        `;
  const query = {
    text: queryText,
    values: [clipId],
  };

  const results = await database.query(query);
  return results.rows[0] ? Number(results.rows[0].comments_count) : 0;
}

export default Object.freeze({ findAllByClipId, save, countCommentsByClipId });
