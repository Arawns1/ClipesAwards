import database from "infra/database";
import { NotFoundError } from "src/errors";

type ParamsOptions = {
  throwable: boolean;
};

async function findOneById(clipId: string, options?: ParamsOptions) {
  const queryText = `SELECT * FROM clip WHERE id = $1 LIMIT 1`;
  const query = {
    text: queryText,
    values: [clipId],
  };

  const results = await database.query(query);

  if (results.rowCount === 0 && options?.throwable) {
    throw new NotFoundError({
      message: `O clip com o ID '${clipId}' não foi encontrado no sistema.`,
      action: 'Verifique se o "id" está digitado corretamente.',
      stack: new Error().stack,
      errorLocationCode: "MODEL:CLIP:FIND_ONE_BY_ID:NOT_FOUND",
      key: "id",
    });
  }

  return results.rows[0];
}

async function save(clipId: string) {
  const queryText = `
      INSERT INTO clip (id)
      VALUES ($1)
      RETURNING *;
    `;
  const query = {
    text: queryText,
    values: [clipId],
  };

  const results = await database.query(query);
  return results.rows[0];
}

export default Object.freeze({ findOneById, save });
