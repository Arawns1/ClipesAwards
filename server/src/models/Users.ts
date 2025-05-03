import database from "infra/database";
import { NotFoundError } from "src/errors";

type ParamsOptions = {
  throwable: boolean;
};

async function findOneById(userId: string, options?: ParamsOptions) {
  const queryText = `SELECT * FROM users WHERE id = $1 LIMIT 1`;
  const query = {
    text: queryText,
    values: [userId],
  };

  const results = await database.query(query);

  if (results.rowCount === 0 && options?.throwable) {
    throw new NotFoundError({
      message: `O user com o ID '${userId}' não foi encontrado no sistema.`,
      action: 'Verifique se o "id" está digitado corretamente.',
      stack: new Error().stack,
      errorLocationCode: "MODEL:USER:FIND_ONE_BY_ID:NOT_FOUND",
      key: "id",
    });
  }

  return results.rows[0];
}

type SaveUserParams = {
  id: string;
  avatar_url: string;
  username: string;
};
async function save(user: SaveUserParams) {
  const queryText = `
        INSERT INTO users (id, avatar_url, username)
        VALUES ($1, $2, $3)
        ON CONFLICT (id)
        DO UPDATE SET avatar_url = $2, username = $3
        RETURNING *;
      `;
  const query = {
    text: queryText,
    values: [user.id, user.avatar_url, user.username],
  };

  const results = await database.query(query);
  return results.rows[0];
}

export default Object.freeze({ findOneById, save });
