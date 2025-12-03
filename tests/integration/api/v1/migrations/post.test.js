import database from "infra/database";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

test("POST /migrations", async () => {
  // First run - should run migrations

  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  const responseBody = await response.json();

  expect(response.status).toBe(201);
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

  // Second run - should not have migrations to run

  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  const response1Body = await response1.json();

  expect(response1.status).toBe(200);
  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBe(0);
});
