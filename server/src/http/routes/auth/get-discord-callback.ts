import { FastifyInstance, FastifyRequest } from "fastify";
import Users from "models/Users";
import axios from "axios";
import {
  DISCORD_GET_ACCESS_TOKEN_URL,
  DISCORD_GET_USER_PROFILE_URL,
  TOKEN_DAYS_EXPIRATION,
} from "src/constants";
import { UnauthorizedError } from "src/errors";
import { setAuthCookies } from "src/http/cookies/auth-cookies";

type DiscordAuthCallbackRequest = FastifyRequest<{
  Querystring: { code?: string | null };
}>;

type DiscordAPITokenResponse = {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

type DiscordAPIUserResponse = {
  id: string;
  username: string;
  avatar: string;
};

export async function getDiscordCallback(app: FastifyInstance) {
  app.get("/discord/callback", async (req: DiscordAuthCallbackRequest, res) => {
    try {
      const { code } = req.query;
      if (!code) {
        throw new UnauthorizedError({
          message: `Authorization code não encontrado.`,
          stack: new Error().stack,
          errorLocationCode: `RESOURCE:GET_DISCORD_CALLBACK:GET_DISCORD_CALLBACK:AUTHORIZATION_CODE_MISSING`,
          key: "authorization_code",
        });
      }

      const tokenData = await fetchDiscordAccessToken(code);
      const userData = await fetchDiscordUserProfile(tokenData.access_token);

      const { id, username, avatar } = userData;
      const avatar_url = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;

      await Users.save({ id, avatar_url, username });

      const token = app.jwt.sign(
        {},
        {
          sub: id,
          expiresIn: `${TOKEN_DAYS_EXPIRATION}d`,
        },
      );

      setAuthCookies(res, token);

      return res.redirect(process.env.CLIENT_URL!);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return res.code(error.statusCode).send(error);
      }
      console.error("[ERROR] Erro interno: ", error);
      return res
        .code(500)
        .send({ error: "Erro interno. Tente novamente mais tarde" });
    }
  });
}

async function fetchDiscordAccessToken(code: string) {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URL!,
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept-Encoding": "application/x-www-form-urlencoded",
  };

  const response = await axios.post<DiscordAPITokenResponse>(
    DISCORD_GET_ACCESS_TOKEN_URL,
    params,
    { headers },
  );

  return response.data;
}

async function fetchDiscordUserProfile(accessToken: string) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await axios.get<DiscordAPIUserResponse>(
    DISCORD_GET_USER_PROFILE_URL,
    { headers },
  );

  return response.data;
}
