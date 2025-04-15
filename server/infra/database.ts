import { Pool, QueryConfig } from "pg";
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  ssl: getSSLValues(),
  max: 5, // número máximo de conexões simultâneas
  idleTimeoutMillis: 30000, // desconecta conexões ociosas após 30 segundos
  connectionTimeoutMillis: 2000, // erro se não conseguir conectar em 2 segundos
});

async function query(queryObject: QueryConfig) {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("Database query error:", {
      query: queryObject?.text,
      values: queryObject?.values,
      error,
    });
    throw error;
  } finally {
    if (client) client.release();
  }
}
export default {
  query,
  pool,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}
