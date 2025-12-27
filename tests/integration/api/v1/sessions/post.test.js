import orchestrator from "infra/scripts/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST to api/v1/sessions", () => {
  describe("Anonymous user", () => {
    test("With incorrect 'email' but correct 'password'", async () => {
      await orchestrator.createUser({
        password: "correct-password",
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "wrong.email@isaacmuniz.pro",
          password: "correct-password",
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Credentials were not accepted.",
        action: "Check if the data you submitted is correct.",
        status_code: 401,
      });
    });

    test("With correct 'email' but incorrect 'password'", async () => {
      await orchestrator.createUser({
        email: "correct.email@isaacmuniz.pro",
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "correct.email@isaacmuniz.pro",
          password: "wrong-password",
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Credentials were not accepted.",
        action: "Check if the data you submitted is correct.",
        status_code: 401,
      });
    });

    test("With incorrect 'email' and incorrect 'password'", async () => {
      await orchestrator.createUser();

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "wrong.email@isaacmuniz.pro",
          password: "wrong-password",
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Credentials were not accepted.",
        action: "Check if the data you submitted is correct.",
        status_code: 401,
      });
    });
  });
});
