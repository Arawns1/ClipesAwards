import { FastifyInstance } from "fastify";
import database from "infra/database";
import { InternalServerError } from "src/errors";

export async function status(app: FastifyInstance) {
  app.get("/status", async (request, response) => {
    console.group("[status]");
    console.log(`[INFO] Requisição recebida`);
    try {
      const updatedAt = new Date().toISOString();
      const dbVersionResult = await database.query({
        text: "SHOW server_version;",
      });
      const dbVersionValue = dbVersionResult.rows[0].server_version;

      const dbMaxConnectionsResult = await database.query({
        text: "SHOW max_connections;",
      });
      const dbMaxConnectionsValue =
        dbMaxConnectionsResult.rows[0].max_connections;

      const dbName = process.env.POSTGRES_DB;
      const dbOpenConnectionsResult = await database.query({
        text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
        values: [dbName],
      });
      const dbOpenConnectionsValue = dbOpenConnectionsResult.rows[0].count;
      const poolMaxConnections = database.pool.options.max;
      const poolIdleClients = database.pool.idleCount;
      const poolTotalClients = database.pool.totalCount;

      const responseBody = {
        updated_at: updatedAt,
        dependencies: {
          database: {
            max_connections: parseInt(dbMaxConnectionsValue),
            opened_connections: dbOpenConnectionsValue,
            version: dbVersionValue,
            pool_max_connections: poolMaxConnections,
            pool_idle_clients: poolIdleClients, // conexões ociosas
            pool_connected_clients: poolTotalClients, // total de clientes conectados
          },
        },
      };

      return response.status(200).send(responseBody);
    } catch (err) {
      console.error("[ERROR] Erro interno: ", err);
      err = new InternalServerError(err);
      return response.code(err.statusCode).send(err);
    } finally {
      console.info(`[INFO] Requisição finalizada`);
      console.groupEnd();
    }
  });
}
