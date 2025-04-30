import { FastifyInstance } from "fastify";
import { InternalServerError } from "src/errors";
import { clearAuthCookies } from "src/http/cookies/auth-cookies";

export async function postLogout(app: FastifyInstance) {
  app.post("/logout", async (req, res) => {
    try {
      req.user = null;
      clearAuthCookies(res);
      res.code(200);
    } catch (err) {
      console.error("[ERROR] Erro interno: ", err);
      err = new InternalServerError(err);
      return res.code(err.statusCode).send(err);
    }
  });
}
