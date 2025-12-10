import database from "infra/database";
import orchestrator from "infra/scripts/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await cleanDatabase();

  async function cleanDatabase() {
    await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  }
});

describe("GET to api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Getting pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
