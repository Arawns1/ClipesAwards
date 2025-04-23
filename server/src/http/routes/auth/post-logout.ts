import { FastifyInstance } from "fastify";
import { clearAuthCookies } from "src/http/cookies/auth-cookies";

export async function postLogout(app: FastifyInstance) {
  app.post("/logout", async (req, res) => {
    try {
      req.user = null;
      clearAuthCookies(res);
      res.code(200);
    } catch (err) {
      console.error("[ERROR] Erro interno: ", err);
      return res
        .code(500)
        .send({ error: "Erro interno. Tente novamente mais tarde" });
    }
  });
}
