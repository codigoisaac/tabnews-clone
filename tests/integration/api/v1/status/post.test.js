import orchestrator from "infra/scripts/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST to api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Trying a not allowed POST method", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });

      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Method not allowed for this endpoint.",
        action: "Try using another HTTP method for this endpoint.",
        status_code: 405,
      });
    });
  });
});
