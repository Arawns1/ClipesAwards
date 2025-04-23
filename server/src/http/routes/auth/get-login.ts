import { FastifyInstance } from "fastify";
import { DISCORD_OAUTH_LOGIN_URL } from "src/constants";

export async function getLogin(app: FastifyInstance) {
  app.get("/login", async (req, res) => {
    res.redirect(DISCORD_OAUTH_LOGIN_URL);
  });
}
