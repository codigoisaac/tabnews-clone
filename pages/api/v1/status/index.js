import db from "/infra/database.js";

export default async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const dbVersionQuery = await db.query("SHOW server_version;");
  const dbVersion = dbVersionQuery.rows[0].server_version;

  const dbMaxConnectionsQuery = await db.query("SHOW max_connections;");
  const dbMaxConnections = parseInt(
    dbMaxConnectionsQuery.rows[0].max_connections,
  );

  const dbName = process.env.POSTGRES_DB;
  const dbOpenedConnectionsQuery = await db.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dbName],
  });
  const dbOpenedConnections = dbOpenedConnectionsQuery.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersion,
        max_connections: dbMaxConnections,
        opened_connections: dbOpenedConnections,
      },
    },
  });
}
