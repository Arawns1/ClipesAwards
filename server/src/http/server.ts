import fastify from "fastify";
import cors from "@fastify/cors";
import { BASE_URL, HOST, PORT } from "src/constants";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import routes from "./routes/app.routes";

export const startServer = async () => {
  const app = fastify();

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  await app.register(cors, {
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    cookie: {
      cookieName: process.env.COOKIE_TOKEN_NAME,
      signed: true,
    },
  });
  app.register(routes, { prefix: "/api" });

  try {
    app.listen({ port: PORT, host: HOST }).then(() => {
      console.log(`🚀 HTTP server running on ${BASE_URL}/api`);
    });
  } catch (err) {
    console.error("Erro ao iniciar o servidor Fastify", err);
    process.exit(1);
  }
};
