const dotenv = require("dotenv");
dotenv.config();

if (!process.env.DISCORD_TOKEN)
  throw new Error(
    "Variável de ambiente DISCORD_PUBLIC_KEY não definida ou não encontrada",
  );
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!process.env.DISCORD_PUBLIC_KEY)
  throw new Error(
    "Variável de ambiente DISCORD_PUBLIC_KEY não definida ou não encontrada",
  );
export const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

if (!process.env.DISCORD_CLIENT_ID)
  throw new Error(
    "Variável de ambiente DISCORD_CLIENT_ID não definida ou não encontrada",
  );
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;

if (!process.env.ID_CANAL_CLIPES)
  throw new Error(
    "Variável de ambiente ID_CANAL_CLIPES não definida ou não encontrada",
  );
export const ID_CANAL_CLIPES = process.env.ID_CANAL_CLIPES;

if (!process.env.DISCORD_GUILD_ID)
  throw new Error(
    "Variável de ambiente DISCORD_GUILD_ID não definida ou não encontrada",
  );
export const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

export const PORT = parseInt(process.env.PORT || "3100", 10);
export const HOST = "RENDER" in process.env ? `0.0.0.0` : `localhost`;
export const BASE_URL =
  "RENDER_EXTERNAL_URL" in process.env
    ? process.env.RENDER_EXTERNAL_URL
    : `http://${HOST}:${PORT}`;
