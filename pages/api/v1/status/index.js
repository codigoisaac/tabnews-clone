import database from "/infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const dbVersionQuery = await database.query("SHOW server_version;");
  const dbVersion = dbVersionQuery.rows[0].server_version;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersion,
      },
    },
  });
}

export default status;
